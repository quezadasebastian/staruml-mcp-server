import { z } from "zod";

/**
 * Reusable schema for validating StarUML (.mdj) file paths.
 * Enforces non-empty string and valid .mdj extension.
 */
export const MdjFilePathSchema = z
  .string()
  .min(1, "File path cannot be empty")
  .refine(
    (p) => p.trim().toLowerCase().endsWith(".mdj"),
    { message: "File path must have a .mdj extension" }
  );

// --- Tool 1: generate_class_diagram ---
export const ClassAttributeSchema = z.object({
  name: z.string().min(1, "Attribute name cannot be empty").describe("Attribute name"),
  type: z.string().min(1, "Attribute type cannot be empty").describe("Attribute data type"),
  visibility: z.enum(["public", "protected", "private", "package"]).optional().describe("Attribute visibility")
});

export const ClassOperationParameterSchema = z.object({
  name: z.string().min(1, "Parameter name cannot be empty").describe("Parameter name"),
  type: z.string().min(1, "Parameter type cannot be empty").describe("Parameter type")
});

export const ClassOperationSchema = z.object({
  name: z.string().min(1, "Operation name cannot be empty").describe("Operation / method name"),
  returnType: z.string().optional().describe("Return type (defaults to void if not specified)"),
  visibility: z.enum(["public", "protected", "private", "package"]).optional().describe("Operation visibility"),
  parameters: z.array(ClassOperationParameterSchema).optional().describe("Method parameters")
});

export const ClassEntitySchema = z.object({
  id: z.string().min(1, "Class ID cannot be empty").describe("Unique identifier for the class or interface"),
  name: z.string().min(1, "Class name cannot be empty").describe("Class name"),
  stereotype: z.string().optional().describe("e.g., 'interface', 'abstract', 'service'"),
  attributes: z.array(ClassAttributeSchema).optional().describe("List of attributes/properties"),
  operations: z.array(ClassOperationSchema).optional().describe("List of methods/operations")
});

export const ClassRelationshipSchema = z.object({
  id: z.string().min(1, "Relationship ID cannot be empty").describe("Unique identifier for the relationship"),
  type: z.enum(["association", "generalization", "composition", "aggregation", "dependency", "realization"]).describe("Relationship type"),
  sourceId: z.string().min(1, "Source class ID cannot be empty").describe("Source class/interface ID"),
  targetId: z.string().min(1, "Target class ID cannot be empty").describe("Target class/interface ID"),
  name: z.string().optional().describe("Optional label or relationship name"),
  sourceMultiplicity: z.string().optional().describe("Source end multiplicity, e.g. '1', '0..*'"),
  targetMultiplicity: z.string().optional().describe("Target end multiplicity, e.g. '1..*', '*'")
});

export const GenerateClassDiagramSchema = z.object({
  filePath: MdjFilePathSchema.describe("Destination path ending in .mdj (e.g., './output/architecture.mdj')"),
  projectName: z.string().optional().describe("Optional StarUML project name"),
  diagramName: z.string().min(1, "Diagram name cannot be empty").describe("Name of the class diagram"),
  classes: z.array(ClassEntitySchema).describe("Classes and interfaces in the diagram"),
  relationships: z.array(ClassRelationshipSchema).describe("Relationships connecting the classes")
});

export type GenerateClassDiagramInput = z.infer<typeof GenerateClassDiagramSchema>;
export type ClassEntity = z.infer<typeof ClassEntitySchema>;
export type ClassRelationship = z.infer<typeof ClassRelationshipSchema>;

// --- Tool 2: generate_use_case_diagram ---
export const ActorEntitySchema = z.object({
  id: z.string().min(1, "Actor ID cannot be empty").describe("Unique identifier for the actor"),
  name: z.string().min(1, "Actor name cannot be empty").describe("Actor name")
});

export const UseCaseEntitySchema = z.object({
  id: z.string().min(1, "Use case ID cannot be empty").describe("Unique identifier for the use case"),
  name: z.string().min(1, "Use case name cannot be empty").describe("Use case name"),
  systemBoundary: z.string().optional().describe("Optional system boundary container name")
});

