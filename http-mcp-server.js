import { spawn } from "child_process";
import express from "express";
import {
  Server
} from "@modelcontextprotocol/sdk/server/index.js";
import {
  HttpServerTransport
} from "@modelcontextprotocol/sdk/server/http.js";

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Spawn the GitHub MCP server (stdio-based)
 */
const child = spawn("node", ["dist/index.js"], {
  env: process.env,
  stdio: ["pipe", "pipe", "inherit"]
});

/**
 * Create MCP server wrapper
 */
const mcpServer = new Server(
  { name: "github-mcp-http-wrapper", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

const transport = new HttpServerTransport({
  app,
  endpoint: "/mcp",
  input: child.stdout,
  output: child.stdin
});

await mcpServer.connect(transport);

app.listen(PORT, () => {
  console.log(`✅ MCP HTTP server running on port ${PORT}`);
  console.log(`✅ MCP endpoint available at /mcp`);
});
