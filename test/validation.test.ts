
import { describe, expect, it } from "vitest";
import { runValidation, runValidations } from "../src/validation.js";

describe("runValidation", () => {
  it("returns passed when the command succeeds", async () => {
    const result = await runValidation(
      'node -e "console.log(\'success\')"',
      process.cwd(),
    );

    expect(result.status).toBe("passed");
    expect(result.output).toContain("success");
  });

  it("returns failed when the command fails", async () => {
    const result = await runValidation(
      'node -e "console.error(\'failure\'); process.exit(1)"',
      process.cwd(),
    );

    expect(result.status).toBe("failed");
    expect(result.output).toContain("failure");
  });

  it("removes ANSI color codes from command output", async () => {
    const result = await runValidation(
      'node -e "process.stdout.write(\'\\u001b[32mSUCCESS\\u001b[0m\')"',
      process.cwd(),
    );

    expect(result.output).toBe("SUCCESS");
  });
});

describe("runValidations", () => {
  it("continues after a failed command", async () => {
    const results = await runValidations(
      [
        'node -e "process.exit(1)"',
        'node -e "console.log(\'success\')"',
      ],
      process.cwd(),
    );

    expect(results).toHaveLength(2);
    expect(results[0].status).toBe("failed");
    expect(results[1].status).toBe("passed");
  });
});
