import { describe, it, expect, afterEach, mock, spyOn } from "bun:test";

function mockResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status });
}

afterEach(() => {
  mock.restore();
});

describe("getWeather actions", () => {
  it("handleCurrentWeatherDefault shows weather for default city", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(
        mockResponse({ current: { time: "2026-07-30T12:00", temperature_2m: 20 } }),
      ),
    );
    const { handleCurrentWeatherDefault } = await import("../../src/actions/getWeather");
    const config = {
      defaultCity: { name: "Santiago", latitude: -33.45, longitude: -70.65, country: "Chile" },
      cities: [],
      unit: "celsius" as const,
    };

    const logs: string[] = [];
    spyOn(console, "log").mockImplementation((msg: string) => logs.push(msg));

    await handleCurrentWeatherDefault(config);

    const output = logs.join("");
    expect(output).toContain("Santiago, Chile");
    expect(output).toContain("20");
    expect(output).toContain("°C");
    expect(output).toContain("2026-07-30T12:00");
  });

  it("handleCurrentWeatherDefault prints info when no default city", async () => {
    const { handleCurrentWeatherDefault } = await import("../../src/actions/getWeather");
    const config = { defaultCity: undefined, cities: [], unit: "celsius" as const };

    const logs: string[] = [];
    spyOn(console, "log").mockImplementation((msg: string) => logs.push(msg));

    await handleCurrentWeatherDefault(config);
    expect(logs.join("")).toContain("No hay ciudad default");
  });

  it("handleCurrentWeatherAll shows weather for all cities", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(
        mockResponse({ current: { time: "12:00", temperature_2m: 20 } }),
      ),
    );
    const { handleCurrentWeatherAll } = await import("../../src/actions/getWeather");
    const config = {
      cities: [
        { name: "Santiago", latitude: -33.45, longitude: -70.65, country: "Chile" },
        { name: "Buenos Aires", latitude: -34.6, longitude: -58.38, country: "Argentina" },
      ],
      unit: "celsius" as const,
    };

    const logs: string[] = [];
    spyOn(console, "log").mockImplementation((msg: string) => logs.push(msg));

    await handleCurrentWeatherAll(config);

    const output = logs.join("");
    expect(output).toContain("Santiago");
    expect(output).toContain("Buenos Aires");
    expect(output).toContain("20");
  });

  it("handleCurrentWeatherAll prints info when no cities", async () => {
    const { handleCurrentWeatherAll } = await import("../../src/actions/getWeather");
    const config = { cities: [], unit: "celsius" as const };

    const logs: string[] = [];
    spyOn(console, "log").mockImplementation((msg: string) => logs.push(msg));

    await handleCurrentWeatherAll(config);
    expect(logs.join("")).toContain("No hay ciudades registradas");
  });
});

describe("forecast actions", () => {
  it("handleForecastDefault shows forecast for default city", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(
        mockResponse({
          daily: {
            time: ["2026-07-30"],
            temperature_2m_max: [25],
            temperature_2m_min: [15],
            weathercode: [0],
          },
        }),
      ),
    );
    const { handleForecastDefault } = await import("../../src/actions/getWeather");
    const config = {
      defaultCity: { name: "Santiago", latitude: -33.45, longitude: -70.65, country: "Chile" },
      cities: [],
      unit: "celsius" as const,
    };

    const logs: string[] = [];
    spyOn(console, "log").mockImplementation((msg: string) => logs.push(msg));

    await handleForecastDefault(config);

    const output = logs.join("");
    expect(output).toContain("Pronóstico 7 días");
    expect(output).toContain("Santiago");
    expect(output).toContain("jue");
    expect(output).toContain("30/07");
    expect(output).toContain("15°C");
    expect(output).toContain("25°C");
    expect(output).toContain("☀️");
    expect(output).toContain("Despejado");
  });

  it("handleForecastDefault prints info when no default city", async () => {
    const { handleForecastDefault } = await import("../../src/actions/getWeather");
    const config = { defaultCity: undefined, cities: [], unit: "celsius" as const };

    const logs: string[] = [];
    spyOn(console, "log").mockImplementation((msg: string) => logs.push(msg));

    await handleForecastDefault(config);
    expect(logs.join("")).toContain("No hay ciudad default");
  });

  it("handleForecastAll shows forecast for all cities", async () => {
    globalThis.fetch = mock(() =>
      Promise.resolve(
        mockResponse({
          daily: {
            time: ["2026-07-30"],
            temperature_2m_max: [25],
            temperature_2m_min: [15],
            weathercode: [0],
          },
        }),
      ),
    );
    const { handleForecastAll } = await import("../../src/actions/getWeather");
    const config = {
      cities: [
        { name: "Santiago", latitude: -33.45, longitude: -70.65, country: "Chile" },
      ],
      unit: "celsius" as const,
    };

    const logs: string[] = [];
    spyOn(console, "log").mockImplementation((msg: string) => logs.push(msg));

    await handleForecastAll(config);

    const output = logs.join("");
    expect(output).toContain("Pronóstico 7 días");
    expect(output).toContain("Santiago");
    expect(output).toContain("jue");
  });

  it("handleForecastAll prints info when no cities", async () => {
    const { handleForecastAll } = await import("../../src/actions/getWeather");
    const config = { cities: [], unit: "celsius" as const };

    const logs: string[] = [];
    spyOn(console, "log").mockImplementation((msg: string) => logs.push(msg));

    await handleForecastAll(config);
    expect(logs.join("")).toContain("No hay ciudades registradas");
  });
});
