import { green, red, cyan, yellow } from "../utils/colors";
import type { DailyForecast } from "../types/Weather";
import { formatForecastDay, unitLabel } from "../utils/format";

export function showSuccess(msg: string): void {
  console.log(green(`\n  ${msg}`));
}

export function showError(msg: string): void {
  console.log(red(`  Error: ${msg}`));
}

export function showInfo(msg: string): void {
  console.log(`\n  ${msg}`);
}

export function showInlineInfo(msg: string): void {
  console.log(`  ${msg}`);
}

export function showWeatherLine(loc: string, temp: string): void {
  console.log(`  ${loc}: ${yellow(temp)}`);
}

export function showCurrentWeather(loc: string, temp: string, time: string): void {
  console.log(`\n  ${loc}`);
  console.log(`  ${yellow(temp)} — ${time}`);
}

export function showForecastHeader(loc: string): void {
  console.log(`\n  ${cyan("Pronóstico 7 días —")} ${loc}`);
}

export function showForecastDays(forecast: DailyForecast[], unit: "celsius" | "fahrenheit"): void {
  for (const day of forecast) {
    console.log(formatForecastDay(day, unitLabel(unit)));
  }
}
