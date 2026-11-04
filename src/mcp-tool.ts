import { z } from "zod";
import { reviewRepository } from "./core.js";

export const reviewRepositorySchema = z.object({
  repo_path: z.string().describe("Repository path to inspect."),
  base_ref: z.string().optional(),
});

export async function handleReviewRepository(
  input: z.infer<typeof reviewRepositorySchema>,
) {
  const report = await reviewRepository({
    repositoryPath: input.repo_path,
    baseRef: input.base_ref,
  });

  return {
    content: [{ type: "text" as const, text: report }],
  };
}