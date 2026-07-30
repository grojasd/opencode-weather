import type { Interface } from "node:readline/promises";
import { searchCity } from "../api/geocoding";
import { findCityIndex } from "../utils/format";
import { showSuccess, showError, showInfo, showInlineInfo } from "../presentation/output";
import { askQuestion } from "../presentation/input";
import type { City, Config } from "../types/City";

export async function handleSetDefaultCity(config: Config, rl: Interface): Promise<void> {
  console.log("");
  for (let i = 0; i < config.cities.length; i++) {
    const c = config.cities[i]!;
    showInlineInfo(`${i + 1}. ${c.name}${c.country ? `, ${c.country}` : ""}`);
  }
  console.log(`  ${config.cities.length + 1}. Buscar nueva ciudad...`);

  const sel = await askQuestion(rl, "\n  Selecciona una opción: ");
  const idx = parseInt(sel, 10) - 1;

  if (idx >= 0 && idx < config.cities.length) {
    config.defaultCity = config.cities[idx]!;
    showSuccess(`Ciudad default establecida: ${config.defaultCity.name}`);
    return;
  }

  if (idx === config.cities.length) {
    const query = await askQuestion(rl, "\n  Nombre de la ciudad a buscar: ");
    if (!query) return;

    let results: City[];
    try {
      results = await searchCity(query);
    } catch (e) {
      showError((e as Error).message);
      return;
    }

    if (results.length === 0) {
      showInfo("No se encontraron ciudades.");
      return;
    }

    console.log("");
    for (let i = 0; i < results.length; i++) {
      const r = results[i]!;
      showInlineInfo(`${i + 1}. ${r.name}${r.country ? `, ${r.country}` : ""}`);
    }

    const sel2 = await askQuestion(rl, "\n  Selecciona una ciudad (0 para cancelar): ");
    const idx2 = parseInt(sel2, 10) - 1;
    if (idx2 < 0 || idx2 >= results.length) return;

    const selected = results[idx2]!;
    const existingIdx = findCityIndex(config.cities, selected);
    if (existingIdx >= 0) {
      config.defaultCity = config.cities[existingIdx];
    } else {
      config.cities.push(selected);
      config.defaultCity = selected;
    }

    showSuccess(`Ciudad default establecida: ${selected.name}`);
  }
}
