import type { StarUMLNode } from "../types.js";
/**
 * Pure factory functions to construct standard StarUML (.mdj) nodes,
 * strictly adhering to StarUML's metamodel and schema.
 */
export declare function createProjectNode(id: string, name: string, ownedElements?: StarUMLNode[]): StarUMLNode;
export declare function createUMLModelNode(id: string, parentId: string, name: string, ownedElements?: StarUMLNode[]): StarUMLNode;
export declare function createUMLParameterNode(id: string, parentId: string, name: string, type: string, direction?: "return" | "in" | "out" | "inout"): StarUMLNode;
export declare function createUMLOperationNode(id: string, parentId: string, name: string, returnType?: string, visibility?: "public" | "protected" | "private" | "package", parameters?: Array<{
    name: string;
    type: string;
}>): StarUMLNode;
export declare function createUMLAttributeNode(id: string, parentId: string, name: string, type: string, visibility?: "public" | "protected" | "private" | "package"): StarUMLNode;
export declare function createUMLClassNode(id: string, parentId: string, name: string, options?: {
    stereotype?: string;
    isAbstract?: boolean;
    attributes?: StarUMLNode[];
    operations?: StarUMLNode[];
    ownedElements?: StarUMLNode[];
}): StarUMLNode;
export declare function createUMLGeneralizationNode(id: string, sourceId: string, targetId: string, name?: string): StarUMLNode;
export declare function createUMLInterfaceRealizationNode(id: string, sourceId: string, targetId: string, name?: string): StarUMLNode;
export declare function createUMLDependencyNode(id: string, sourceId: string, targetId: string, name?: string): StarUMLNode;
export declare function createUMLAssociationNode(id: string, sourceId: string, targetId: string, options?: {
    name?: string;
    aggregationKind?: "none" | "shared" | "composite";
    sourceMultiplicity?: string;
    targetMultiplicity?: string;
    navigable?: "unspecified" | "navigable" | "notNavigable";
}): StarUMLNode;
export declare function createUMLActorNode(id: string, parentId: string, name: string): StarUMLNode;
export declare function createUMLUseCaseSubjectNode(id: string, parentId: string, name: string): StarUMLNode;
export declare function createUMLUseCaseNode(id: string, parentId: string, name: string, ownedElements?: StarUMLNode[]): StarUMLNode;
export declare function createUMLIncludeNode(id: string, sourceUseCaseId: string, targetUseCaseId: string): StarUMLNode;
export declare function createUMLExtendNode(id: string, sourceUseCaseId: string, targetUseCaseId: string): StarUMLNode;
export declare function createUMLLifelineNode(id: string, parentId: string, name: string, representClassId?: string): StarUMLNode;
export declare function createUMLMessageNode(id: string, parentId: string, name: string, sourceLifelineId: string, targetLifelineId: string, messageSort?: "synchCall" | "asynchCall" | "reply"): StarUMLNode;
export declare function createUMLInteractionNode(id: string, parentId: string, name: string, lifelines?: StarUMLNode[], messages?: StarUMLNode[], ownedElements?: StarUMLNode[]): StarUMLNode;
export declare function createUMLClassDiagramNode(id: string, parentId: string, name: string, ownedViews?: StarUMLNode[]): StarUMLNode;
export declare function createUMLUseCaseDiagramNode(id: string, parentId: string, name: string, ownedViews?: StarUMLNode[]): StarUMLNode;
export declare function createUMLSequenceDiagramNode(id: string, parentId: string, name: string, ownedViews?: StarUMLNode[]): StarUMLNode;
export declare function createUMLClassViewNode(viewId: string, diagramId: string, modelId: string, className: string, bounds: {
    left: number;
    top: number;
    width: number;
    height: number;
}, options?: {
    stereotype?: string;
    attributes?: Array<{
        id: string;
        name: string;
        type: string;
        visibility?: string;
    }>;
    operations?: Array<{
        id: string;
        name: string;
        returnType?: string;
        visibility?: string;
        parameters?: Array<{
            name: string;
            type: string;
        }>;
    }>;
}): StarUMLNode;
export declare function createUMLConnectionViewNode(viewType: "UMLGeneralizationView" | "UMLInterfaceRealizationView" | "UMLDependencyView", viewId: string, diagramId: string, modelId: string, tailViewId: string, headViewId: string, pointsString: string, options?: {
    name?: string;
}): StarUMLNode;
export declare function createUMLAssociationViewNode(viewId: string, diagramId: string, modelId: string, tailViewId: string, headViewId: string, pointsString: string, end1Id: string, end2Id: string, options?: {
    name?: string;
    sourceMultiplicity?: string;
    targetMultiplicity?: string;
}): StarUMLNode;
export declare function createUMLActorViewNode(viewId: string, diagramId: string, modelId: string, actorName: string, bounds: {
    left: number;
    top: number;
    width: number;
    height: number;
}): StarUMLNode;
export declare function createUMLUseCaseViewNode(viewId: string, diagramId: string, modelId: string, useCaseName: string, bounds: {
    left: number;
    top: number;
    width: number;
    height: number;
}): StarUMLNode;
export declare function createUMLUseCaseSubjectViewNode(viewId: string, diagramId: string, modelId: string, subjectName: string, bounds: {
    left: number;
    top: number;
    width: number;
    height: number;
}): StarUMLNode;
export declare function createUMLIncludeViewNode(viewId: string, diagramId: string, modelId: string, tailViewId: string, headViewId: string, pointsString: string): StarUMLNode;
export declare function createUMLExtendViewNode(viewId: string, diagramId: string, modelId: string, tailViewId: string, headViewId: string, pointsString: string): StarUMLNode;
export declare function createUMLSeqLifelineViewNode(viewId: string, diagramId: string, modelId: string, lifelineName: string, bounds: {
    left: number;
    top: number;
    width: number;
    height: number;
}, linePartId: string): StarUMLNode;
export declare function createUMLSeqMessageViewNode(viewId: string, diagramId: string, modelId: string, messageName: string, tailLinePartId: string, headLinePartId: string, pointsString: string, messageSort: "synchCall" | "asynchCall" | "reply", labelBounds: {
    left: number;
    top: number;
    width: number;
}): StarUMLNode;
