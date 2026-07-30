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

// Dynamic import to get fresh module each time
async function loadModule() {
  return await import("../../src/storage/configFile");
}

describe("configFile", () => {
  it("loadConfig returns default config when file does not exist", async () => {
    const { loadConfig } = await loadModule();
    const config = loadConfig();
    expect(config).toEqual({ cities: [], unit: "celsius" });
    expect(config.defaultCity).toBeUndefined();
  });

  it("saveConfig writes correct JSON and loadConfig reads it back", async () => {
    const { loadConfig, saveConfig } = await loadModule();
    const data = {
      cities: [{ name: "Test", latitude: 0, longitude: 0 }],
      unit: "fahrenheit" as const,
    };
    saveConfig(data);

    const raw = fs.readFileSync("weather-config.json", "utf-8");
    expect(JSON.parse(raw)).toEqual(data);

    const loaded = loadConfig();
    expect(loaded).toEqual(data);
  });

  it("loadConfig preserves all fields in existing config", async () => {
    const { saveConfig, loadConfig } = await loadModule();
    const data = {
      cities: [
        { name: "Santiago", latitude: -33.45, longitude: -70.65, country: "Chile" },
      ],
      defaultCity: { name: "Santiago", latitude: -33.45, longitude: -70.65, country: "Chile" },
      unit: "celsius" as const,
    };
    saveConfig(data);
    expect(loadConfig()).toEqual(data);
  });
});
