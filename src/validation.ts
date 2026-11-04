
import { exec } from "node:child_process";
import type { ValidationResult } from "./types.js";


function stripAnsi(text: string): string {
  return text.replace(/\u001B\[[0-?]*[ -/]*[@-~]/g, "");
}

export function runValidation(
  command: string,
  cwd: string,
): Promise<ValidationResult> {
  return new Promise((resolve) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      const output = stripAnsi(
  [stdout, stderr, error?.message]
    .filter(Boolean)
    .join("\n")
    .trim(),
);

      resolve({
        command,
        status: error ? "failed" : "passed",
        output,
      });
    });
  });
}

export async function runValidations(
  commands: string[],
  cwd: string,
): Promise<ValidationResult[]> {
  const results: ValidationResult[] = [];

  for (const command of commands) {
    results.push(await runValidation(command, cwd));
  }

  return results;
}
