import { describe, it, expect } from "bun:test";
import { cyan, yellow, green, red } from "../../src/utils/colors";

describe("colors", () => {
  it("cyan wraps text with cyan ANSI codes", () => {
    expect(cyan("hola")).toBe("\x1b[36mhola\x1b[0m");
  });

  it("yellow wraps text with yellow ANSI codes", () => {
    expect(yellow("mundo")).toBe("\x1b[33mmundo\x1b[0m");
  });

  it("green wraps text with green ANSI codes", () => {
    expect(green("ok")).toBe("\x1b[32mok\x1b[0m");
  });

  it("red wraps text with red ANSI codes", () => {
    expect(red("error")).toBe("\x1b[31merror\x1b[0m");
  });

  it("handles empty string", () => {
    expect(cyan("")).toBe("\x1b[36m\x1b[0m");
  });
});
