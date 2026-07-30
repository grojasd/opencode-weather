import { describe, it, expect, afterEach, mock, spyOn } from "bun:test";
import type { Interface } from "node:readline/promises";

function mockResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status });
}

let answerIndex = 0;
const mockAnswers: string[] = [];

const mockRl = {
  question: mock(() => Promise.resolve(mockAnswers[answerIndex++] ?? "")),
} as unknown as Interface;

afterEach(() => {
  mock.restore();
  answerIndex = 0;
  mockAnswers.length = 0;
});

describe("handleAddCity", () => {
  it("adds a city successfully", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(
        mockResponse({
          results: [
            { name: "Santiago", latitude: -33.45, longitude: -70.65, country: "Chile" },
          ],
        }),
      ),
    );
    const { handleAddCity } = await import("../../src/actions/addCity");
    const config = { cities: [], unit: "celsius" as const };

    mockAnswers.push("Santiago", "1");

    const logs: string[] = [];
    spyOn(console, "log").mockImplementation((msg: string) => logs.push(msg));

    await handleAddCity(config, mockRl);

    expect(config.cities).toHaveLength(1);
    expect(config.cities[0]!.name).toBe("Santiago");
    expect(logs.join("")).toContain("agregada a la lista");
  });

  it("does not add a duplicate city", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(
        mockResponse({
          results: [
            { name: "Santiago", latitude: -33.45, longitude: -70.65, country: "Chile" },
          ],
        }),
      ),
    );
    const { handleAddCity } = await import("../../src/actions/addCity");
    const config = {
      cities: [{ name: "Santiago", latitude: -33.45, longitude: -70.65, country: "Chile" }],
      unit: "celsius" as const,
    };

    mockAnswers.push("Santiago", "1");

    const logs: string[] = [];
    spyOn(console, "log").mockImplementation((msg: string) => logs.push(msg));

    await handleAddCity(config, mockRl);
    expect(config.cities).toHaveLength(1);
    expect(logs.join("")).toContain("ya está en la lista");
  });

  it("shows message when no results found", async () => {
    globalThis.fetch = mock(() => Promise.resolve(mockResponse({ results: [] })));
    const { handleAddCity } = await import("../../src/actions/addCity");
    const config = { cities: [], unit: "celsius" as const };

    mockAnswers.push("XYZ");

    const logs: string[] = [];
    spyOn(console, "log").mockImplementation((msg: string) => logs.push(msg));

    await handleAddCity(config, mockRl);
    expect(config.cities).toHaveLength(0);
    expect(logs.join("")).toContain("No se encontraron ciudades");
  });

  it("cancels when user selects 0", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(
        mockResponse({
          results: [
            { name: "Santiago", latitude: -33.45, longitude: -70.65, country: "Chile" },
          ],
        }),
      ),
    );
    const { handleAddCity } = await import("../../src/actions/addCity");
    const config = { cities: [], unit: "celsius" as const };

    mockAnswers.push("Santiago", "0");

    const logs: string[] = [];
    spyOn(console, "log").mockImplementation((msg: string) => logs.push(msg));

    await handleAddCity(config, mockRl);
    expect(config.cities).toHaveLength(0);
  });

  it("does nothing on empty query", async () => {
    const { handleAddCity } = await import("../../src/actions/addCity");
    const config = { cities: [], unit: "celsius" as const };

    mockAnswers.push("  ");

    await handleAddCity(config, mockRl);
    expect(config.cities).toHaveLength(0);
  });
});