export const UseCaseRelationshipSchema = z.object({
  id: z.string().min(1, "Relationship ID cannot be empty").describe("Unique identifier for the relationship"),
  type: z.enum(["association", "include", "extend", "generalization"]).describe("Relationship type"),
  sourceId: z.string().min(1, "Source ID cannot be empty").describe("Source actor or use case ID"),
  targetId: z.string().min(1, "Target ID cannot be empty").describe("Target actor or use case ID")
});

export const GenerateUseCaseDiagramSchema = z.object({
  filePath: MdjFilePathSchema.describe("Destination path ending in .mdj (e.g., './output/use_cases.mdj')"),
  projectName: z.string().optional().describe("Optional StarUML project name"),
  diagramName: z.string().min(1, "Diagram name cannot be empty").describe("Name of the use case diagram"),
  actors: z.array(ActorEntitySchema).describe("List of actors"),
  useCases: z.array(UseCaseEntitySchema).describe("List of use cases"),
  relationships: z.array(UseCaseRelationshipSchema).describe("Relationships between actors and use cases")
});

export type GenerateUseCaseDiagramInput = z.infer<typeof GenerateUseCaseDiagramSchema>;
export type ActorEntity = z.infer<typeof ActorEntitySchema>;
export type UseCaseEntity = z.infer<typeof UseCaseEntitySchema>;
export type UseCaseRelationship = z.infer<typeof UseCaseRelationshipSchema>;

// --- Tool 3: generate_sequence_diagram ---
export const LifelineEntitySchema = z.object({
  id: z.string().min(1, "Lifeline ID cannot be empty").describe("Unique identifier for the lifeline"),
  name: z.string().min(1, "Lifeline name cannot be empty").describe("Lifeline participant name"),
  representClass: z.string().optional().describe("Optional class or type name represented by lifeline")
});

export const SequenceMessageSchema = z.object({
  id: z.string().min(1, "Message ID cannot be empty").describe("Unique identifier for the message"),
  name: z.string().min(1, "Message name cannot be empty").describe("Message or invocation name"),
  sourceLifelineId: z.string().min(1, "Source lifeline ID cannot be empty").describe("Source lifeline ID"),
  targetLifelineId: z.string().min(1, "Target lifeline ID cannot be empty").describe("Target lifeline ID"),
  messageSort: z.enum(["synchCall", "asynchCall", "reply"]).describe("Message sort / call type")
});

export const GenerateSequenceDiagramSchema = z.object({
  filePath: MdjFilePathSchema.describe("Destination path ending in .mdj (e.g., './output/interaction.mdj')"),
  projectName: z.string().optional().describe("Optional StarUML project name"),
  diagramName: z.string().min(1, "Diagram name cannot be empty").describe("Name of the sequence diagram"),
  lifelines: z.array(LifelineEntitySchema).describe("List of lifelines / participants"),
  messages: z.array(SequenceMessageSchema).describe("Ordered chronological sequence messages")
});

export type GenerateSequenceDiagramInput = z.infer<typeof GenerateSequenceDiagramSchema>;
export type LifelineEntity = z.infer<typeof LifelineEntitySchema>;
export type SequenceMessage = z.infer<typeof SequenceMessageSchema>;

// --- Tool 4: inspect_mdj_model ---
export const InspectMdjModelSchema = z.object({
  filePath: MdjFilePathSchema.describe("Path to the existing .mdj file to inspect")
});

// --- Tool 5: generate_activity_diagram ---
export const ActivityNodeTypeEnum = z.enum([
  "initial",
  "action",
  "decision",
  "merge",
  "fork",
  "join",
  "final",
  "flowFinal"
]);

export const ActivityNodeSchema = z.object({
  id: z.string().min(1, "Activity node ID cannot be empty").describe("Unique identifier for node"),
  name: z.string().min(1, "Activity node name cannot be empty").describe("Node label or action name"),
  type: ActivityNodeTypeEnum.describe("Node kind in activity diagram")
});

