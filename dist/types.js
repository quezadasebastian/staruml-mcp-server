import { z } from "zod";
// --- Tool 1: generate_class_diagram ---
export const ClassAttributeSchema = z.object({
    name: z.string().describe("Attribute name"),
    type: z.string().describe("Attribute data type"),
    visibility: z.enum(["public", "protected", "private", "package"]).optional().describe("Attribute visibility")
});
export const ClassOperationParameterSchema = z.object({
    name: z.string().describe("Parameter name"),
    type: z.string().describe("Parameter type")
});
export const ClassOperationSchema = z.object({
    name: z.string().describe("Operation / method name"),
    returnType: z.string().optional().describe("Return type (defaults to void if not specified)"),
    visibility: z.enum(["public", "protected", "private", "package"]).optional().describe("Operation visibility"),
    parameters: z.array(ClassOperationParameterSchema).optional().describe("Method parameters")
});
export const ClassEntitySchema = z.object({
    id: z.string().describe("Unique identifier for the class or interface"),
    name: z.string().describe("Class name"),
    stereotype: z.string().optional().describe("e.g., 'interface', 'abstract', 'service'"),
    attributes: z.array(ClassAttributeSchema).optional().describe("List of attributes/properties"),
    operations: z.array(ClassOperationSchema).optional().describe("List of methods/operations")
});
export const ClassRelationshipSchema = z.object({
    id: z.string().describe("Unique identifier for the relationship"),
    type: z.enum(["association", "generalization", "composition", "aggregation", "dependency", "realization"]).describe("Relationship type"),
    sourceId: z.string().describe("Source class/interface ID"),
    targetId: z.string().describe("Target class/interface ID"),
    name: z.string().optional().describe("Optional label or relationship name"),
    sourceMultiplicity: z.string().optional().describe("Source end multiplicity, e.g. '1', '0..*'"),
    targetMultiplicity: z.string().optional().describe("Target end multiplicity, e.g. '1..*', '*'")
});
export const GenerateClassDiagramSchema = z.object({
    filePath: z.string().describe("Destination path (e.g., './output/architecture.mdj')"),
    projectName: z.string().optional().describe("Optional StarUML project name"),
    diagramName: z.string().describe("Name of the class diagram"),
    classes: z.array(ClassEntitySchema).describe("Classes and interfaces in the diagram"),
    relationships: z.array(ClassRelationshipSchema).describe("Relationships connecting the classes")
});
// --- Tool 2: generate_use_case_diagram ---
export const ActorEntitySchema = z.object({
    id: z.string().describe("Unique identifier for the actor"),
    name: z.string().describe("Actor name")
});
export const UseCaseEntitySchema = z.object({
    id: z.string().describe("Unique identifier for the use case"),
    name: z.string().describe("Use case name"),
    systemBoundary: z.string().optional().describe("Optional system boundary container name")
});
export const UseCaseRelationshipSchema = z.object({
    id: z.string().describe("Unique identifier for the relationship"),
    type: z.enum(["association", "include", "extend", "generalization"]).describe("Relationship type"),
    sourceId: z.string().describe("Source actor or use case ID"),
    targetId: z.string().describe("Target actor or use case ID")
});
export const GenerateUseCaseDiagramSchema = z.object({
    filePath: z.string().describe("Destination path (e.g., './output/use_cases.mdj')"),
    projectName: z.string().optional().describe("Optional StarUML project name"),
    diagramName: z.string().describe("Name of the use case diagram"),
    actors: z.array(ActorEntitySchema).describe("List of actors"),
    useCases: z.array(UseCaseEntitySchema).describe("List of use cases"),
    relationships: z.array(UseCaseRelationshipSchema).describe("Relationships between actors and use cases")
});
// --- Tool 3: generate_sequence_diagram ---
export const LifelineEntitySchema = z.object({
    id: z.string().describe("Unique identifier for the lifeline"),
    name: z.string().describe("Lifeline participant name"),
    representClass: z.string().optional().describe("Optional class or type name represented by lifeline")
});
export const SequenceMessageSchema = z.object({
    id: z.string().describe("Unique identifier for the message"),
    name: z.string().describe("Message or invocation name"),
    sourceLifelineId: z.string().describe("Source lifeline ID"),
    targetLifelineId: z.string().describe("Target lifeline ID"),
    messageSort: z.enum(["synchCall", "asynchCall", "reply"]).describe("Message sort / call type")
});
export const GenerateSequenceDiagramSchema = z.object({
    filePath: z.string().describe("Destination path (e.g., './output/interaction.mdj')"),
    projectName: z.string().optional().describe("Optional StarUML project name"),
    diagramName: z.string().describe("Name of the sequence diagram"),
    lifelines: z.array(LifelineEntitySchema).describe("List of lifelines / participants"),
    messages: z.array(SequenceMessageSchema).describe("Ordered chronological sequence messages")
});
// --- Tool 4: inspect_mdj_model ---
export const InspectMdjModelSchema = z.object({
    filePath: z.string().describe("Path to the existing .mdj file to inspect")
});
//# sourceMappingURL=types.js.map