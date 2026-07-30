import { describe, it, expect, beforeEach, afterEach, mock } from "bun:test";
import type { City } from "../../src/types/City";

const city: City = { name: "Test", latitude: 0, longitude: 0 };

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
  return await import("../../src/api/weather");
}

describe("getWeather", () => {
  it("returns temperature and time on success", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(
        mockResponse({ current: { time: "2026-07-30T12:00", temperature_2m: 22.5 } }),
      ),
    );
    const { getWeather } = await loadModule();
    const result = await getWeather(city, "celsius");
    expect(result.temperature).toBe(22.5);
    expect(result.time).toBe("2026-07-30T12:00");
  });

  it("throws when current is missing", async () => {
    globalThis.fetch = mock(() => Promise.resolve(mockResponse({})));
    const { getWeather } = await loadModule();
    expect(getWeather(city, "celsius")).rejects.toThrow("No se recibieron datos del clima");
  });

  it("throws on HTTP error", async () => {
    globalThis.fetch = mock(() => Promise.resolve(mockResponse({}, 500)));
    const { getWeather } = await loadModule();
    expect(getWeather(city, "celsius")).rejects.toThrow("Error al obtener clima: 500");
  });
});

describe("getForecast", () => {
  it("returns daily forecast array on success", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(
        mockResponse({
          daily: {
            time: ["2026-07-30", "2026-07-31"],
            temperature_2m_max: [25, 22],
            temperature_2m_min: [15, 13],
            weathercode: [0, 61],
          },
        }),
      ),
    );
    const { getForecast } = await loadModule();
    const result = await getForecast(city, "celsius");
    expect(result).toHaveLength(2);
    expect(result[0]!.date).toBe("2026-07-30");
    expect(result[0]!.tempMax).toBe(25);
    expect(result[0]!.tempMin).toBe(15);
    expect(result[0]!.weatherCode).toBe(0);
    expect(result[1]!.weatherCode).toBe(61);
  });

  it("throws when daily is missing", async () => {
    globalThis.fetch = mock(() => Promise.resolve(mockResponse({})));
    const { getForecast } = await loadModule();
    expect(getForecast(city, "celsius")).rejects.toThrow("No se recibieron datos del pronóstico");
  });
});
