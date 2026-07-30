import { describe, it, expect, spyOn } from "bun:test";
import type { Config } from "../../src/types/City";

describe("renderMenu", () => {
  it("prints menu with title and all options", async () => {
    const { renderMenu } = await import("../../src/presentation/menu");
    const config: Config = {
      cities: [
        { name: "A", latitude: 0, longitude: 0 },
        { name: "B", latitude: 1, longitude: 1 },
      ],
      unit: "celsius",
    };

    const logs: string[] = [];
    spyOn(console, "log").mockImplementation((msg: string) => logs.push(msg));

    renderMenu(config);

    const output = logs.join("\n");
    expect(output).toContain("WEATHER CLI");
    expect(output).toContain("1. Clima de ciudad default");
    expect(output).toContain("2. Clima de todas las ciudades");
    expect(output).toContain("2");
    expect(output).toContain("3. Buscar y agregar ciudad");
    expect(output).toContain("4. Eliminar ciudad");
    expect(output).toContain("5. Establecer ciudad default");
    expect(output).toContain("6. Pronóstico 7 días — ciudad default");
    expect(output).toContain("7. Pronóstico 7 días — todas las ciudades");
    expect(output).toContain("8. Ajustes");
    expect(output).toContain("°C");
    expect(output).toContain("9. Salir");
    expect(output).toContain("═");
    expect(output).toContain("\x1b[36m");
  });

  it("shows fahrenheit when unit is fahrenheit", async () => {
    const { renderMenu } = await import("../../src/presentation/menu");
    const config: Config = { cities: [], unit: "fahrenheit" };

    const logs: string[] = [];
    spyOn(console, "log").mockImplementation((msg: string) => logs.push(msg));

    renderMenu(config);

    expect(logs.join("")).toContain("°F");
  });
});
