# Submission

## 1. What did you investigate first, and why?

I first inspected the project structure, README, security notes, and the main source files.

I focused on the shared review logic, CLI and MCP interfaces, Git inspection, validation execution, and report generation.

I prioritized these areas because they define the tool's main workflow and its security boundaries.

## 2. What did you implement or fix?

I made the following improvements:

- **Validation handling:** Validation failures are now returned as failed results instead of stopping the entire review process.
- **Validation output:** Standard output, standard error, and error messages are collected. ANSI escape codes are removed from the output.
- **CLI argument parsing:** Repository paths containing spaces are preserved.
- **CLI testability:** Exported `parseArgs` and added a direct-execution guard so importing the CLI module does not automatically execute the CLI.
- **MCP parameter mapping:** Fixed the mismatch between MCP input fields and the internal review request.
- **MCP security boundary:** Removed validation command execution parameters from the MCP interface.
- **Code organization:** Extracted the MCP tool schema and handler into `src/mcp-tool.ts` to make them independently testable.

## 3. What did you intentionally not do?

I avoided a large redesign and focused on targeted improvements within the available time.

I did not implement a complete sandbox for command execution, a full Git diff parser, or comprehensive MCP protocol integration tests.

The CLI still allows developers to explicitly provide validation commands. These commands are executed by the local process, so they must only be used with trusted commands and repositories.

## 4. Interface decision

### Decision: Hybrid, CLI-first

**Primary user and execution environment**

The primary user is a software developer working locally with Git repositories. The CLI is the primary interface because developers can run it directly in their terminal and explicitly choose validation commands.

The MCP interface provides a way for AI coding agents to inspect repository changes.

**Trust boundary and allowed capabilities**

The CLI allows a developer to explicitly provide validation commands through `--validate`.

The MCP interface accepts only a repository path and an optional base reference. It does not expose validation command execution as a tool parameter.

This reduces the capabilities exposed to an AI agent. It is not a complete sandbox and does not eliminate all risks associated with repository inspection.

**Reliability, discoverability, latency/context, and output trade-offs**

The CLI is easy to discover and use in local development workflows. Developers can see the commands they execute and inspect the generated Markdown report.

MCP makes repository inspection available to AI agents through a structured tool interface. It avoids requiring the agent to construct and execute shell commands for validation.

**How supported interfaces remain consistent**

Both interfaces use the shared `reviewRepository` function in `src/core.ts`.

This keeps the main review workflow shared while allowing each interface to expose different capabilities.

**What evidence could change this decision?**

If developers primarily use AI agents rather than terminal commands, an MCP-first approach may become more useful.

If MCP usage requires controlled validation execution, I would consider adding an explicit approval mechanism and stronger execution restrictions.

## 5. How did you use an AI coding agent?

I used ChatGPT to help inspect the code, understand potential bugs, discuss security boundaries, and develop targeted fixes and tests.

I reviewed the suggested changes, applied them locally, and verified them using TypeScript checks, unit tests, and a build.

## 6. Where did you check, correct, or reject an AI suggestion?

When I exported `parseArgs` to test CLI argument parsing, importing the CLI module also executed `main()`.

The test therefore triggered CLI behavior unexpectedly.

I corrected this by adding a direct-execution guard using `pathToFileURL`. This ensured that importing the module for testing would not start the CLI.

I also considered the security implications of exposing arbitrary validation commands through MCP and removed that capability from the MCP tool interface.

## 7. Commands used to verify the changes

The following commands completed successfully:

- `npm run typecheck` — passed with no TypeScript errors.
- `npm test` — all 9 tests passed across 4 test files.
- `npm run build` — completed successfully.
- `npm run inspector -- review --repo . --base-ref main --validate "npm test"` — generated `review-report.md`.

## 8. Blocker and approach

During manual testing, I noticed that uncommitted working-tree changes were not included in the report.

The current Git inspection compares the base reference with `HEAD`, so it does not include uncommitted changes.

I documented this behavior as a limitation rather than expanding the scope of the implementation.

## 9. Known limitations and next three things

Known limitations:

- Uncommitted working-tree changes are not included in the current Git comparison.
- MCP does not yet have full protocol-level integration tests.
- CLI validation commands are executed through the local shell and are not sandboxed.
- The report generator could be improved to safely handle arbitrary Markdown code fences in command output.

Next three things:

1. Add tests for Git inspection, including uncommitted and renamed files.
2. Add MCP protocol-level integration tests.
3. Improve command execution safety with timeouts, output limits, and clearer execution controls.

## 10. Approximate focused work time

Start: [21:10]

Finish: [22:16]

Total focused work time: 66 minutes