import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

let tmpDir: string;
let originalCwd: string;

beforeEach(() => {
  originalCwd = process.cwd();
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "weather-test-"));
  process.chdir(tmpDir);
});

afterEach(() => {
  process.chdir(originalCwd);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

async function loadModule() {
  return await import("../../src/storage/citiesStorage");
}

function seedConfig(data: object): void {
  fs.writeFileSync("weather-config.json", JSON.stringify(data));
}

describe("citiesStorage", () => {
  it("loadCities returns empty array when no config", async () => {
    const { loadCities } = await loadModule();
    expect(loadCities()).toEqual([]);
  });

  it("saveCities persists cities and loadCities retrieves them", async () => {
    const { saveCities, loadCities } = await loadModule();
    const cities = [
      { name: "A", latitude: 1, longitude: 1, country: "X" },
      { name: "B", latitude: 2, longitude: 2 },
    ];
    saveCities(cities);
    expect(loadCities()).toEqual(cities);
  });

  it("loadDefaultCity returns undefined when not set", async () => {
    const { loadDefaultCity } = await loadModule();
    expect(loadDefaultCity()).toBeUndefined();
  });

  it("saveDefaultCity persists and loadDefaultCity retrieves", async () => {
    const { saveDefaultCity, loadDefaultCity } = await loadModule();
    const city = { name: "Santiago", latitude: -33.45, longitude: -70.65, country: "Chile" };
    saveDefaultCity(city);
    expect(loadDefaultCity()).toEqual(city);
  });

  it("saveDefaultCity(undefined) clears default city", async () => {
    const { saveDefaultCity, loadDefaultCity } = await loadModule();
    seedConfig({ cities: [], defaultCity: { name: "X", latitude: 0, longitude: 0 }, unit: "celsius" });
    saveDefaultCity(undefined);
    expect(loadDefaultCity()).toBeUndefined();
  });
});
