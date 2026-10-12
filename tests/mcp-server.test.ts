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

  it("should expose accurate ToolAnnotations for each registered tool", async () => {
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
    const toolsByName = new Map(toolList.tools.map((t) => [t.name, t]));

    const classTool = toolsByName.get("generate_class_diagram");
    expect(classTool?.annotations).toEqual({
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: false
    });

    const useCaseTool = toolsByName.get("generate_use_case_diagram");
    expect(useCaseTool?.annotations).toEqual({
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: false
    });

    const sequenceTool = toolsByName.get("generate_sequence_diagram");
    expect(sequenceTool?.annotations).toEqual({
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: false
    });

    const inspectTool = toolsByName.get("inspect_mdj_model");
    expect(inspectTool?.annotations).toEqual({
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false
    });

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

  it("should fail gracefully when filePath is empty or lacks .mdj extension", async () => {
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

    // Test with non-.mdj file
    const nonMdjResult = await client.callTool({
      name: "generate_class_diagram",
      arguments: {
        filePath: "invalid_file.txt",
        diagramName: "Invalid",
        classes: [],
        relationships: []
      }
    });
    expect(nonMdjResult.isError).toBe(true);
    const nonMdjText = (nonMdjResult.content as any)[0].text;
    expect(nonMdjText).toContain("File path must have a .mdj extension");

    // Test with empty filePath
    const emptyResult = await client.callTool({
      name: "generate_class_diagram",
      arguments: {
        filePath: "",
        diagramName: "Invalid",
        classes: [],
        relationships: []
      }
    });
    expect(emptyResult.isError).toBe(true);
    const emptyText = (emptyResult.content as any)[0].text;
    expect(emptyText).toContain("File path cannot be empty");

    await client.close();
    await server.close();
  });

  it("should return controlled error when inspecting non-existent file", async () => {
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

    const nonExistentPath = path.join(TEST_OUTPUT_DIR, "non_existent_file.mdj");
    const inspectResult = await client.callTool({
      name: "inspect_mdj_model",
      arguments: {
        filePath: nonExistentPath
      }
    });

    expect(inspectResult.isError).toBe(true);
    const inspectText = (inspectResult.content as any)[0].text;
    expect(inspectText).toContain("File does not exist");

    await client.close();
    await server.close();
  });

  it("should return controlled error when inspecting a directory instead of file", async () => {
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

    // Create a directory ending with .mdj to test directory check
    const dirAsFile = path.join(TEST_OUTPUT_DIR, "directory_target.mdj");
    await fs.mkdir(dirAsFile, { recursive: true });

    const inspectResult = await client.callTool({
      name: "inspect_mdj_model",
      arguments: {
        filePath: dirAsFile
      }
    });

    expect(inspectResult.isError).toBe(true);
    const inspectText = (inspectResult.content as any)[0].text;
    expect(inspectText).toContain("Target path is a directory, not a file");

    await fs.rmdir(dirAsFile);
    await client.close();
    await server.close();
  });

  it("should return controlled error when inspecting corrupt non-JSON file", async () => {
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

    const corruptPath = path.join(TEST_OUTPUT_DIR, "corrupt.mdj");
    await fs.writeFile(corruptPath, "INVALID NOT A JSON", "utf-8");

    const inspectResult = await client.callTool({
      name: "inspect_mdj_model",
      arguments: {
        filePath: corruptPath
      }
    });

    expect(inspectResult.isError).toBe(true);
    const inspectText = (inspectResult.content as any)[0].text;
    expect(inspectText).toContain("Failed to parse StarUML .mdj file");

    await fs.unlink(corruptPath);
    await client.close();
    await server.close();
  });
});
