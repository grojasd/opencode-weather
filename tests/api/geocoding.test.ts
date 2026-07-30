import { describe, it, expect, beforeEach, afterEach, mock } from "bun:test";

function mockResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status });
}

beforeEach(() => {
  globalThis.fetch = mock(() => Promise.resolve(mockResponse({})));
});

afterEach(() => {
  mock.restore();
});

async function loadModule() {
  return await import("../../src/api/geocoding");
}

describe("searchCity", () => {
  it("returns parsed cities on success", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(
        mockResponse({
          results: [
            { name: "Santiago", latitude: -33.45, longitude: -70.65, country: "Chile" },
            { name: "Santiago de Compostela", latitude: 42.88, longitude: -8.54, country: "Spain" },
          ],
        }),
      ),
    );
    const { searchCity } = await loadModule();
    const cities = await searchCity("Santiago");
    expect(cities).toHaveLength(2);
    expect(cities[0]!.name).toBe("Santiago");
    expect(cities[0]!.country).toBe("Chile");
    expect(cities[1]!.name).toBe("Santiago de Compostela");
  });

  it("returns empty array when no results field", async () => {
    globalThis.fetch = mock(() => Promise.resolve(mockResponse({})));
    const { searchCity } = await loadModule();
    const cities = await searchCity("xyz");
    expect(cities).toEqual([]);
  });

  it("returns empty array when results is empty", async () => {
    globalThis.fetch = mock(() => Promise.resolve(mockResponse({ results: [] })));
    const { searchCity } = await loadModule();
    const cities = await searchCity("xyz");
    expect(cities).toEqual([]);
  });

  it("throws on HTTP error", async () => {
    globalThis.fetch = mock(() => Promise.resolve(mockResponse({}, 500)));
    const { searchCity } = await loadModule();
    expect(searchCity("test")).rejects.toThrow("Error al buscar ciudad: 500");
  });

  it("throws on network error", async () => {
    globalThis.fetch = mock(() => Promise.reject(new Error("Network failure")));
    const { searchCity } = await loadModule();
    expect(searchCity("test")).rejects.toThrow("Network failure");
  });
});
