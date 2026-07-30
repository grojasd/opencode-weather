export interface City {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
}

export interface DailyForecast {
  date: string;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
}

export interface Config {
  defaultCity?: City;
  cities: City[];
  unit: "celsius" | "fahrenheit";
}
