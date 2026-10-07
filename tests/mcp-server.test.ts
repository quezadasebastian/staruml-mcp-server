import { describe, it, expect } from "vitest";
import path from "node:path";
import fs from "node:fs/promises";
import { createStarUmlMcpServer } from "../src/server.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

const TEST_OUTPUT_DIR = path.resolve("./tests/output");

describe("MCP Server Tool Invocation Test Suite", () => {
  it("should initialize McpServer and register all 4 tools", async () => {
    const server = createStarUmlMcpServer();
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    const client = new Client(
      { name: "test-client", version: "1.0.0" },
      { capabilities: {} }
    );

    await Promise.all([
      server.connect(serverTransport),
      client.connect(clientTransport)
    ]);

    const toolList = await client.listTools();
    const toolNames = toolList.tools.map((t) => t.name);

    expect(toolNames).toContain("generate_class_diagram");
    expect(toolNames).toContain("generate_use_case_diagram");
    expect(toolNames).toContain("generate_sequence_diagram");
    expect(toolNames).toContain("inspect_mdj_model");
    expect(toolNames).toHaveLength(4);

    await client.close();
    await server.close();
  });

  it("should invoke generate_class_diagram and inspect_mdj_model via MCP client", async () => {
    const server = createStarUmlMcpServer();
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    const client = new Client(
      { name: "test-client", version: "1.0.0" },
      { capabilities: {} }
    );

    await Promise.all([
      server.connect(serverTransport),
      client.connect(clientTransport)
    ]);

    const targetFile = path.join(TEST_OUTPUT_DIR, "mcp_generated_class.mdj");

    // Call generate_class_diagram
    const genResult = await client.callTool({
      name: "generate_class_diagram",
      arguments: {
        filePath: targetFile,
        projectName: "MCP Test Project",
        diagramName: "Core Architecture",
        classes: [
          {
            id: "vehicle",
            name: "Vehicle",
            stereotype: "abstract",
            attributes: [{ name: "vin", type: "string", visibility: "protected" }],
            operations: [{ name: "start", returnType: "void", visibility: "public" }]
          },
          {
            id: "car",
            name: "Car",
            attributes: [{ name: "doors", type: "number", visibility: "public" }],
            operations: [{ name: "drive", returnType: "void", visibility: "public" }]
          }
        ],
        relationships: [
          {
            id: "gen_car_vehicle",
            type: "generalization",
            sourceId: "car",
            targetId: "vehicle"
          }
        ]
      }
    });

    expect(genResult.isError).toBeFalsy();
    const textContent = (genResult.content as any)[0].text;
    expect(textContent).toContain("Successfully generated StarUML Class Diagram");

    // Ensure file exists
    const exists = await fs.stat(targetFile).then(() => true).catch(() => false);
    expect(exists).toBe(true);

    // Call inspect_mdj_model on the generated file
    const inspectResult = await client.callTool({
      name: "inspect_mdj_model",
      arguments: {
        filePath: targetFile
      }
    });

    expect(inspectResult.isError).toBeFalsy();
    const inspectText = (inspectResult.content as any)[0].text;
    expect(inspectText).toContain("MCP Test Project");
    expect(inspectText).toContain("Vehicle");
    expect(inspectText).toContain("Car");
    expect(inspectText).toContain("**Car** ──(generalization)──> **Vehicle**");

    await client.close();
    await server.close();
  });
});
