import { createInterface } from "node:readline/promises";
import { loadConfig, saveConfig } from "./storage";
import { searchCity, getWeather, getForecast } from "./api";
import type { City, Config, DailyForecast } from "./types";
import { cyan, yellow, green, red } from "./colors";

function unitLabel(unit: "celsius" | "fahrenheit"): string {
  return unit === "celsius" ? "°C" : "°F";
}

const DAY_NAMES = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

function dayName(dateStr: string): string {
  return DAY_NAMES[new Date(dateStr).getDay()]!;
}

function shortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function weatherEmoji(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 2) return "⛅";
  if (code === 3) return "☁️";
  if (code === 45 || code === 48) return "🌫️";
  if (code >= 51 && code <= 57) return "🌦️";
  if (code >= 61 && code <= 65) return "🌧️";
  if (code >= 71 && code <= 77) return "❄️";
  if (code >= 80 && code <= 82) return "🌦️";
  if (code >= 85 && code <= 86) return "❄️";
  if (code >= 95) return "⛈️";
  return "🌡️";
}

function weatherDesc(code: number): string {
  if (code === 0) return "Despejado";
  if (code === 1) return "Mayormente despejado";
  if (code === 2) return "Parcialmente nublado";
  if (code === 3) return "Nublado";
  if (code === 45 || code === 48) return "Niebla";
  if (code === 51) return "Llovizna ligera";
  if (code === 53) return "Llovizna moderada";
  if (code === 55) return "Llovizna densa";
  if (code === 56 || code === 57) return "Llovizna helada";
  if (code === 61) return "Lluvia ligera";
  if (code === 63) return "Lluvia moderada";
  if (code === 65) return "Lluvia fuerte";
  if (code === 66 || code === 67) return "Lluvia helada";
  if (code === 71) return "Nevada ligera";
  if (code === 73) return "Nevada moderada";
  if (code === 75) return "Nevada fuerte";
  if (code === 77) return "Granos de nieve";
  if (code >= 80 && code <= 82) return "Chubascos";
  if (code >= 85 && code <= 86) return "Chubascos de nieve";
  if (code === 95) return "Tormenta eléctrica";
  if (code >= 96) return "Tormenta con granizo";
  return "Desconocido";
}

function formatForecastDay(day: DailyForecast, unitLbl: string): string {
  const temps = yellow(`${day.tempMin}${unitLbl} ~ ${day.tempMax}${unitLbl}`);
  return `  ${cyan(dayName(day.date))} ${cyan(shortDate(day.date))}  ${weatherEmoji(day.weatherCode)}  ${temps}  ${weatherDesc(day.weatherCode)}`;
}

function findCityIndex(cities: City[], target: City): number {
  return cities.findIndex(
    (c) =>
      c.name === target.name &&
      c.latitude === target.latitude &&
      c.longitude === target.longitude,
  );
}

