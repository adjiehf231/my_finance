import { describe, it, expect } from "vitest";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";

describe("Production Readiness & Monitoring Tests", () => {
  it("should generate a valid robots.txt configuration", () => {
    const robotConfig = robots();
    expect(robotConfig.rules).toBeDefined();
    expect(robotConfig.sitemap).toBeDefined();
  });

  it("should generate a valid sitemap.xml array", () => {
    const map = sitemap();
    expect(Array.isArray(map)).toBe(true);
    expect(map.length).toBeGreaterThan(0);
    expect(map[0].priority).toBe(1.0);
  });
});
