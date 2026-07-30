import type { Interface } from "node:readline/promises";
import { showSuccess, showInfo, showInlineInfo } from "../presentation/output";
import { askQuestion } from "../presentation/input";
import type { Config } from "../types/City";

export async function handleRemoveCity(config: Config, rl: Interface): Promise<void> {
  if (config.cities.length === 0) {
    showInfo("No hay ciudades registradas.");
    return;
  }

  console.log("");
  for (let i = 0; i < config.cities.length; i++) {
    const c = config.cities[i]!;
    showInlineInfo(`${i + 1}. ${c.name}${c.country ? `, ${c.country}` : ""}`);
  }

  const sel = await askQuestion(rl, "\n  Selecciona una ciudad para eliminar (0 para cancelar): ");
  const idx = parseInt(sel, 10) - 1;
  if (idx < 0 || idx >= config.cities.length) return;

  const removed = config.cities[idx]!;
  config.cities.splice(idx, 1);

  if (
    config.defaultCity &&
    config.defaultCity.name === removed.name &&
    config.defaultCity.latitude === removed.latitude &&
    config.defaultCity.longitude === removed.longitude
  ) {
    config.defaultCity = undefined;
  }

  showSuccess(`${removed.name} eliminada.`);
}
