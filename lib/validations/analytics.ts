import { z } from "zod";

export const timeframeEnum = z.enum([
  "this_month",
  "last_3_months",
  "last_6_months",
  "this_year",
]);

export const analyticsTimeframeSchema = z.object({
  familyId: z.string().uuid("Family ID tidak valid"),
  timeframe: timeframeEnum.default("this_month"),
});

export type TimeframeType = z.infer<typeof timeframeEnum>;
export type AnalyticsTimeframeInput = z.infer<typeof analyticsTimeframeSchema>;

/**
 * Helper to compute startDate and endDate based on timeframe selection
 */
export function getTimeframeDateRange(timeframe: TimeframeType): {
  startDate: string;
  endDate: string;
} {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();

  const endDate = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  let startDate = "";

  switch (timeframe) {
    case "this_month":
      startDate = `${y}-${String(m + 1).padStart(2, "0")}-01`;
      break;
    case "last_3_months": {
      const past = new Date(y, m - 2, 1);
      startDate = `${past.getFullYear()}-${String(past.getMonth() + 1).padStart(2, "0")}-01`;
      break;
    }
    case "last_6_months": {
      const past = new Date(y, m - 5, 1);
      startDate = `${past.getFullYear()}-${String(past.getMonth() + 1).padStart(2, "0")}-01`;
      break;
    }
    case "this_year":
      startDate = `${y}-01-01`;
      break;
  }

  return { startDate, endDate };
}