export const ActivityFlowSchema = z.object({
  id: z.string().min(1, "Flow ID cannot be empty").describe("Unique identifier for control flow"),
  sourceId: z.string().min(1, "Source node ID cannot be empty").describe("Source node ID"),
  targetId: z.string().min(1, "Target node ID cannot be empty").describe("Target node ID"),
  name: z.string().optional().describe("Optional flow label"),
  guard: z.string().optional().describe("Optional guard condition in brackets, e.g. '[stock > 0]'")
});

export const GenerateActivityDiagramSchema = z.object({
  filePath: MdjFilePathSchema.describe("Destination path ending in .mdj (e.g., './output/activity.mdj')"),
  projectName: z.string().optional().describe("Optional StarUML project name"),
  diagramName: z.string().min(1, "Diagram name cannot be empty").describe("Name of the activity diagram"),
  nodes: z.array(ActivityNodeSchema).describe("List of activity and control nodes"),
  flows: z.array(ActivityFlowSchema).describe("Control flows connecting the nodes")
});

export type GenerateActivityDiagramInput = z.infer<typeof GenerateActivityDiagramSchema>;
export type ActivityNode = z.infer<typeof ActivityNodeSchema>;
export type ActivityFlow = z.infer<typeof ActivityFlowSchema>;

// --- Tool 6: generate_state_machine_diagram ---
export const StateNodeTypeEnum = z.enum([
  "initial",
  "state",
  "final",
  "choice",
  "junction"
]);

export const StateNodeSchema = z.object({
  id: z.string().min(1, "State ID cannot be empty").describe("Unique identifier for state"),
  name: z.string().min(1, "State name cannot be empty").describe("State name or label"),
  type: StateNodeTypeEnum.describe("State kind: initial, state, final, choice, junction"),
  entryActivity: z.string().optional().describe("Optional entry action, e.g. 'entry / log()'"),
  exitActivity: z.string().optional().describe("Optional exit action"),
  doActivity: z.string().optional().describe("Optional continuous activity, e.g. 'do / poll()'")
});

export const StateTransitionSchema = z.object({
  id: z.string().min(1, "Transition ID cannot be empty").describe("Unique identifier for transition"),
  sourceId: z.string().min(1, "Source state ID cannot be empty").describe("Source state ID"),
  targetId: z.string().min(1, "Target state ID cannot be empty").describe("Target state ID"),
  name: z.string().optional().describe("Optional transition label or event name"),
  trigger: z.string().optional().describe("Triggering event, e.g. 'pagoAprobado()'"),
  guard: z.string().optional().describe("Boolean guard condition, e.g. '[intentos < 3]'"),
  effect: z.string().optional().describe("Transition effect / action, e.g. 'enviarFactura()'")
});

export const GenerateStateMachineDiagramSchema = z.object({
  filePath: MdjFilePathSchema.describe("Destination path ending in .mdj (e.g., './output/state_machine.mdj')"),
  projectName: z.string().optional().describe("Optional StarUML project name"),
  diagramName: z.string().min(1, "Diagram name cannot be empty").describe("Name of the state machine diagram"),
  states: z.array(StateNodeSchema).describe("List of states and pseudostates"),
  transitions: z.array(StateTransitionSchema).describe("Transitions between states")
});

export type GenerateStateMachineDiagramInput = z.infer<typeof GenerateStateMachineDiagramSchema>;
export type StateNode = z.infer<typeof StateNodeSchema>;
export type StateTransition = z.infer<typeof StateTransitionSchema>;

// --- Tool 7: generate_component_diagram ---
export const ComponentEntitySchema = z.object({
  id: z.string().min(1, "Component ID cannot be empty").describe("Unique identifier for component"),
  name: z.string().min(1, "Component name cannot be empty").describe("Component name"),
  stereotype: z.string().optional().describe("e.g. 'subsystem', 'service', 'module'")
});

