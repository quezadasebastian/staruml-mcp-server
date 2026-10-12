import { describe, it, expect } from "vitest";
import path from "node:path";
import fs from "node:fs/promises";
import { createStarUmlMcpServer } from "../src/server.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";

const TEST_OUTPUT_DIR = path.resolve("./tests/output");

describe("MCP Server Tool Invocation Test Suite", () => {
  it("should initialize McpServer and register all 10 tools supporting the 4+1 View Model", async () => {
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

    // 4+1 View Tools
    expect(toolNames).toContain("generate_class_diagram");
    expect(toolNames).toContain("generate_use_case_diagram");
    expect(toolNames).toContain("generate_sequence_diagram");
    expect(toolNames).toContain("generate_activity_diagram");
    expect(toolNames).toContain("generate_state_machine_diagram");
    expect(toolNames).toContain("generate_component_diagram");
    expect(toolNames).toContain("generate_deployment_diagram");
    expect(toolNames).toContain("generate_object_diagram");
    expect(toolNames).toContain("generate_communication_diagram");
    expect(toolNames).toContain("inspect_mdj_model");
    expect(toolNames).toHaveLength(10);

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

    const writerTools = [
      "generate_class_diagram",
      "generate_use_case_diagram",
      "generate_sequence_diagram",
      "generate_activity_diagram",
      "generate_state_machine_diagram",
      "generate_component_diagram",
      "generate_deployment_diagram",
      "generate_object_diagram",
      "generate_communication_diagram"
    ];

    for (const toolName of writerTools) {
      const tool = toolsByName.get(toolName);
      expect(tool?.annotations).toEqual({
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false
      });
    }

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

    const exists = await fs.stat(targetFile).then(() => true).catch(() => false);
    expect(exists).toBe(true);

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

  it("should generate activity diagram via MCP client", async () => {
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

    const targetFile = path.join(TEST_OUTPUT_DIR, "mcp_generated_activity.mdj");

    const genResult = await client.callTool({
      name: "generate_activity_diagram",
      arguments: {
        filePath: targetFile,
        diagramName: "Checkout Process Flow",
        nodes: [
          { id: "init", name: "Start", type: "initial" },
          { id: "check_cart", name: "Validate Cart", type: "action" },
          { id: "dec_stock", name: "Stock Available?", type: "decision" },
          { id: "charge", name: "Charge Payment", type: "action" },
          { id: "fin", name: "End", type: "final" }
        ],
        flows: [
          { id: "f1", sourceId: "init", targetId: "check_cart" },
          { id: "f2", sourceId: "check_cart", targetId: "dec_stock" },
          { id: "f3", sourceId: "dec_stock", targetId: "charge", guard: "[yes]" },
          { id: "f4", sourceId: "charge", targetId: "fin" }
        ]
      }
    });

    expect(genResult.isError).toBeFalsy();
    const textContent = (genResult.content as any)[0].text;
    expect(textContent).toContain("Successfully generated StarUML Activity Diagram");

    const exists = await fs.stat(targetFile).then(() => true).catch(() => false);
    expect(exists).toBe(true);

    await client.close();
    await server.close();
  });

  it("should generate state machine diagram via MCP client", async () => {
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

    const targetFile = path.join(TEST_OUTPUT_DIR, "mcp_generated_state_machine.mdj");

    const genResult = await client.callTool({
      name: "generate_state_machine_diagram",
      arguments: {
        filePath: targetFile,
        diagramName: "Order Lifecycle",
        states: [
          { id: "s_init", name: "Initial", type: "initial" },
          { id: "s_pending", name: "Pending", type: "state", entryActivity: "entry / sendNotice()" },
          { id: "s_paid", name: "Paid", type: "state" },
          { id: "s_final", name: "Closed", type: "final" }
        ],
        transitions: [
          { id: "t1", sourceId: "s_init", targetId: "s_pending" },
          { id: "t2", sourceId: "s_pending", targetId: "s_paid", trigger: "pay()", guard: "[amount > 0]" },
          { id: "t3", sourceId: "s_paid", targetId: "s_final", trigger: "deliver()" }
        ]
      }
    });

    expect(genResult.isError).toBeFalsy();
    const textContent = (genResult.content as any)[0].text;
    expect(textContent).toContain("Successfully generated StarUML State Machine Diagram");

    const exists = await fs.stat(targetFile).then(() => true).catch(() => false);
    expect(exists).toBe(true);

    await client.close();
    await server.close();
  });

  it("should generate component, deployment, object and communication diagrams via MCP client", async () => {
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

    // Component Diagram
    const compFile = path.join(TEST_OUTPUT_DIR, "mcp_generated_component.mdj");
    const compResult = await client.callTool({
      name: "generate_component_diagram",
      arguments: {
        filePath: compFile,
        diagramName: "Microservices Architecture",
        components: [
          { id: "comp_web", name: "WebClient", stereotype: "frontend" },
          { id: "comp_api", name: "APIGateway", stereotype: "subsystem" }
        ],
        relationships: [
          { id: "r1", type: "dependency", sourceId: "comp_web", targetId: "comp_api" }
        ]
      }
    });
    expect(compResult.isError).toBeFalsy();

    // Deployment Diagram
    const depFile = path.join(TEST_OUTPUT_DIR, "mcp_generated_deployment.mdj");
    const depResult = await client.callTool({
      name: "generate_deployment_diagram",
      arguments: {
        filePath: depFile,
        diagramName: "Cloud Infrastructure",
        nodes: [
          { id: "n_lb", name: "LoadBalancer", stereotype: "server" },
          { id: "n_app", name: "AppServer", stereotype: "executionEnvironment" }
        ],
        connections: [
          { id: "c1", sourceId: "n_lb", targetId: "n_app", name: "HTTPS" }
        ]
      }
    });
    expect(depResult.isError).toBeFalsy();

    // Object Diagram
    const objFile = path.join(TEST_OUTPUT_DIR, "mcp_generated_object.mdj");
    const objResult = await client.callTool({
      name: "generate_object_diagram",
      arguments: {
        filePath: objFile,
        diagramName: "Active Order Snapshot",
        objects: [
          {
            id: "o_user",
            name: "juan:Cliente",
            className: "Cliente",
            slots: [{ name: "email", value: "juan@mail.com" }]
          },
          {
            id: "o_order",
            name: "ped100:Pedido",
            className: "Pedido",
            slots: [{ name: "total", value: "150.00" }]
          }
        ],
        links: [
          { id: "l1", sourceId: "o_user", targetId: "o_order", name: "crea" }
        ]
      }
    });
    expect(objResult.isError).toBeFalsy();

    // Communication Diagram
    const commFile = path.join(TEST_OUTPUT_DIR, "mcp_generated_communication.mdj");
    const commResult = await client.callTool({
      name: "generate_communication_diagram",
      arguments: {
        filePath: commFile,
        diagramName: "Order Placement Collaboration",
        lifelines: [
          { id: "ll_client", name: ":Client" },
          { id: "ll_srv", name: ":OrderService" }
        ],
        messages: [
          { id: "m1", sourceId: "ll_client", targetId: "ll_srv", sequenceNumber: "1", name: "placeOrder()" }
        ]
      }
    });
    expect(commResult.isError).toBeFalsy();

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
