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

export type InspectMdjModelInput = z.infer<typeof InspectMdjModelSchema>;

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