export const ComponentInterfaceSchema = z.object({
  id: z.string().min(1, "Interface ID cannot be empty").describe("Unique identifier for interface"),
  name: z.string().min(1, "Interface name cannot be empty").describe("Provided or required interface name")
});

export const ComponentRelationshipSchema = z.object({
  id: z.string().min(1, "Relationship ID cannot be empty").describe("Unique identifier"),
  type: z.enum(["dependency", "realization", "association"]).describe("Relationship type"),
  sourceId: z.string().min(1, "Source ID cannot be empty").describe("Source component or interface ID"),
  targetId: z.string().min(1, "Target ID cannot be empty").describe("Target component or interface ID"),
  name: z.string().optional().describe("Optional relationship name")
});

export const GenerateComponentDiagramSchema = z.object({
  filePath: MdjFilePathSchema.describe("Destination path ending in .mdj (e.g., './output/components.mdj')"),
  projectName: z.string().optional().describe("Optional StarUML project name"),
  diagramName: z.string().min(1, "Diagram name cannot be empty").describe("Name of the component diagram"),
  components: z.array(ComponentEntitySchema).describe("List of components"),
  interfaces: z.array(ComponentInterfaceSchema).optional().describe("Optional interfaces"),
  relationships: z.array(ComponentRelationshipSchema).describe("Relationships connecting components and interfaces")
});

export type GenerateComponentDiagramInput = z.infer<typeof GenerateComponentDiagramSchema>;
export type ComponentEntity = z.infer<typeof ComponentEntitySchema>;
export type ComponentInterface = z.infer<typeof ComponentInterfaceSchema>;
export type ComponentRelationship = z.infer<typeof ComponentRelationshipSchema>;

// --- Tool 8: generate_deployment_diagram ---
export const DeploymentNodeSchema = z.object({
  id: z.string().min(1, "Node ID cannot be empty").describe("Unique identifier for node"),
  name: z.string().min(1, "Node name cannot be empty").describe("Node or physical device/server name"),
  stereotype: z.string().optional().describe("e.g. 'device', 'executionEnvironment', 'server', 'database'")
});

export const DeploymentArtifactSchema = z.object({
  id: z.string().min(1, "Artifact ID cannot be empty").describe("Unique identifier for artifact"),
  name: z.string().min(1, "Artifact name cannot be empty").describe("Artifact file or package name (e.g., 'app.jar', 'docker-image')"),
  nodeId: z.string().optional().describe("Optional parent node ID where artifact is deployed")
});

export const DeploymentConnectionSchema = z.object({
  id: z.string().min(1, "Connection ID cannot be empty").describe("Unique identifier"),
  sourceId: z.string().min(1, "Source node ID cannot be empty").describe("Source node ID"),
  targetId: z.string().min(1, "Target node ID cannot be empty").describe("Target node ID"),
  name: z.string().optional().describe("Protocol or connection label, e.g. 'HTTPS/REST', 'TCP/IP', 'gRPC'")
});

export const GenerateDeploymentDiagramSchema = z.object({
  filePath: MdjFilePathSchema.describe("Destination path ending in .mdj (e.g., './output/deployment.mdj')"),
  projectName: z.string().optional().describe("Optional StarUML project name"),
  diagramName: z.string().min(1, "Diagram name cannot be empty").describe("Name of the deployment diagram"),
  nodes: z.array(DeploymentNodeSchema).describe("List of deployment nodes"),
  artifacts: z.array(DeploymentArtifactSchema).optional().describe("Artifacts deployed on nodes"),
  connections: z.array(DeploymentConnectionSchema).describe("Communication paths connecting the nodes")
});

export type GenerateDeploymentDiagramInput = z.infer<typeof GenerateDeploymentDiagramSchema>;
export type DeploymentNode = z.infer<typeof DeploymentNodeSchema>;
export type DeploymentArtifact = z.infer<typeof DeploymentArtifactSchema>;
export type DeploymentConnection = z.infer<typeof DeploymentConnectionSchema>;

