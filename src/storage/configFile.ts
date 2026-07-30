import * as fs from "node:fs";
import type { Config } from "../types/City";

const CONFIG_FILE = "weather-config.json";

export function loadConfig(): Config {
  try {
    const data = fs.readFileSync(CONFIG_FILE, "utf-8");
    return JSON.parse(data) as Config;
  } catch {
    return { cities: [], unit: "celsius" };
  }
}

export function saveConfig(config: Config): void {
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
}
