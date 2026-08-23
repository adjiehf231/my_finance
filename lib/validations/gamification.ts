import { z } from "zod";

export const achievementBadgeSchema = z.object({
  id: z.string(),
  code: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  xpReward: z.number().default(50),
  isUnlocked: z.boolean().default(false),
  unlockedAt: z.string().nullable().optional(),
  progressPercent: z.number().min(0).max(100).default(0),
});

export const familyLevelSchema = z.object({
  currentLevel: z.number().min(1).max(5),
  levelName: z.string(),
  currentXp: z.number().min(0),
  nextLevelXp: z.number().min(1),
  progressPercent: z.number().min(0).max(100),
});

export type AchievementBadge = z.infer<typeof achievementBadgeSchema>;
export type FamilyLevel = z.infer<typeof familyLevelSchema>;

export const LEVEL_DEFINITIONS = [
  { level: 1, name: "Pemula Finansial", minXp: 0, maxXp: 100 },
  { level: 2, name: "Keluarga Sadar Kas", minXp: 100, maxXp: 300 },
  { level: 3, name: "Master Anggaran", minXp: 300, maxXp: 600 },
  { level: 4, name: "Juara Akumulasi Aset", minXp: 600, maxXp: 1000 },
  { level: 5, name: "Keluarga Mandiri Finansial", minXp: 1000, maxXp: 2000 },
];
