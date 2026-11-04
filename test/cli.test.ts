
import { describe, expect, it } from "vitest";
import { parseArgs } from "../src/cli.js";

describe("parseArgs", () => {
  it("preserves repository paths containing spaces", () => {
    const args = parseArgs([
      "review",
      "--repo",
      "C:/Users/User/My Projects/repository",
    ]);

    expect(args.repositoryPath).toBe(
      "C:/Users/User/My Projects/repository",
    );
  });
});
