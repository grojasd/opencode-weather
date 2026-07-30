const RESET = "\x1b[0m";
const CYAN = "\x1b[36m";
const YELLOW = "\x1b[33m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";

export function cyan(s: string): string {
  return `${CYAN}${s}${RESET}`;
}

export function yellow(s: string): string {
  return `${YELLOW}${s}${RESET}`;
}

export function green(s: string): string {
  return `${GREEN}${s}${RESET}`;
}

export function red(s: string): string {
  return `${RED}${s}${RESET}`;
}