// --- Tool 9: generate_object_diagram ---
export const ObjectSlotSchema = z.object({
  name: z.string().min(1, "Slot name cannot be empty").describe("Attribute name"),
  value: z.string().describe("Slot / attribute value, e.g. '123', '\"activo\"'")
});

export const ObjectEntitySchema = z.object({
  id: z.string().min(1, "Object ID cannot be empty").describe("Unique identifier for object instance"),
  name: z.string().min(1, "Object name cannot be empty").describe("Instance name, e.g. 'usuario1', ':Factura', 'p:Producto'"),
  className: z.string().optional().describe("Optional classifier class name"),
  slots: z.array(ObjectSlotSchema).optional().describe("List of attribute values / slots")
});

export const ObjectLinkSchema = z.object({
  id: z.string().min(1, "Link ID cannot be empty").describe("Unique identifier for link"),
  sourceId: z.string().min(1, "Source object ID cannot be empty").describe("Source object ID"),
  targetId: z.string().min(1, "Target object ID cannot be empty").describe("Target object ID"),
  name: z.string().optional().describe("Optional association or link name")
});

export const GenerateObjectDiagramSchema = z.object({
  filePath: MdjFilePathSchema.describe("Destination path ending in .mdj (e.g., './output/objects.mdj')"),
  projectName: z.string().optional().describe("Optional StarUML project name"),
  diagramName: z.string().min(1, "Diagram name cannot be empty").describe("Name of the object diagram"),
  objects: z.array(ObjectEntitySchema).describe("List of object instances"),
  links: z.array(ObjectLinkSchema).describe("Links connecting the objects")
});

export type GenerateObjectDiagramInput = z.infer<typeof GenerateObjectDiagramSchema>;
export type ObjectEntity = z.infer<typeof ObjectEntitySchema>;
export type ObjectLink = z.infer<typeof ObjectLinkSchema>;

// --- Tool 10: generate_communication_diagram ---
export const CommLifelineSchema = z.object({
  id: z.string().min(1, "Lifeline ID cannot be empty").describe("Unique identifier"),
  name: z.string().min(1, "Lifeline name cannot be empty").describe("Role or participant name, e.g. 'controlador:PedidoController'"),
  representClass: z.string().optional().describe("Optional represented class name")
});

export const CommMessageSchema = z.object({
  id: z.string().min(1, "Message ID cannot be empty").describe("Unique identifier"),
  sourceId: z.string().min(1, "Source lifeline ID cannot be empty").describe("Sender lifeline ID"),
  targetId: z.string().min(1, "Target lifeline ID cannot be empty").describe("Receiver lifeline ID"),
  sequenceNumber: z.string().min(1, "Sequence number cannot be empty").describe("Hierarchical message sequence number, e.g. '1', '1.1', '2'"),
  name: z.string().min(1, "Message name cannot be empty").describe("Invocation or message signature, e.g. 'calcularTotal()'")
});

export const GenerateCommunicationDiagramSchema = z.object({
  filePath: MdjFilePathSchema.describe("Destination path ending in .mdj (e.g., './output/communication.mdj')"),
  projectName: z.string().optional().describe("Optional StarUML project name"),
  diagramName: z.string().min(1, "Diagram name cannot be empty").describe("Name of the communication diagram"),
  lifelines: z.array(CommLifelineSchema).describe("Participants in the collaboration"),
  messages: z.array(CommMessageSchema).describe("Sequenced messages exchanged between participants")
});

export type GenerateCommunicationDiagramInput = z.infer<typeof GenerateCommunicationDiagramSchema>;
export type CommLifeline = z.infer<typeof CommLifelineSchema>;
export type CommMessage = z.infer<typeof CommMessageSchema>;

// --- StarUML Generic Metamodel Node Types ---
export interface StarUMLRef {
  $ref: string;
}

export interface StarUMLNode {
  _type: string;
  _id: string;
  _parent?: StarUMLRef;
  name?: string;
  [key: string]: unknown;
}
