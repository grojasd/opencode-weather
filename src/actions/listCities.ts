import type { City } from "../types/City";

export function listCities(cities: City[]): string[] {
  return cities.map((c) =>
    c.country ? `${c.name}, ${c.country}` : c.name,
  );
}
