import { describe, it, expect, afterEach, mock, spyOn } from "bun:test";
import type { Interface } from "node:readline/promises";

function mockResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status });
}

let answerIndex = 0;
const mockAnswers: string[] = [];
const mockRl = {
  question: () => Promise.resolve(mockAnswers[answerIndex++] ?? ""),
} as unknown as Interface;

afterEach(() => {
  mock.restore();
  answerIndex = 0;
  mockAnswers.length = 0;
});

describe("handleSetDefaultCity", () => {
  it("sets default from existing cities list", async () => {
    const { handleSetDefaultCity } = await import("../../src/actions/setDefaultCity");
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

    await handleSetDefaultCity(config, mockRl);

    expect(config.defaultCity).toBeDefined();
    expect(config.defaultCity!.name).toBe("Santiago");
    expect(logs.join("")).toContain("Ciudad default establecida");
  });

  it("searches and sets default from new city", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(
        mockResponse({
          results: [
            { name: "Miami", latitude: 25.76, longitude: -80.19, country: "United States" },
          ],
        }),
      ),
    );
    const { handleSetDefaultCity } = await import("../../src/actions/setDefaultCity");
    const config = {
      cities: [{ name: "Santiago", latitude: -33.45, longitude: -70.65, country: "Chile" }],
      defaultCity: undefined,
      unit: "celsius" as const,
    };

    mockAnswers.push("2", "Miami", "1");

    const logs: string[] = [];
    spyOn(console, "log").mockImplementation((msg: string) => logs.push(msg));

    await handleSetDefaultCity(config, mockRl);

    expect(config.cities).toHaveLength(2);
    expect(config.defaultCity!.name).toBe("Miami");
    expect(logs.join("")).toContain("Ciudad default establecida");
  });

  it("shows message when search finds no results", async () => {
    globalThis.fetch = mock(() => Promise.resolve(mockResponse({ results: [] })));
    const { handleSetDefaultCity } = await import("../../src/actions/setDefaultCity");
    const config = {
      cities: [{ name: "Santiago", latitude: -33.45, longitude: -70.65, country: "Chile" }],
      defaultCity: undefined,
      unit: "celsius" as const,
    };

    mockAnswers.push("2", "XYZ");

    const logs: string[] = [];
    spyOn(console, "log").mockImplementation((msg: string) => logs.push(msg));

    await handleSetDefaultCity(config, mockRl);

    expect(config.defaultCity).toBeUndefined();
    expect(logs.join("")).toContain("No se encontraron ciudades");
  });
});
