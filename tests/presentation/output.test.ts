import { describe, it, expect, spyOn } from "bun:test";

describe("output", () => {
  it("showSuccess prints message in green", async () => {
    const { showSuccess } = await import("../../src/presentation/output");
    const logs: string[] = [];
    spyOn(console, "log").mockImplementation((msg: string) => logs.push(msg));

    showSuccess("todo ok");
    expect(logs[0]).toContain("\x1b[32m");
    expect(logs[0]).toContain("todo ok");
    expect(logs[0]).toContain("\x1b[0m");
  });

  it("showError prints message with Error prefix in red", async () => {
    const { showError } = await import("../../src/presentation/output");
    const logs: string[] = [];
    spyOn(console, "log").mockImplementation((msg: string) => logs.push(msg));

    showError("algo salió mal");
    expect(logs[0]).toContain("\x1b[31m");
    expect(logs[0]).toContain("Error:");
    expect(logs[0]).toContain("algo salió mal");
  });

  it("showInfo prints message without color", async () => {
    const { showInfo } = await import("../../src/presentation/output");
    const logs: string[] = [];
    spyOn(console, "log").mockImplementation((msg: string) => logs.push(msg));

    showInfo("informativo");
    expect(logs[0]).toBe("\n  informativo");
  });

  it("showWeatherLine shows location with temperature in yellow", async () => {
    const { showWeatherLine } = await import("../../src/presentation/output");
    const logs: string[] = [];
    spyOn(console, "log").mockImplementation((msg: string) => logs.push(msg));

    showWeatherLine("Santiago, Chile", "20°C");
    expect(logs[0]).toContain("Santiago, Chile");
    expect(logs[0]).toContain("\x1b[33m");
    expect(logs[0]).toContain("20°C");
  });

  it("showCurrentWeather shows location and temperature", async () => {
    const { showCurrentWeather } = await import("../../src/presentation/output");
    const logs: string[] = [];
    spyOn(console, "log").mockImplementation((msg: string) => logs.push(msg));

    showCurrentWeather("Santiago", "20°C", "12:00");
    const output = logs.join("\n");
    expect(output).toContain("Santiago");
    expect(output).toContain("\x1b[33m");
    expect(output).toContain("20°C");
    expect(output).toContain("12:00");
  });

  it("showForecastHeader prints header with cyan", async () => {
    const { showForecastHeader } = await import("../../src/presentation/output");
    const logs: string[] = [];
    spyOn(console, "log").mockImplementation((msg: string) => logs.push(msg));

    showForecastHeader("Santiago, Chile");
    expect(logs[0]).toContain("\x1b[36m");
    expect(logs[0]).toContain("Pronóstico 7 días");
    expect(logs[0]).toContain("Santiago, Chile");
  });

  it("showForecastDays prints each day", async () => {
    const { showForecastDays } = await import("../../src/presentation/output");
    const logs: string[] = [];
    spyOn(console, "log").mockImplementation((msg: string) => logs.push(msg));

    const forecast = [
      { date: "2026-07-30", tempMax: 25, tempMin: 15, weatherCode: 0 },
      { date: "2026-07-31", tempMax: 22, tempMin: 12, weatherCode: 61 },
    ];

    showForecastDays(forecast, "celsius");
    expect(logs).toHaveLength(2);
    expect(logs[0]).toContain("jue");
    expect(logs[0]).toContain("30/07");
    expect(logs[0]).toContain("☀️");
    expect(logs[1]).toContain("31/07");
    expect(logs[1]).toContain("🌧️");
  });
});
