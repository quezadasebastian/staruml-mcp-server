import path from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  GenerateClassDiagramSchema,
  GenerateUseCaseDiagramSchema,
  GenerateSequenceDiagramSchema,
  InspectMdjModelSchema
} from "./types.js";
import { buildClassDiagramMdj, buildUseCaseDiagramMdj, buildSequenceDiagramMdj } from "./staruml/mdj-builder.js";
import { inspectMdjFile } from "./inspector/mdj-inspector.js";
import { writeAtomicJson } from "./utils/file-writer.js";

/**
 * Creates and configures the StarUML MCP server with all four diagram manipulation tools.
 */
export function createStarUmlMcpServer(): McpServer {
  const server = new McpServer({
    name: "staruml-mcp-server",
    version: "1.0.0"
  });

  // Tool 1: generate_class_diagram
  server.tool(
    "generate_class_diagram",
    "Compiles an object-oriented domain model into a complete StarUML (.mdj) file with auto-calculated coordinates and spatial layout.",
    GenerateClassDiagramSchema.shape,
    async (args) => {
      try {
        const validated = GenerateClassDiagramSchema.parse(args);
        const resolvedPath = path.resolve(validated.filePath);

        const mdjAst = buildClassDiagramMdj(validated);
        await writeAtomicJson(resolvedPath, mdjAst);

        const classCount = validated.classes.length;
        const relCount = validated.relationships.length;

        return {
          content: [
            {
              type: "text",
              text: `Successfully generated StarUML Class Diagram:
- File: ${resolvedPath}
- Diagram Name: "${validated.diagramName}"
- Classes & Interfaces: ${classCount}
- Relationships: ${relCount}
Layout: Orthogonal DAG auto-routed using Dagre layout engine.`
            }
          ]
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to generate class diagram: ${(err as Error).message}`
            }
          ],
          isError: true
        };
      }
    }
  );

  // Tool 2: generate_use_case_diagram
  server.tool(
    "generate_use_case_diagram",
    "Builds a Use Case diagram with actors, boundary systems, use cases, and relationships (association, include, extend, generalization).",
    GenerateUseCaseDiagramSchema.shape,
    async (args) => {
      try {
        const validated = GenerateUseCaseDiagramSchema.parse(args);
        const resolvedPath = path.resolve(validated.filePath);

        const mdjAst = buildUseCaseDiagramMdj(validated);
        await writeAtomicJson(resolvedPath, mdjAst);

        const actorCount = validated.actors.length;
        const ucCount = validated.useCases.length;
        const relCount = validated.relationships.length;
        const boundarySet = new Set(validated.useCases.map((u) => u.systemBoundary).filter(Boolean));

        return {
          content: [
            {
              type: "text",
              text: `Successfully generated StarUML Use Case Diagram:
- File: ${resolvedPath}
- Diagram Name: "${validated.diagramName}"
- Actors: ${actorCount}
- Use Cases: ${ucCount}
- System Boundaries: ${boundarySet.size} (${Array.from(boundarySet).join(", ") || "None"})
- Relationships: ${relCount}
Layout: Left-to-Right auto-arranged layout with boundary bounds calculation.`
            }
          ]
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to generate use case diagram: ${(err as Error).message}`
            }
          ],
          isError: true
        };
      }
    }
  );

  // Tool 3: generate_sequence_diagram
  server.tool(
    "generate_sequence_diagram",
    "Creates an interaction sequence diagram with lifelines and synchronous/asynchronous/reply messages arranged in chronological vertical order.",
    GenerateSequenceDiagramSchema.shape,
    async (args) => {
      try {
        const validated = GenerateSequenceDiagramSchema.parse(args);
        const resolvedPath = path.resolve(validated.filePath);

        const mdjAst = buildSequenceDiagramMdj(validated);
        await writeAtomicJson(resolvedPath, mdjAst);

        const lifelineCount = validated.lifelines.length;
        const messageCount = validated.messages.length;

        return {
          content: [
            {
              type: "text",
              text: `Successfully generated StarUML Sequence Diagram:
- File: ${resolvedPath}
- Diagram Name: "${validated.diagramName}"
- Lifelines: ${lifelineCount}
- Messages: ${messageCount}
Layout: Chronological vertical timeline layout with lifeline tracking.`
            }
          ]
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to generate sequence diagram: ${(err as Error).message}`
            }
          ],
          isError: true
        };
      }
    }
  );

  // Tool 4: inspect_mdj_model
  server.tool(
    "inspect_mdj_model",
    "Reads an existing .mdj file and returns a concise structural overview (list of diagrams, classes, interfaces, relationships, and methods) so the agent can understand an existing project before modifying it.",
    InspectMdjModelSchema.shape,
    async (args) => {
      try {
        const validated = InspectMdjModelSchema.parse(args);
        const resolvedPath = path.resolve(validated.filePath);

        const inspection = await inspectMdjFile(resolvedPath);

        return {
          content: [
            {
              type: "text",
              text: inspection.overviewMarkdown
            }
          ]
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to inspect StarUML file: ${(err as Error).message}`
            }
          ],
          isError: true
        };
      }
    }
  );

  return server;
}
