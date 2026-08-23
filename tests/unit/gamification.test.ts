import { describe, it, expect } from "vitest";
import {
  achievementBadgeSchema,
  familyLevelSchema,
  LEVEL_DEFINITIONS,
} from "@/lib/validations/gamification";

describe("Gamification Schemas & Leveling System", () => {
  it("should validate a valid achievement badge object", () => {
    const valid = achievementBadgeSchema.safeParse({
      id: "b-1",
      code: "first_step",
      title: "Langkah Pertama",
      description: "Mencatat transaksi pertama",
      icon: "🎯",
      xpReward: 50,
      isUnlocked: true,
      progressPercent: 100,
    });
    expect(valid.success).toBe(true);
  });

  it("should validate a valid family level progress", () => {
    const valid = familyLevelSchema.safeParse({
      currentLevel: 2,
      levelName: "Keluarga Sadar Kas",
      currentXp: 180,
      nextLevelXp: 300,
      progressPercent: 40,
    });
    expect(valid.success).toBe(true);
  });

  it("should verify Level 1 through Level 5 definitions hierarchy", () => {
    expect(LEVEL_DEFINITIONS.length).toBe(5);
    expect(LEVEL_DEFINITIONS[0].level).toBe(1);
    expect(LEVEL_DEFINITIONS[4].level).toBe(5);
    expect(LEVEL_DEFINITIONS[4].name).toBe("Keluarga Mandiri Finansial");
  });
});
