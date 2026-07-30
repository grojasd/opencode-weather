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
  return await import("../../src/storage/settingsStorage");
}

describe("settingsStorage", () => {
  it("loadUnit returns celsius when no config file", async () => {
    const { loadUnit } = await loadModule();
    expect(loadUnit()).toBe("celsius");
  });

  it("saveUnit persists fahrenheit and loadUnit retrieves it", async () => {
    const { saveUnit, loadUnit } = await loadModule();
    saveUnit("fahrenheit");
    expect(loadUnit()).toBe("fahrenheit");
  });

  it("saveUnit persists celsius and loadUnit retrieves it", async () => {
    const { saveUnit, loadUnit } = await loadModule();
    saveUnit("celsius");
    expect(loadUnit()).toBe("celsius");
  });
});
