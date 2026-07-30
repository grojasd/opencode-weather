import type { City } from "../types/City";
import { loadConfig, saveConfig } from "./configFile";

export function loadCities(): City[] {
  return loadConfig().cities;
}

export function saveCities(cities: City[]): void {
  const config = loadConfig();
  config.cities = cities;
  saveConfig(config);
}

export function loadDefaultCity(): City | undefined {
  return loadConfig().defaultCity;
}

export function saveDefaultCity(city: City | undefined): void {
  const config = loadConfig();
  config.defaultCity = city;
  saveConfig(config);
}
