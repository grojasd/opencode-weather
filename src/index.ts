import { createInterface } from "node:readline/promises";
import { loadConfig, saveConfig } from "./storage/configFile";
import { renderMenu } from "./presentation/menu";
import { askQuestion } from "./presentation/input";
import { showSuccess, showInfo } from "./presentation/output";
import { handleCurrentWeatherDefault, handleCurrentWeatherAll, handleForecastDefault, handleForecastAll } from "./actions/getWeather";
import { handleAddCity } from "./actions/addCity";
import { handleRemoveCity } from "./actions/removeCity";
import { handleSetDefaultCity } from "./actions/setDefaultCity";
import { unitLabel } from "./utils/format";

export async function main(): Promise<void> {
  const config = loadConfig();
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  let running = true;

  while (running) {
    renderMenu(config);
    const option = await askQuestion(rl, "  Selecciona una opción: ");

    switch (option) {
      case "1":
        await handleCurrentWeatherDefault(config);
        break;
      case "2":
        await handleCurrentWeatherAll(config);
        break;
      case "3":
        await handleAddCity(config, rl);
        break;
      case "4":
        await handleRemoveCity(config, rl);
        break;
      case "5":
        await handleSetDefaultCity(config, rl);
        break;
      case "6":
        await handleForecastDefault(config);
        break;
      case "7":
        await handleForecastAll(config);
        break;
      case "8":
        config.unit = config.unit === "celsius" ? "fahrenheit" : "celsius";
        showSuccess(`Unidad cambiada a ${unitLabel(config.unit)}`);
        break;
      case "9":
        running = false;
        break;
      default:
        showInfo("Opción no válida. Intenta de nuevo.");
    }
  }

  saveConfig(config);
  rl.close();
  showSuccess("¡Hasta luego!");
}
