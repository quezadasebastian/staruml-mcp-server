export interface InspectedAttribute {
    name: string;
    type: string;
    visibility?: string;
}
export interface InspectedOperation {
    name: string;
    returnType?: string;
    visibility?: string;
    parameters: Array<{
        name: string;
        type: string;
    }>;
}
export interface InspectedClass {
    id: string;
    name: string;
    type: "UMLClass" | "UMLInterface" | "UMLDataType" | "UMLEnumeration" | string;
    stereotype?: string;
    isAbstract?: boolean;
    attributes: InspectedAttribute[];
    operations: InspectedOperation[];
}
export interface InspectedRelationship {
    id: string;
    type: string;
    name?: string;
    source: string;
    target: string;
    sourceMultiplicity?: string;
    targetMultiplicity?: string;
    aggregation?: string;
}
export interface InspectedDiagram {
    id: string;
    name: string;
    type: string;
    viewsCount: number;
}
export interface InspectedActor {
    id: string;
    name: string;
}
export interface InspectedUseCase {
    id: string;
    name: string;
}
export interface InspectedInteraction {
    id: string;
    name: string;
    lifelines: Array<{
        id: string;
        name: string;
    }>;
    messages: Array<{
        id: string;
        name: string;
        source: string;
        target: string;
        messageSort?: string;
    }>;
}
export interface ModelInspectionResult {
    projectName: string;
    filePath: string;
    diagrams: InspectedDiagram[];
    classes: InspectedClass[];
    actors: InspectedActor[];
    useCases: InspectedUseCase[];
    interactions: InspectedInteraction[];
    relationships: InspectedRelationship[];
    summary: {
        totalDiagrams: number;
        totalClasses: number;
        totalInterfaces: number;
        totalAttributes: number;
        totalOperations: number;
        totalRelationships: number;
        totalActors: number;
        totalUseCases: number;
        totalLifelines: number;
        totalMessages: number;
    };
    overviewMarkdown: string;
}
/**
 * Inspects an existing StarUML (.mdj) file and returns a concise structural overview.
 */
export declare function inspectMdjFile(filePath: string): Promise<ModelInspectionResult>;
