#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createStarUmlMcpServer } from "./server.js";

async function main() {
  const server = createStarUmlMcpServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);
  console.error("StarUML MCP Server initialized and listening on stdio.");
}

main().catch((err) => {
  console.error("Fatal error starting StarUML MCP Server:", err);
  process.exit(1);
});
