import path from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { ToolAnnotations } from "@modelcontextprotocol/sdk/types.js";
import {
  GenerateClassDiagramSchema,
  GenerateUseCaseDiagramSchema,
  GenerateSequenceDiagramSchema,
  GenerateActivityDiagramSchema,
  GenerateStateMachineDiagramSchema,
  GenerateComponentDiagramSchema,
  GenerateDeploymentDiagramSchema,
  GenerateObjectDiagramSchema,
  GenerateCommunicationDiagramSchema,
  InspectMdjModelSchema
} from "./types.js";
import {
  buildClassDiagramMdj,
  buildUseCaseDiagramMdj,
  buildSequenceDiagramMdj,
  buildActivityDiagramMdj,
  buildStateMachineDiagramMdj,
  buildComponentDiagramMdj,
  buildDeploymentDiagramMdj,
  buildObjectDiagramMdj,
  buildCommunicationDiagramMdj
} from "./staruml/mdj-builder.js";
import { inspectMdjFile } from "./inspector/mdj-inspector.js";
import { writeAtomicJson } from "./utils/file-writer.js";

/**
 * Creates and configures the StarUML MCP server with all 10 diagram tools supporting the 4+1 View Model.
 */
export function createStarUmlMcpServer(): McpServer {
  const server = new McpServer({
    name: "staruml-mcp-server",
    version: "1.0.0"
  });

  const fileWriterAnnotations: ToolAnnotations = {
    readOnlyHint: false,
    destructiveHint: true,
    idempotentHint: true,
    openWorldHint: false
  };

  const readOnlyAnnotations: ToolAnnotations = {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false
  };

  // Tool 1: generate_class_diagram
  server.tool(
    "generate_class_diagram",
    "Compiles an object-oriented domain model into a complete StarUML (.mdj) file with auto-calculated coordinates and spatial layout.",
    GenerateClassDiagramSchema.shape,
    fileWriterAnnotations,
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
    fileWriterAnnotations,
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
    fileWriterAnnotations,
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

  // Tool 4: generate_activity_diagram
  server.tool(
    "generate_activity_diagram",
    "Generates a UML 2.5.1 Activity Diagram with actions, control nodes (initial, final, decision, merge, fork, join), and control flows with Dagre auto-layout.",
    GenerateActivityDiagramSchema.shape,
    fileWriterAnnotations,
    async (args) => {
      try {
        const validated = GenerateActivityDiagramSchema.parse(args);
        const resolvedPath = path.resolve(validated.filePath);

        const mdjAst = buildActivityDiagramMdj(validated);
        await writeAtomicJson(resolvedPath, mdjAst);

        const nodeCount = validated.nodes.length;
        const flowCount = validated.flows.length;

        return {
          content: [
            {
              type: "text",
              text: `Successfully generated StarUML Activity Diagram:
- File: ${resolvedPath}
- Diagram Name: "${validated.diagramName}"
- Nodes: ${nodeCount}
- Control Flows: ${flowCount}
Layout: Top-to-Bottom workflow auto-arranged using Dagre layout engine.`
            }
          ]
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to generate activity diagram: ${(err as Error).message}`
            }
          ],
          isError: true
        };
      }
    }
  );

  // Tool 5: generate_state_machine_diagram
  server.tool(
    "generate_state_machine_diagram",
    "Creates a UML 2.5.1 State Machine (Statechart) Diagram with states, pseudostates (initial, choice, junction), final states, and transitions with triggers and guards.",
    GenerateStateMachineDiagramSchema.shape,
    fileWriterAnnotations,
    async (args) => {
      try {
        const validated = GenerateStateMachineDiagramSchema.parse(args);
        const resolvedPath = path.resolve(validated.filePath);

        const mdjAst = buildStateMachineDiagramMdj(validated);
        await writeAtomicJson(resolvedPath, mdjAst);

        const stateCount = validated.states.length;
        const transCount = validated.transitions.length;

        return {
          content: [
            {
              type: "text",
              text: `Successfully generated StarUML State Machine Diagram:
- File: ${resolvedPath}
- Diagram Name: "${validated.diagramName}"
- States & Pseudostates: ${stateCount}
- Transitions: ${transCount}
Layout: Reactive statechart auto-arranged using Dagre layout engine.`
            }
          ]
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to generate state machine diagram: ${(err as Error).message}`
            }
          ],
          isError: true
        };
      }
    }
  );

  // Tool 6: generate_component_diagram
  server.tool(
    "generate_component_diagram",
    "Builds a UML 2.5.1 Component Diagram with components, subsystems, interfaces, and dependencies/realizations with Dagre auto-layout.",
    GenerateComponentDiagramSchema.shape,
    fileWriterAnnotations,
    async (args) => {
      try {
        const validated = GenerateComponentDiagramSchema.parse(args);
        const resolvedPath = path.resolve(validated.filePath);

        const mdjAst = buildComponentDiagramMdj(validated);
        await writeAtomicJson(resolvedPath, mdjAst);

        const compCount = validated.components.length;
        const ifaceCount = validated.interfaces?.length ?? 0;
        const relCount = validated.relationships.length;

        return {
          content: [
            {
              type: "text",
              text: `Successfully generated StarUML Component Diagram:
- File: ${resolvedPath}
- Diagram Name: "${validated.diagramName}"
- Components: ${compCount}
- Interfaces: ${ifaceCount}
- Relationships: ${relCount}
Layout: Modular component hierarchy auto-arranged using Dagre layout engine.`
            }
          ]
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to generate component diagram: ${(err as Error).message}`
            }
          ],
          isError: true
        };
      }
    }
  );

  // Tool 7: generate_deployment_diagram
  server.tool(
    "generate_deployment_diagram",
    "Constructs a UML 2.5.1 Deployment Diagram with execution nodes, devices, artifacts, and communication paths.",
    GenerateDeploymentDiagramSchema.shape,
    fileWriterAnnotations,
    async (args) => {
      try {
        const validated = GenerateDeploymentDiagramSchema.parse(args);
        const resolvedPath = path.resolve(validated.filePath);

        const mdjAst = buildDeploymentDiagramMdj(validated);
        await writeAtomicJson(resolvedPath, mdjAst);

        const nodeCount = validated.nodes.length;
        const artCount = validated.artifacts?.length ?? 0;
        const connCount = validated.connections.length;

        return {
          content: [
            {
              type: "text",
              text: `Successfully generated StarUML Deployment Diagram:
- File: ${resolvedPath}
- Diagram Name: "${validated.diagramName}"
- Nodes: ${nodeCount}
- Artifacts: ${artCount}
- Communication Paths: ${connCount}
Layout: Physical architecture auto-arranged using Dagre layout engine.`
            }
          ]
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to generate deployment diagram: ${(err as Error).message}`
            }
          ],
          isError: true
        };
      }
    }
  );

  // Tool 8: generate_object_diagram
  server.tool(
    "generate_object_diagram",
    "Generates a UML 2.5.1 Object (Instance) Diagram with objects, slots (attribute values), and links connecting instances.",
    GenerateObjectDiagramSchema.shape,
    fileWriterAnnotations,
    async (args) => {
      try {
        const validated = GenerateObjectDiagramSchema.parse(args);
        const resolvedPath = path.resolve(validated.filePath);

        const mdjAst = buildObjectDiagramMdj(validated);
        await writeAtomicJson(resolvedPath, mdjAst);

        const objCount = validated.objects.length;
        const linkCount = validated.links.length;

        return {
          content: [
            {
              type: "text",
              text: `Successfully generated StarUML Object Diagram:
- File: ${resolvedPath}
- Diagram Name: "${validated.diagramName}"
- Objects / Instances: ${objCount}
- Links: ${linkCount}
Layout: Instance graph auto-arranged using Dagre layout engine.`
            }
          ]
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to generate object diagram: ${(err as Error).message}`
            }
          ],
          isError: true
        };
      }
    }
  );

  // Tool 9: generate_communication_diagram
  server.tool(
    "generate_communication_diagram",
    "Creates a UML 2.5.1 Communication (Collaboration) Diagram with participant lifelines and hierarchically numbered messages (1, 1.1, 2).",
    GenerateCommunicationDiagramSchema.shape,
    fileWriterAnnotations,
    async (args) => {
      try {
        const validated = GenerateCommunicationDiagramSchema.parse(args);
        const resolvedPath = path.resolve(validated.filePath);

        const mdjAst = buildCommunicationDiagramMdj(validated);
        await writeAtomicJson(resolvedPath, mdjAst);

        const lifelineCount = validated.lifelines.length;
        const msgCount = validated.messages.length;

        return {
          content: [
            {
              type: "text",
              text: `Successfully generated StarUML Communication Diagram:
- File: ${resolvedPath}
- Diagram Name: "${validated.diagramName}"
- Lifelines / Participants: ${lifelineCount}
- Sequenced Messages: ${msgCount}
Layout: Collaboration topology auto-arranged using Dagre layout engine.`
            }
          ]
        };
      } catch (err) {
        return {
          content: [
            {
              type: "text",
              text: `Failed to generate communication diagram: ${(err as Error).message}`
            }
          ],
          isError: true
        };
      }
    }
  );

  // Tool 10: inspect_mdj_model
  server.tool(
    "inspect_mdj_model",
    "Reads an existing .mdj file and returns a concise structural overview (list of diagrams, classes, interfaces, relationships, and methods) so the agent can understand an existing project before modifying it.",
    InspectMdjModelSchema.shape,
    readOnlyAnnotations,
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
