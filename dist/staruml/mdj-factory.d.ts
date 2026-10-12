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
export declare function createUMLActivityNode(id: string, parentId: string, name: string, nodes?: StarUMLNode[], edges?: StarUMLNode[], ownedElements?: StarUMLNode[]): StarUMLNode;
export declare function createUMLActionNode(id: string, parentId: string, name: string): StarUMLNode;
export declare function createUMLControlNode(nodeType: "UMLInitialNode" | "UMLActivityFinalNode" | "UMLFlowFinalNode" | "UMLDecisionNode" | "UMLMergeNode" | "UMLForkNode" | "UMLJoinNode", id: string, parentId: string, name: string): StarUMLNode;
export declare function createUMLControlFlowNode(id: string, parentId: string, sourceId: string, targetId: string, name?: string, guard?: string): StarUMLNode;
export declare function createUMLActivityDiagramNode(id: string, parentId: string, name: string, ownedViews?: StarUMLNode[]): StarUMLNode;
export declare function createUMLActionViewNode(viewId: string, diagramId: string, modelId: string, actionName: string, bounds: {
    left: number;
    top: number;
    width: number;
    height: number;
}): StarUMLNode;
export declare function createUMLControlNodeViewNode(viewId: string, diagramId: string, modelId: string, bounds: {
    left: number;
    top: number;
    width: number;
    height: number;
}): StarUMLNode;
export declare function createUMLGenericEdgeViewNode(viewType: string, viewId: string, diagramId: string, modelId: string, tailViewId: string, headViewId: string, pointsString: string, options?: {
    name?: string;
    label?: string;
}): StarUMLNode;
export declare function createUMLStateMachineNode(id: string, parentId: string, name: string, regions?: StarUMLNode[], ownedElements?: StarUMLNode[]): StarUMLNode;
export declare function createUMLRegionNode(id: string, parentId: string, name: string, vertices?: StarUMLNode[], transitions?: StarUMLNode[]): StarUMLNode;
export declare function createUMLStateNode(id: string, parentId: string, name: string, entry?: string, exit?: string, doActivity?: string): StarUMLNode;
export declare function createUMLPseudostateNode(id: string, parentId: string, kind?: "initial" | "choice" | "junction", name?: string): StarUMLNode;
export declare function createUMLFinalStateNode(id: string, parentId: string, name?: string): StarUMLNode;
export declare function createUMLTransitionNode(id: string, parentId: string, sourceId: string, targetId: string, name?: string, guard?: string, trigger?: string, effect?: string): StarUMLNode;
export declare function createUMLStatechartDiagramNode(id: string, parentId: string, name: string, ownedViews?: StarUMLNode[]): StarUMLNode;
export declare function createUMLStateViewNode(viewId: string, diagramId: string, modelId: string, stateName: string, bounds: {
    left: number;
    top: number;
    width: number;
    height: number;
}): StarUMLNode;
export declare function createUMLPseudostateViewNode(viewId: string, diagramId: string, modelId: string, bounds: {
    left: number;
    top: number;
    width: number;
    height: number;
}): StarUMLNode;
export declare function createUMLFinalStateViewNode(viewId: string, diagramId: string, modelId: string, bounds: {
    left: number;
    top: number;
    width: number;
    height: number;
}): StarUMLNode;
export declare function createUMLComponentNode(id: string, parentId: string, name: string, stereotype?: string): StarUMLNode;
export declare function createUMLComponentDiagramNode(id: string, parentId: string, name: string, ownedViews?: StarUMLNode[]): StarUMLNode;
export declare function createUMLComponentViewNode(viewId: string, diagramId: string, modelId: string, componentName: string, bounds: {
    left: number;
    top: number;
    width: number;
    height: number;
}, stereotype?: string): StarUMLNode;
export declare function createUMLDeploymentNode(id: string, parentId: string, name: string, stereotype?: string): StarUMLNode;
export declare function createUMLArtifactNode(id: string, parentId: string, name: string): StarUMLNode;
export declare function createUMLCommunicationPathNode(id: string, parentId: string, sourceId: string, targetId: string, name?: string): StarUMLNode;
export declare function createUMLDeploymentDiagramNode(id: string, parentId: string, name: string, ownedViews?: StarUMLNode[]): StarUMLNode;
export declare function createUMLDeploymentNodeViewNode(viewId: string, diagramId: string, modelId: string, nodeName: string, bounds: {
    left: number;
    top: number;
    width: number;
    height: number;
}, stereotype?: string): StarUMLNode;
export declare function createUMLArtifactViewNode(viewId: string, diagramId: string, modelId: string, artifactName: string, bounds: {
    left: number;
    top: number;
    width: number;
    height: number;
}): StarUMLNode;
export declare function createUMLObjectNode(id: string, parentId: string, name: string, classifierName?: string, slots?: Array<{
    name: string;
    value: string;
}>): StarUMLNode;
export declare function createUMLLinkNode(id: string, parentId: string, sourceId: string, targetId: string, name?: string): StarUMLNode;
export declare function createUMLObjectDiagramNode(id: string, parentId: string, name: string, ownedViews?: StarUMLNode[]): StarUMLNode;
export declare function createUMLObjectViewNode(viewId: string, diagramId: string, modelId: string, objectName: string, bounds: {
    left: number;
    top: number;
    width: number;
    height: number;
}, slots?: Array<{
    name: string;
    value: string;
}>): StarUMLNode;
export declare function createUMLCommunicationDiagramNode(id: string, parentId: string, name: string, ownedViews?: StarUMLNode[]): StarUMLNode;
export declare function createUMLCommLifelineViewNode(viewId: string, diagramId: string, modelId: string, lifelineName: string, bounds: {
    left: number;
    top: number;
    width: number;
    height: number;
}): StarUMLNode;
