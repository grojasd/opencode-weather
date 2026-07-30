import { describe, it, expect } from "bun:test";
import {
  unitLabel,
  dayName,
  shortDate,
  weatherEmoji,
  weatherDesc,
  formatForecastDay,
  findCityIndex,
} from "../../src/utils/format";
import type { DailyForecast } from "../../src/types/Weather";
import type { City } from "../../src/types/City";

describe("unitLabel", () => {
  it("returns °C for celsius", () => {
    expect(unitLabel("celsius")).toBe("°C");
  });

  it("returns °F for fahrenheit", () => {
    expect(unitLabel("fahrenheit")).toBe("°F");
  });
});

describe("dayName", () => {
  it("returns correct Spanish day name for a Thursday", () => {
    expect(dayName("2026-07-30")).toBe("jue");
  });

  it("returns correct Spanish day name for a Sunday", () => {
    expect(dayName("2026-08-02")).toBe("dom");
  });

  it("returns correct Spanish day name for a Friday", () => {
    expect(dayName("2026-07-31")).toBe("vie");
  });
});

describe("shortDate", () => {
  it("formats date as DD/MM", () => {
    expect(shortDate("2026-07-30")).toBe("30/07");
  });

  it("pads single-digit day and month", () => {
    expect(shortDate("2026-01-05")).toBe("05/01");
  });
});

describe("weatherEmoji", () => {
  it("returns ☀️ for code 0", () => {
    expect(weatherEmoji(0)).toBe("☀️");
  });

  it("returns ⛅ for codes 1-2", () => {
    expect(weatherEmoji(1)).toBe("⛅");
    expect(weatherEmoji(2)).toBe("⛅");
  });

  it("returns ☁️ for code 3", () => {
    expect(weatherEmoji(3)).toBe("☁️");
  });

  it("returns 🌫️ for fog codes 45, 48", () => {
    expect(weatherEmoji(45)).toBe("🌫️");
    expect(weatherEmoji(48)).toBe("🌫️");
  });

  it("returns 🌧️ for rain codes 61-65", () => {
    expect(weatherEmoji(61)).toBe("🌧️");
    expect(weatherEmoji(65)).toBe("🌧️");
  });

  it("returns ❄️ for snow codes 71-77", () => {
    expect(weatherEmoji(71)).toBe("❄️");
    expect(weatherEmoji(75)).toBe("❄️");
  });

  it("returns ⛈️ for thunderstorm codes 95+", () => {
    expect(weatherEmoji(95)).toBe("⛈️");
    expect(weatherEmoji(99)).toBe("⛈️");
  });

  it("returns 🌡️ for unknown code", () => {
    expect(weatherEmoji(50)).toBe("🌡️");
  });
});

describe("weatherDesc", () => {
  it("returns Despejado for code 0", () => {
    expect(weatherDesc(0)).toBe("Despejado");
  });

  it("returns Tormenta con granizo for code 96+", () => {
    expect(weatherDesc(96)).toBe("Tormenta con granizo");
    expect(weatherDesc(99)).toBe("Tormenta con granizo");
  });

  it("returns Desconocido for unmapped code", () => {
    expect(weatherDesc(50)).toBe("Desconocido");
  });
});

describe("formatForecastDay", () => {
  it("formats a forecast day with colors and emoji", () => {
    const day: DailyForecast = {
      date: "2026-07-30",
      tempMax: 25,
      tempMin: 15,
      weatherCode: 0,
    };
    const result = formatForecastDay(day, "°C");
    expect(result).toContain("jue");
    expect(result).toContain("30/07");
    expect(result).toContain("☀️");
    expect(result).toContain("15°C");
    expect(result).toContain("25°C");
    expect(result).toContain("Despejado");
    expect(result).toContain("\x1b[36m");
    expect(result).toContain("\x1b[33m");
  });
});

describe("findCityIndex", () => {
  const cities: City[] = [
    { name: "Santiago", latitude: -33.45, longitude: -70.65, country: "Chile" },
    { name: "Buenos Aires", latitude: -34.6, longitude: -58.38, country: "Argentina" },
  ];

  it("finds a city by matching name and coordinates", () => {
    const target: City = { name: "Santiago", latitude: -33.45, longitude: -70.65, country: "Chile" };
    expect(findCityIndex(cities, target)).toBe(0);
  });

  it("returns -1 when city is not found", () => {
    const target: City = { name: "Lima", latitude: -12.05, longitude: -77.04, country: "Peru" };
    expect(findCityIndex(cities, target)).toBe(-1);
  });
});
