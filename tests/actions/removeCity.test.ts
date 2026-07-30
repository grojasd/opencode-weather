import { describe, it, expect, afterEach, spyOn } from "bun:test";
import type { Interface } from "node:readline/promises";

let answerIndex = 0;
const mockAnswers: string[] = [];
const mockRl = {
  question: () => Promise.resolve(mockAnswers[answerIndex++] ?? ""),
} as unknown as Interface;

afterEach(() => {
  answerIndex = 0;
  mockAnswers.length = 0;
});

describe("handleRemoveCity", () => {
  it("removes a city successfully", async () => {
    const { handleRemoveCity } = await import("../../src/actions/removeCity");
    const config = {
      cities: [
        { name: "Santiago", latitude: -33.45, longitude: -70.65, country: "Chile" },
        { name: "Buenos Aires", latitude: -34.6, longitude: -58.38, country: "Argentina" },
      ],
      defaultCity: undefined,
      unit: "celsius" as const,
    };

    mockAnswers.push("1");

    const logs: string[] = [];
    spyOn(console, "log").mockImplementation((msg: string) => logs.push(msg));

    await handleRemoveCity(config, mockRl);

    expect(config.cities).toHaveLength(1);
    expect(config.cities[0]!.name).toBe("Buenos Aires");
    expect(logs.join("")).toContain("eliminada");
  });

  it("clears defaultCity when removing the default city", async () => {
    const { handleRemoveCity } = await import("../../src/actions/removeCity");
    const config = {
      cities: [
        { name: "Santiago", latitude: -33.45, longitude: -70.65, country: "Chile" },
      ],
      defaultCity: { name: "Santiago", latitude: -33.45, longitude: -70.65, country: "Chile" },
      unit: "celsius" as const,
    };

    mockAnswers.push("1");

    spyOn(console, "log");

    await handleRemoveCity(config, mockRl);

    expect(config.cities).toHaveLength(0);
    expect(config.defaultCity).toBeUndefined();
  });

  it("shows message when no cities registered", async () => {
    const { handleRemoveCity } = await import("../../src/actions/removeCity");
    const config = { cities: [], unit: "celsius" as const };

    const logs: string[] = [];
    spyOn(console, "log").mockImplementation((msg: string) => logs.push(msg));

    await handleRemoveCity(config, mockRl);

    expect(logs.join("")).toContain("No hay ciudades registradas");
  });

  it("cancels when user selects 0", async () => {
    const { handleRemoveCity } = await import("../../src/actions/removeCity");
    const config = {
      cities: [{ name: "Santiago", latitude: -33.45, longitude: -70.65, country: "Chile" }],
      unit: "celsius" as const,
    };

    mockAnswers.push("0");

    spyOn(console, "log");

    await handleRemoveCity(config, mockRl);

    expect(config.cities).toHaveLength(1);
  });
});
