import * as fs from "fs";
import * as path from "path";
import { CLIArgs } from "./types";

export function parseArgs(): CLIArgs {
  const args = process.argv.slice(2);
  const result: CLIArgs = {
    dryRun: false,
    skipExa: false,
    skipReddit: false,
    skipHn: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case "--limit":
        result.limit = parseInt(args[++i], 10);
        break;
      case "--output-dir":
        result.outputDir = args[++i];
        break;
      case "--dry-run":
        result.dryRun = true;
        break;
      case "--skip-exa":
        result.skipExa = true;
        break;
      case "--skip-reddit":
        result.skipReddit = true;
        break;
      case "--skip-hn":
        result.skipHn = true;
        break;
    }
  }

  return result;
}

export function todayStamp(): string {
  return new Date().toISOString().split("T")[0];
}

export function ensureDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function writeOutput(outputDir: string, filename: string, data: unknown): string {
  ensureDir(outputDir);
  const filePath = path.join(outputDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return filePath;
}

export function readJsonFile<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

export function findLatestFile(dir: string, prefix: string): string | null {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir)
    .filter((f) => f.startsWith(prefix) && f.endsWith(".json"))
    .sort()
    .reverse();
  return files.length > 0 ? path.join(dir, files[0]) : null;
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function log(prefix: string, msg: string): void {
  const ts = new Date().toISOString().split("T")[1].split(".")[0];
  console.log(`[${ts}] [${prefix}] ${msg}`);
}
