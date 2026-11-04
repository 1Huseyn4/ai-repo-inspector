import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  handleReviewRepository,
  reviewRepositorySchema,
} from "./mcp-tool.js";

const server = new McpServer({
  name: "repository-inspector",
  version: "2.0.0",
});

server.tool(
  "review_repository",
  "Inspects Git changes in a repository and returns a review report.",
  reviewRepositorySchema.shape,
  handleReviewRepository,
);

const transport = new StdioServerTransport();
await server.connect(transport);