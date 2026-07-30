export interface City {
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
}

export interface Config {
  defaultCity?: City;
  cities: City[];
  unit: "celsius" | "fahrenheit";
}
