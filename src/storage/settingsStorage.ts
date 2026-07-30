import { loadConfig, saveConfig } from "./configFile";

export function loadUnit(): "celsius" | "fahrenheit" {
  return loadConfig().unit;
}

export function saveUnit(unit: "celsius" | "fahrenheit"): void {
  const config = loadConfig();
  config.unit = unit;
  saveConfig(config);
}
