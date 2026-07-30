import { getWeather, getForecast } from "../api/weather";
import { unitLabel } from "../utils/format";
import { red } from "../utils/colors";
import { showError, showCurrentWeather, showWeatherLine, showForecastHeader, showForecastDays } from "../presentation/output";
import type { Config } from "../types/City";

function formatCityLoc(city: { name: string; country?: string }): string {
  return city.country ? `${city.name}, ${city.country}` : city.name;
}

export async function handleCurrentWeatherDefault(config: Config): Promise<void> {
  if (!config.defaultCity) {
    console.log("\n  No hay ciudad default. Usa la opción 5 para establecer una.");
    return;
  }
  try {
    const weather = await getWeather(config.defaultCity, config.unit);
    const loc = formatCityLoc(config.defaultCity);
    showCurrentWeather(loc, `${weather.temperature}${unitLabel(config.unit)}`, weather.time);
  } catch (e) {
    showError((e as Error).message);
  }
}

export async function handleCurrentWeatherAll(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log("\n  No hay ciudades registradas. Usa la opción 3 para agregar una.");
    return;
  }
  for (const city of config.cities) {
    try {
      const weather = await getWeather(city, config.unit);
      const loc = formatCityLoc(city);
      showWeatherLine(loc, `${weather.temperature}${unitLabel(config.unit)}`);
    } catch (e) {
      console.log(red(`  ${city.name}: Error — ${(e as Error).message}`));
    }
  }
}

export async function handleForecastDefault(config: Config): Promise<void> {
  if (!config.defaultCity) {
    console.log("\n  No hay ciudad default. Usa la opción 5 para establecer una.");
    return;
  }
  try {
    const forecast = await getForecast(config.defaultCity, config.unit);
    const loc = formatCityLoc(config.defaultCity);
    showForecastHeader(loc);
    showForecastDays(forecast, config.unit);
  } catch (e) {
    showError((e as Error).message);
  }
}

export async function handleForecastAll(config: Config): Promise<void> {
  if (config.cities.length === 0) {
    console.log("\n  No hay ciudades registradas. Usa la opción 3 para agregar una.");
    return;
  }
  for (const city of config.cities) {
    try {
      const forecast = await getForecast(city, config.unit);
      const loc = formatCityLoc(city);
      showForecastHeader(loc);
      showForecastDays(forecast, config.unit);
    } catch (e) {
      console.log(red(`  ${city.name}: Error — ${(e as Error).message}`));
    }
  }
}
