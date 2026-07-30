import type { City } from "../types/City";
import type { DailyForecast } from "../types/Weather";

interface ForecastResponse {
  current?: {
    time: string;
    temperature_2m: number;
  };
}

interface DailyForecastResponse {
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
  };
}

export async function getWeather(
  city: City,
  unit: "celsius" | "fahrenheit",
): Promise<{ temperature: number; time: string }> {
  const tempUnit = unit === "celsius" ? "celsius" : "fahrenheit";
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m&temperature_unit=${tempUnit}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error al obtener clima: ${res.status}`);
  const data = (await res.json()) as ForecastResponse;
  if (!data.current) throw new Error("No se recibieron datos del clima");
  return {
    temperature: data.current.temperature_2m,
    time: data.current.time,
  };
}

export async function getForecast(
  city: City,
  unit: "celsius" | "fahrenheit",
): Promise<DailyForecast[]> {
  const tempUnit = unit === "celsius" ? "celsius" : "fahrenheit";
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&daily=temperature_2m_max,temperature_2m_min,weathercode&temperature_unit=${tempUnit}&timezone=auto&forecast_days=7`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error al obtener pronóstico: ${res.status}`);
  const data = (await res.json()) as DailyForecastResponse;
  if (!data.daily) throw new Error("No se recibieron datos del pronóstico");
  const { time, temperature_2m_max, temperature_2m_min, weathercode } = data.daily;
  return time.map((_, i) => ({
    date: time[i]!,
    tempMax: temperature_2m_max[i]!,
    tempMin: temperature_2m_min[i]!,
    weatherCode: weathercode[i]!,
  }));
}
