import { cyan, yellow } from "../utils/colors";
import { unitLabel } from "../utils/format";
import type { Config } from "../types/City";

export function renderMenu(config: Config): void {
  console.log(`\n${cyan("═".repeat(40))}`);
  console.log(cyan("         WEATHER CLI"));
  console.log(cyan("═".repeat(40)));
  console.log(cyan("  1. Clima de ciudad default"));
  console.log(cyan(`  2. Clima de todas las ciudades (${yellow(String(config.cities.length))})`));
  console.log(cyan("  3. Buscar y agregar ciudad"));
  console.log(cyan("  4. Eliminar ciudad"));
  console.log(cyan("  5. Establecer ciudad default"));
  console.log(cyan("  6. Pronóstico 7 días — ciudad default"));
  console.log(cyan("  7. Pronóstico 7 días — todas las ciudades"));
  console.log(cyan(`  8. Ajustes (${yellow(unitLabel(config.unit))})`));
  console.log(cyan("  9. Salir"));
  console.log(cyan("═".repeat(40)));
}
