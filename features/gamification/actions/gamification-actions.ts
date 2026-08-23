"use server";

import { createClient } from "@/lib/supabase/server";
import {
  LEVEL_DEFINITIONS,
  type AchievementBadge,
  type FamilyLevel,
} from "@/lib/validations/gamification";

/**
 * Get comprehensive family gamification data, badges, and level
 */
export async function getFamilyGamificationAction(familyId: string) {
  const supabase = await createClient();

  const [
    txRes,
    walletsRes,
    membersRes,
    goalsRes,
    debtsRes,
    budgetsRes,
  ] = await Promise.all([
    (supabase as any)
      .from("transactions")
      .select("id, attachment_url, transaction_date")
      .eq("family_id", familyId)
      .eq("is_deleted", false),
    (supabase as any)
      .from("wallets")
      .select("id")
      .eq("family_id", familyId)
      .eq("is_active", true),
    (supabase as any)
      .from("family_members")
      .select("id")
      .eq("family_id", familyId)
      .eq("is_active", true),
    (supabase as any)
      .from("financial_goals")
      .select("target_amount, current_amount, status")
      .eq("family_id", familyId),
    (supabase as any)
      .from("debts")
      .select("status, remaining_amount")
      .eq("family_id", familyId),
    (supabase as any)
      .from("budgets")
      .select("id")
      .eq("family_id", familyId),
  ]);

  const transactions = txRes.data || [];
  const wallets = walletsRes.data || [];
  const members = membersRes.data || [];
  const goals = goalsRes.data || [];
  const debts = debtsRes.data || [];
  const budgets = budgetsRes.data || [];

  // Badge 1: First Step (Catat transaksi pertama)
  const isFirstStep = transactions.length >= 1;

  // Badge 2: Master Saver (Capai 100% target tabungan pertama)
  const isMasterSaver = goals.some(
    (g: any) =>
      g.status === "completed" ||
      (Number(g.target_amount) > 0 && Number(g.current_amount) >= Number(g.target_amount))
  );

  // Badge 3: Shield of Safety (Menetapkan anggaran bulanan)
  const isShieldOfSafety = budgets.length >= 1;

  // Badge 4: Debt Free Hero (Melunasi setidaknya 1 pinjaman)
  const isDebtFreeHero = debts.some(
    (d: any) => d.status === "settled" || Number(d.remaining_amount) === 0
  );

  // Badge 5: AI Pioneer (Scan struk dengan AI Gemini)
  const isAiPioneer = transactions.some((t: any) => !!t.attachment_url);

  // Badge 6: Family Harmony (Undang minimal 2 anggota)
  const isFamilyHarmony = members.length >= 2;

  // Badge 7: Liquidity Master (Memiliki 3 atau lebih rekening aktif)
  const isLiquidityMaster = wallets.length >= 3;

  // Badge 8: Streak Champion (Catat minimal 7 transaksi)
  const isStreakChampion = transactions.length >= 7;

  const badges: AchievementBadge[] = [
    {
      id: "b-1",
      code: "first_step",
      title: "Langkah Pertama",
      description: "Mencatat mutasi transaksi finansial pertama di ruang kerja keluarga.",
      icon: "🎯",
      xpReward: 50,
      isUnlocked: isFirstStep,
      progressPercent: isFirstStep ? 100 : 0,
    },
    {
      id: "b-2",
      code: "master_saver",
      title: "Master Saver",
      description: "Menyelesaikan 100% target tabungan impian pertama bersama keluarga.",
      icon: "💰",
      xpReward: 150,
      isUnlocked: isMasterSaver,
      progressPercent: isMasterSaver ? 100 : 0,
    },
    {
      id: "b-3",
      code: "shield_of_safety",
      title: "Perisai Anggaran",
      description: "Menetapkan batas anggaran pengeluaran bulanan keluarga.",
      icon: "🛡️",
      xpReward: 75,
      isUnlocked: isShieldOfSafety,
      progressPercent: isShieldOfSafety ? 100 : 0,
    },
    {
      id: "b-4",
      code: "debt_free_hero",
      title: "Pahlawan Bebas Hutang",
      description: "Melunasi setidaknya satu kewajiban pinjaman hutang hingga lunas.",
      icon: "📜",
      xpReward: 200,
      isUnlocked: isDebtFreeHero,
      progressPercent: isDebtFreeHero ? 100 : 0,
    },
    {
      id: "b-5",
      code: "ai_pioneer",
      title: "AI Pioneer",
      description: "Memindai struk nota belanja dengan teknologi OCR multimodal Google Gemini.",
      icon: "🤖",
      xpReward: 100,
      isUnlocked: isAiPioneer,
      progressPercent: isAiPioneer ? 100 : 0,
    },
    {
      id: "b-6",
      code: "family_harmony",
      title: "Keluarga Harmonis",
      description: "Mengundang minimal 2 anggota keluarga ke ruang kerja bersama.",
      icon: "👨‍👩‍👧",
      xpReward: 100,
      isUnlocked: isFamilyHarmony,
      progressPercent: Math.min(100, Math.round((members.length / 2) * 100)),
    },
    {
      id: "b-7",
      code: "liquidity_master",
      title: "Master Likuiditas",
      description: "Mengelola 3 atau lebih rekening dompet (Bank, E-Wallet, Tunai).",
      icon: "🏦",
      xpReward: 80,
      isUnlocked: isLiquidityMaster,
      progressPercent: Math.min(100, Math.round((wallets.length / 3) * 100)),
    },
    {
      id: "b-8",
      code: "streak_champion",
      title: "Juara Disiplin",
      description: "Mencatat setidaknya 7 mutasi transaksi aktif dalam keluarga.",
      icon: "⚡",
      xpReward: 120,
      isUnlocked: isStreakChampion,
      progressPercent: Math.min(100, Math.round((transactions.length / 7) * 100)),
    },
  ];

  // Calculate Total XP
  let totalXp = 0;
  badges.forEach((b) => {
    if (b.isUnlocked) totalXp += b.xpReward;
  });
  // Bonus XP per transaction (5 XP each)
  totalXp += transactions.length * 5;

  // Determine Level
  let currentLevel = 1;
  let levelName = LEVEL_DEFINITIONS[0].name;
  let nextLevelXp = LEVEL_DEFINITIONS[0].maxXp;

  for (let i = LEVEL_DEFINITIONS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_DEFINITIONS[i].minXp) {
      currentLevel = LEVEL_DEFINITIONS[i].level;
      levelName = LEVEL_DEFINITIONS[i].name;
      nextLevelXp = LEVEL_DEFINITIONS[i].maxXp;
      break;
    }
  }

  const currentLevelMin = LEVEL_DEFINITIONS[currentLevel - 1].minXp;
  const xpInCurrentLevel = totalXp - currentLevelMin;
  const xpNeeded = nextLevelXp - currentLevelMin;
  const progressPercent = Math.min(100, Math.round((xpInCurrentLevel / xpNeeded) * 100));

  const familyLevel: FamilyLevel = {
    currentLevel,
    levelName,
    currentXp: totalXp,
    nextLevelXp,
    progressPercent,
  };

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  return {
    success: true,
    data: {
      level: familyLevel,
      badges,
      unlockedCount,
      totalBadges: badges.length,
    },
  };
}
