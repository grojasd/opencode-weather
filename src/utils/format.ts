import type { City } from "../types/City";
import type { DailyForecast } from "../types/Weather";
import { cyan, yellow } from "./colors";
import { DAY_NAMES } from "./constants";

export function unitLabel(unit: "celsius" | "fahrenheit"): string {
  return unit === "celsius" ? "°C" : "°F";
}

export function dayName(dateStr: string): string {
  return DAY_NAMES[new Date(dateStr).getDay()]!;
}

export function shortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function weatherEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 2) return "⛅";
  if (code === 3) return "☁️";
  if (code === 45 || code === 48) return "🌫️";
  if (code >= 51 && code <= 57) return "🌦️";
  if (code >= 61 && code <= 65) return "🌧️";
  if (code >= 71 && code <= 77) return "❄️";
  if (code >= 80 && code <= 82) return "🌦️";
  if (code >= 85 && code <= 86) return "❄️";
  if (code >= 95) return "⛈️";
  return "🌡️";
}

export function weatherDesc(code: number): string {
  if (code === 0) return "Despejado";
  if (code === 1) return "Mayormente despejado";
  if (code === 2) return "Parcialmente nublado";
  if (code === 3) return "Nublado";
  if (code === 45 || code === 48) return "Niebla";
  if (code === 51) return "Llovizna ligera";
  if (code === 53) return "Llovizna moderada";
  if (code === 55) return "Llovizna densa";
  if (code === 56 || code === 57) return "Llovizna helada";
  if (code === 61) return "Lluvia ligera";
  if (code === 63) return "Lluvia moderada";
  if (code === 65) return "Lluvia fuerte";
  if (code === 66 || code === 67) return "Lluvia helada";
  if (code === 71) return "Nevada ligera";
  if (code === 73) return "Nevada moderada";
  if (code === 75) return "Nevada fuerte";
  if (code === 77) return "Granos de nieve";
  if (code >= 80 && code <= 82) return "Chubascos";
  if (code >= 85 && code <= 86) return "Chubascos de nieve";
  if (code === 95) return "Tormenta eléctrica";
  if (code >= 96) return "Tormenta con granizo";
  return "Desconocido";
}

export function formatForecastDay(day: DailyForecast, unitLbl: string): string {
  const temps = yellow(`${day.tempMin}${unitLbl} ~ ${day.tempMax}${unitLbl}`);
  return `  ${cyan(dayName(day.date))} ${cyan(shortDate(day.date))}  ${weatherEmoji(day.weatherCode)}  ${temps}  ${weatherDesc(day.weatherCode)}`;
}

export function findCityIndex(cities: City[], target: City): number {
  return cities.findIndex(
    (c) =>
      c.name === target.name &&
      c.latitude === target.latitude &&
      c.longitude === target.longitude,
  );
}