export async function main(): Promise<void> {
  const config: Config = loadConfig();
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  let running = true;

  while (running) {
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

    const answer = await rl.question("  Selecciona una opción: ");
    const option = answer.trim();

    if (option === "1") {
      if (!config.defaultCity) {
        console.log("\n  No hay ciudad default. Usa la opción 5 para establecer una.");
        continue;
      }
      try {
        const weather = await getWeather(config.defaultCity, config.unit);
        const loc = config.defaultCity.country
          ? `${config.defaultCity.name}, ${config.defaultCity.country}`
          : config.defaultCity.name;
        console.log(`\n  ${loc}`);
        console.log(`  ${yellow(`${weather.temperature}${unitLabel(config.unit)}`)} — ${weather.time}`);
      } catch (e) {
        console.log(red(`\n  Error: ${(e as Error).message}`));
      }
    } else if (option === "2") {
      if (config.cities.length === 0) {
        console.log("\n  No hay ciudades registradas. Usa la opción 3 para agregar una.");
        continue;
      }
      for (const city of config.cities) {
        try {
          const weather = await getWeather(city, config.unit);
          const loc = city.country ? `${city.name}, ${city.country}` : city.name;
          console.log(`  ${loc}: ${yellow(`${weather.temperature}${unitLabel(config.unit)}`)}`);
        } catch (e) {
          console.log(red(`  ${city.name}: Error — ${(e as Error).message}`));
        }
      }
    } else if (option === "3") {
      const query = await rl.question("\n  Nombre de la ciudad a buscar: ");
      if (!query.trim()) continue;

      let results: City[];
      try {
        results = await searchCity(query.trim());
      } catch (e) {
        console.log(red(`  Error: ${(e as Error).message}`));
        continue;
      }

      if (results.length === 0) {
        console.log("  No se encontraron ciudades.");
        continue;
      }

      console.log("");
      for (let i = 0; i < results.length; i++) {
        const r = results[i]!;
        console.log(`  ${i + 1}. ${r.name}${r.country ? `, ${r.country}` : ""}`);
      }

      const sel = await rl.question("\n  Selecciona una ciudad (0 para cancelar): ");
      const idx = parseInt(sel, 10) - 1;
      if (idx < 0 || idx >= results.length) continue;

      const selected = results[idx]!;
      const existingIdx = findCityIndex(config.cities, selected);
      if (existingIdx >= 0) {
        console.log(`\n  ${selected.name} ya está en la lista.`);
        continue;
      }

      config.cities.push(selected);
      console.log(green(`\n  ${selected.name}${selected.country ? `, ${selected.country}` : ""} agregada a la lista.`));
    } else if (option === "4") {
      if (config.cities.length === 0) {
        console.log("\n  No hay ciudades registradas.");
        continue;
      }

      console.log("");
      for (let i = 0; i < config.cities.length; i++) {
        const c = config.cities[i]!;
        console.log(`  ${i + 1}. ${c.name}${c.country ? `, ${c.country}` : ""}`);
      }

      const sel = await rl.question("\n  Selecciona una ciudad para eliminar (0 para cancelar): ");
      const idx = parseInt(sel, 10) - 1;
      if (idx < 0 || idx >= config.cities.length) continue;

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

      console.log(green(`\n  ${removed.name} eliminada.`));
    } else if (option === "5") {
      console.log("");
      for (let i = 0; i < config.cities.length; i++) {
        const c = config.cities[i]!;
        console.log(`  ${i + 1}. ${c.name}${c.country ? `, ${c.country}` : ""}`);
      }
      console.log(`  ${config.cities.length + 1}. Buscar nueva ciudad...`);

      const sel = await rl.question("\n  Selecciona una opción: ");
      const idx = parseInt(sel, 10) - 1;

      if (idx >= 0 && idx < config.cities.length) {
        const selected = config.cities[idx]!;
        config.defaultCity = selected;
        console.log(`\n  Ciudad default establecida: ${selected.name}`);
        continue;
      }

      if (idx === config.cities.length) {
        const query = await rl.question("\n  Nombre de la ciudad a buscar: ");
        if (!query.trim()) continue;

        let results: City[];
        try {
          results = await searchCity(query.trim());
        } catch (e) {
          console.log(red(`  Error: ${(e as Error).message}`));
          continue;
        }

        if (results.length === 0) {
          console.log("  No se encontraron ciudades.");
          continue;
        }

        console.log("");
        for (let i = 0; i < results.length; i++) {
          const r = results[i]!;
          console.log(`  ${i + 1}. ${r.name}${r.country ? `, ${r.country}` : ""}`);
        }

        const sel2 = await rl.question("\n  Selecciona una ciudad (0 para cancelar): ");
        const idx2 = parseInt(sel2, 10) - 1;
        if (idx2 < 0 || idx2 >= results.length) continue;

        const selected = results[idx2]!;
        const existingIdx = findCityIndex(config.cities, selected);
        if (existingIdx >= 0) {
          config.defaultCity = config.cities[existingIdx];
        } else {
          config.cities.push(selected);
          config.defaultCity = selected;
        }

        console.log(green(`\n  Ciudad default establecida: ${selected.name}`));
      }
    } else if (option === "6") {
      if (!config.defaultCity) {
        console.log("\n  No hay ciudad default. Usa la opción 5 para establecer una.");
        continue;
      }
      try {
        const forecast = await getForecast(config.defaultCity, config.unit);
        const loc = config.defaultCity.country
          ? `${config.defaultCity.name}, ${config.defaultCity.country}`
          : config.defaultCity.name;
        console.log(`\n  ${cyan("Pronóstico 7 días —")} ${loc}`);
        for (const day of forecast) {
          console.log(formatForecastDay(day, unitLabel(config.unit)));
        }
      } catch (e) {
        console.log(red(`\n  Error: ${(e as Error).message}`));
      }
    } else if (option === "7") {
      if (config.cities.length === 0) {
        console.log("\n  No hay ciudades registradas. Usa la opción 3 para agregar una.");
        continue;
      }
      for (const city of config.cities) {
        try {
          const forecast = await getForecast(city, config.unit);
          const loc = city.country ? `${city.name}, ${city.country}` : city.name;
          console.log(`\n  ${cyan("Pronóstico 7 días —")} ${loc}`);
          for (const day of forecast) {
            console.log(formatForecastDay(day, unitLabel(config.unit)));
          }
        } catch (e) {
          console.log(red(`  ${city.name}: Error — ${(e as Error).message}`));
        }
      }
    } else if (option === "8") {
      config.unit = config.unit === "celsius" ? "fahrenheit" : "celsius";
      console.log(green(`\n  Unidad cambiada a ${unitLabel(config.unit)}`));
    } else if (option === "9") {
      running = false;
    } else {
      console.log("\n  Opción no válida. Intenta de nuevo.");
    }
  }

  saveConfig(config);
  rl.close();
  console.log(green("\n  ¡Hasta luego!\n"));
}
