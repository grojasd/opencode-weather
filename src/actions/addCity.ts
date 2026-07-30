import type { Interface } from "node:readline/promises";
import { searchCity } from "../api/geocoding";
import { findCityIndex } from "../utils/format";
import { showSuccess, showError, showInfo, showInlineInfo } from "../presentation/output";
import { askQuestion } from "../presentation/input";
import type { City, Config } from "../types/City";

export async function handleAddCity(config: Config, rl: Interface): Promise<void> {
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

  const sel = await askQuestion(rl, "\n  Selecciona una ciudad (0 para cancelar): ");
  const idx = parseInt(sel, 10) - 1;
  if (idx < 0 || idx >= results.length) return;

  const selected = results[idx]!;
  const existingIdx = findCityIndex(config.cities, selected);
  if (existingIdx >= 0) {
    showInfo(`${selected.name} ya está en la lista.`);
    return;
  }

  config.cities.push(selected);
  showSuccess(`${selected.name}${selected.country ? `, ${selected.country}` : ""} agregada a la lista.`);
}
