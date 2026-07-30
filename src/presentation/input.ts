import type { Interface } from "node:readline/promises";

export async function askQuestion(rl: Interface, prompt: string): Promise<string> {
  return (await rl.question(prompt)).trim();
}
