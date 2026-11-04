import { describe, expect, it, vi } from "vitest";

vi.mock("../src/core.js", () => ({
  reviewRepository: vi.fn().mockResolvedValue("# Review Report"),
}));

import { reviewRepository } from "../src/core.js";
import {
  handleReviewRepository,
  reviewRepositorySchema,
} from "../src/mcp-tool.js";

describe("MCP tool security", () => {
  it("accepts only the declared repository parameters", () => {
    expect(Object.keys(reviewRepositorySchema.shape)).toEqual([
      "repo_path",
      "base_ref",
    ]);
  });

  it("does not pass shell commands to reviewRepository", async () => {
    await handleReviewRepository({
      repo_path: ".",
      base_ref: "main",
    });

    expect(reviewRepository).toHaveBeenCalledWith({
      repositoryPath: ".",
      baseRef: "main",
    });
  });

  it("does not preserve validation_commands in parsed input", () => {
    const result = reviewRepositorySchema.parse({
      repo_path: ".",
      base_ref: "main",
      validation_commands: ["whoami"],
    });

    expect(result).toEqual({
      repo_path: ".",
      base_ref: "main",
    });

    expect(result).not.toHaveProperty("validation_commands");
  });
});