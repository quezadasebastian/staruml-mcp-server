import { IdRegistry, generateStarUMLId } from "./id-generator.js";
import { computeGraphLayout } from "../layout/dagre-layout.js";
import { computeSequenceLayout } from "../layout/sequence-layout.js";
import { createProjectNode, createUMLModelNode, createUMLClassNode, createUMLAttributeNode, createUMLOperationNode, createUMLGeneralizationNode, createUMLInterfaceRealizationNode, createUMLDependencyNode, createUMLAssociationNode, createUMLClassDiagramNode, createUMLClassViewNode, createUMLConnectionViewNode, createUMLAssociationViewNode, createUMLActorNode, createUMLUseCaseSubjectNode, createUMLUseCaseNode, createUMLIncludeNode, createUMLExtendNode, createUMLUseCaseDiagramNode, createUMLActorViewNode, createUMLUseCaseViewNode, createUMLUseCaseSubjectViewNode, createUMLIncludeViewNode, createUMLExtendViewNode, createUMLInteractionNode, createUMLLifelineNode, createUMLMessageNode, createUMLSequenceDiagramNode, createUMLSeqLifelineViewNode, createUMLSeqMessageViewNode } from "./mdj-factory.js";
/**
 * Builds a complete, valid StarUML (.mdj) AST for a Class Diagram.
 */
export function buildClassDiagramMdj(input) {
    const registry = new IdRegistry();
    const projectId = generateStarUMLId();
    const modelId = generateStarUMLId();
    const diagramId = generateStarUMLId();
    // Register class model IDs and create class view IDs
    const classViewIdMap = new Map(); // classInputId -> classViewId
    const layoutNodes = [];
    for (const cls of input.classes) {
        const classModelId = registry.resolve(cls.id);
        const classViewId = generateStarUMLId();
        classViewIdMap.set(cls.id, classViewId);
        // Calculate dimensions based on member counts and text lengths
        let maxTextLength = cls.name.length;
        for (const attr of cls.attributes ?? []) {
            const len = attr.name.length + attr.type.length + 5;
            if (len > maxTextLength)
                maxTextLength = len;
        }
        for (const op of cls.operations ?? []) {
            const paramsLen = (op.parameters ?? []).reduce((acc, p) => acc + p.name.length + p.type.length + 4, 0);
            const retLen = op.returnType ? op.returnType.length + 2 : 0;
            const len = op.name.length + paramsLen + retLen + 5;
            if (len > maxTextLength)
                maxTextLength = len;
        }
        const width = Math.max(160, Math.min(480, Math.round(maxTextLength * 8.5 + 40)));
        const hasStereo = !!cls.stereotype;
        const headerHeight = hasStereo ? 42 : 28;
        const attrHeight = Math.max(10, (cls.attributes?.length ?? 0) * 16 + 6);
        const opHeight = Math.max(10, (cls.operations?.length ?? 0) * 16 + 6);
        const height = headerHeight + attrHeight + opHeight + 10;
        layoutNodes.push({
            id: cls.id,
            width,
            height
        });
    }
    // Edges for Dagre layout
    const layoutEdges = input.relationships.map((rel) => ({
        id: rel.id,
        sourceId: rel.sourceId,
        targetId: rel.targetId
    }));
    // Compute Dagre coordinates
    const layoutResult = computeGraphLayout(layoutNodes, layoutEdges, {
        rankdir: "TB",
        nodesep: 60,
        ranksep: 80
    });
    // Build semantic relationship nodes indexed by source class
    const classOwnedRelations = new Map();
    const relationshipModelIdMap = new Map(); // relInputId -> relModelId
    const classAssocEndsMap = new Map();
    for (const rel of input.relationships) {
        const relModelId = registry.resolve(rel.id);
        relationshipModelIdMap.set(rel.id, relModelId);
        const sourceModelId = registry.resolve(rel.sourceId);
        const targetModelId = registry.resolve(rel.targetId);
        let semanticNode;
        switch (rel.type) {
            case "generalization":
                semanticNode = createUMLGeneralizationNode(relModelId, sourceModelId, targetModelId, rel.name);
                break;
            case "realization":
                semanticNode = createUMLInterfaceRealizationNode(relModelId, sourceModelId, targetModelId, rel.name);
                break;
            case "dependency":
                semanticNode = createUMLDependencyNode(relModelId, sourceModelId, targetModelId, rel.name);
                break;
            case "composition":
                semanticNode = createUMLAssociationNode(relModelId, sourceModelId, targetModelId, {
                    name: rel.name,
                    aggregationKind: "composite",
                    sourceMultiplicity: rel.sourceMultiplicity,
                    targetMultiplicity: rel.targetMultiplicity
                });
                classAssocEndsMap.set(rel.id, {
                    end1Id: semanticNode.end1._id,
                    end2Id: semanticNode.end2._id
                });
                break;
            case "aggregation":
                semanticNode = createUMLAssociationNode(relModelId, sourceModelId, targetModelId, {
                    name: rel.name,
                    aggregationKind: "shared",
                    sourceMultiplicity: rel.sourceMultiplicity,
                    targetMultiplicity: rel.targetMultiplicity
                });
                classAssocEndsMap.set(rel.id, {
                    end1Id: semanticNode.end1._id,
                    end2Id: semanticNode.end2._id
                });
                break;
            case "association":
            default:
                semanticNode = createUMLAssociationNode(relModelId, sourceModelId, targetModelId, {
                    name: rel.name,
                    aggregationKind: "none",
                    sourceMultiplicity: rel.sourceMultiplicity,
                    targetMultiplicity: rel.targetMultiplicity
                });
                classAssocEndsMap.set(rel.id, {
                    end1Id: semanticNode.end1._id,
                    end2Id: semanticNode.end2._id
                });
                break;
        }
        const existing = classOwnedRelations.get(rel.sourceId) ?? [];
        existing.push(semanticNode);
        classOwnedRelations.set(rel.sourceId, existing);
    }
    // Build semantic class nodes
    const semanticClasses = [];
    const classViews = [];
    for (const cls of input.classes) {
        const classModelId = registry.resolve(cls.id);
        const classViewId = classViewIdMap.get(cls.id);
        const pos = layoutResult.nodes.get(cls.id) ?? {
            left: 100,
            top: 100,
            width: 160,
            height: 90,
            centerX: 180,
            centerY: 145,
            id: cls.id
        };
        // Attribute semantic nodes & view definitions
        const attrNodes = [];
        const attrViewDefs = [];
        for (const attr of cls.attributes ?? []) {
            const attrId = generateStarUMLId();
            attrNodes.push(createUMLAttributeNode(attrId, classModelId, attr.name, attr.type, attr.visibility));
            attrViewDefs.push({
                id: attrId,
                name: attr.name,
                type: attr.type,
                visibility: attr.visibility
            });
        }
        // Operation semantic nodes & view definitions
        const opNodes = [];
        const opViewDefs = [];
        for (const op of cls.operations ?? []) {
            const opId = generateStarUMLId();
            opNodes.push(createUMLOperationNode(opId, classModelId, op.name, op.returnType, op.visibility, op.parameters));
            opViewDefs.push({
                id: opId,
                name: op.name,
                returnType: op.returnType,
                visibility: op.visibility,
                parameters: op.parameters
            });
        }
        const ownedRelNodes = classOwnedRelations.get(cls.id) ?? [];
        const isAbstract = cls.stereotype?.toLowerCase() === "abstract";
        const classNode = createUMLClassNode(classModelId, modelId, cls.name, {
            stereotype: cls.stereotype,
            isAbstract,
            attributes: attrNodes,
            operations: opNodes,
            ownedElements: ownedRelNodes
        });
        semanticClasses.push(classNode);
        // Class View Node
        const classViewNode = createUMLClassViewNode(classViewId, diagramId, classModelId, cls.name, {
            left: pos.left,
            top: pos.top,
            width: pos.width,
            height: pos.height
        }, {
            stereotype: cls.stereotype,
            attributes: attrViewDefs,
            operations: opViewDefs
        });
        classViews.push(classViewNode);
    }
    // Build relationship View nodes
    const relationshipViews = [];
    for (const rel of input.relationships) {
        const relModelId = relationshipModelIdMap.get(rel.id);
        const relViewId = generateStarUMLId();
        const sourceViewId = classViewIdMap.get(rel.sourceId);
        const targetViewId = classViewIdMap.get(rel.targetId);
        if (!sourceViewId || !targetViewId)
            continue;
        const edgePos = layoutResult.edges.get(rel.id);
        const pointsString = edgePos?.pointsString ?? "100:100;200:200";
        if (rel.type === "composition" || rel.type === "aggregation" || rel.type === "association") {
            const ends = classAssocEndsMap.get(rel.id) ?? { end1Id: generateStarUMLId(), end2Id: generateStarUMLId() };
            const edgeViewNode = createUMLAssociationViewNode(relViewId, diagramId, relModelId, sourceViewId, targetViewId, pointsString, ends.end1Id, ends.end2Id, {
                name: rel.name,
                sourceMultiplicity: rel.sourceMultiplicity,
                targetMultiplicity: rel.targetMultiplicity
            });
            relationshipViews.push(edgeViewNode);
        }
        else {
            let viewType;
            switch (rel.type) {
                case "generalization":
                    viewType = "UMLGeneralizationView";
                    break;
                case "realization":
                    viewType = "UMLInterfaceRealizationView";
                    break;
                case "dependency":
                default:
                    viewType = "UMLDependencyView";
                    break;
            }
            const edgeViewNode = createUMLConnectionViewNode(viewType, relViewId, diagramId, relModelId, sourceViewId, targetViewId, pointsString, {
                name: rel.name
            });
            relationshipViews.push(edgeViewNode);
        }
    }
    // Diagram Node containing all Views
    const diagramNode = createUMLClassDiagramNode(diagramId, modelId, input.diagramName, [
        ...classViews,
        ...relationshipViews
    ]);
    // Model Node containing Diagram and Classes
    const modelNode = createUMLModelNode(modelId, projectId, input.projectName ?? "Model", [
        diagramNode,
        ...semanticClasses
    ]);
    return createProjectNode(projectId, input.projectName ?? "Model", [modelNode]);
}
/**
 * Builds a complete, valid StarUML (.mdj) AST for a Use Case Diagram.
 */
export function buildUseCaseDiagramMdj(input) {
    const registry = new IdRegistry();
    const projectId = generateStarUMLId();
    const modelId = generateStarUMLId();
    const diagramId = generateStarUMLId();
    const viewIdMap = new Map(); // inputId -> viewId
    const layoutNodes = [];
    // Register actors
    for (const actor of input.actors) {
        registry.resolve(actor.id);
        const viewId = generateStarUMLId();
        viewIdMap.set(actor.id, viewId);
        layoutNodes.push({
            id: actor.id,
            width: 80,
            height: 90
        });
    }
    // Register use cases
    for (const uc of input.useCases) {
        registry.resolve(uc.id);
        const viewId = generateStarUMLId();
        viewIdMap.set(uc.id, viewId);
        const width = Math.max(130, Math.min(300, Math.round(uc.name.length * 8 + 30)));
        layoutNodes.push({
            id: uc.id,
            width,
            height: 48
        });
    }
    // Relationships layout edges
    const layoutEdges = input.relationships.map((rel) => ({
        id: rel.id,
        sourceId: rel.sourceId,
        targetId: rel.targetId
    }));
    // Dagre layout with Left-to-Right orientation for use case diagrams
    const layoutResult = computeGraphLayout(layoutNodes, layoutEdges, {
        rankdir: "LR",
        nodesep: 50,
        ranksep: 110
    });
    // Calculate System Boundaries
    const boundaryMap = new Map();
    for (const uc of input.useCases) {
        if (uc.systemBoundary) {
            const pos = layoutResult.nodes.get(uc.id);
            if (pos) {
                const list = boundaryMap.get(uc.systemBoundary) ?? [];
                list.push(pos);
                boundaryMap.set(uc.systemBoundary, list);
            }
        }
    }
    const semanticSubjects = [];
    const boundaryViews = [];
    for (const [boundaryName, items] of boundaryMap.entries()) {
        if (items.length === 0)
            continue;
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;
        for (const item of items) {
            if (item.left < minX)
                minX = item.left;
            if (item.top < minY)
                minY = item.top;
            if (item.left + item.width > maxX)
                maxX = item.left + item.width;
            if (item.top + item.height > maxY)
                maxY = item.top + item.height;
        }
        const paddingX = 40;
        const paddingY = 40;
        const bLeft = Math.max(10, minX - paddingX);
        const bTop = Math.max(10, minY - paddingY);
        const bWidth = maxX - minX + paddingX * 2;
        const bHeight = maxY - minY + paddingY * 2;
        const bModelId = generateStarUMLId();
        semanticSubjects.push(createUMLUseCaseSubjectNode(bModelId, modelId, boundaryName));
        const bViewId = generateStarUMLId();
        boundaryViews.push(createUMLUseCaseSubjectViewNode(bViewId, diagramId, bModelId, boundaryName, {
            left: bLeft,
            top: bTop,
            width: bWidth,
            height: bHeight
        }));
    }
    // Build semantic relationships owned by source elements
    const ownedRelations = new Map();
    const relModelIdMap = new Map();
    const ucAssocEndsMap = new Map();
    for (const rel of input.relationships) {
        const relModelId = registry.resolve(rel.id);
        relModelIdMap.set(rel.id, relModelId);
        const sourceModelId = registry.resolve(rel.sourceId);
        const targetModelId = registry.resolve(rel.targetId);
        let semanticNode;
        switch (rel.type) {
            case "include":
                semanticNode = createUMLIncludeNode(relModelId, sourceModelId, targetModelId);
                break;
            case "extend":
                semanticNode = createUMLExtendNode(relModelId, sourceModelId, targetModelId);
                break;
            case "generalization":
                semanticNode = createUMLGeneralizationNode(relModelId, sourceModelId, targetModelId);
                break;
            case "association":
            default:
                semanticNode = createUMLAssociationNode(relModelId, sourceModelId, targetModelId);
                ucAssocEndsMap.set(rel.id, {
                    end1Id: semanticNode.end1._id,
                    end2Id: semanticNode.end2._id
                });
                break;
        }
        const existing = ownedRelations.get(rel.sourceId) ?? [];
        existing.push(semanticNode);
        ownedRelations.set(rel.sourceId, existing);
    }
    // Semantic Actor nodes and View nodes
    const semanticActors = [];
    const actorViews = [];
    for (const actor of input.actors) {
        const actorModelId = registry.resolve(actor.id);
        const actorViewId = viewIdMap.get(actor.id);
        const pos = layoutResult.nodes.get(actor.id) ?? {
            left: 60,
            top: 60,
            width: 80,
            height: 90,
            centerX: 100,
            centerY: 105,
            id: actor.id
        };
        const actorNode = createUMLActorNode(actorModelId, modelId, actor.name);
        // Attach associations originating from actor
        const rels = ownedRelations.get(actor.id);
        if (rels) {
            actorNode.ownedElements = rels;
        }
        semanticActors.push(actorNode);
        actorViews.push(createUMLActorViewNode(actorViewId, diagramId, actorModelId, actor.name, {
            left: pos.left,
            top: pos.top,
            width: pos.width,
            height: pos.height
        }));
    }
    // Semantic Use Case nodes and View nodes
    const semanticUseCases = [];
    const useCaseViews = [];
    for (const uc of input.useCases) {
        const ucModelId = registry.resolve(uc.id);
        const ucViewId = viewIdMap.get(uc.id);
        const pos = layoutResult.nodes.get(uc.id) ?? {
            left: 250,
            top: 60,
            width: 140,
            height: 48,
            centerX: 320,
            centerY: 84,
            id: uc.id
        };
        const rels = ownedRelations.get(uc.id) ?? [];
        semanticUseCases.push(createUMLUseCaseNode(ucModelId, modelId, uc.name, rels));
        useCaseViews.push(createUMLUseCaseViewNode(ucViewId, diagramId, ucModelId, uc.name, {
            left: pos.left,
            top: pos.top,
            width: pos.width,
            height: pos.height
        }));
    }
    // Relationship Views
    const relationshipViews = [];
    for (const rel of input.relationships) {
        const relModelId = relModelIdMap.get(rel.id);
        const relViewId = generateStarUMLId();
        const sourceViewId = viewIdMap.get(rel.sourceId);
        const targetViewId = viewIdMap.get(rel.targetId);
        if (!sourceViewId || !targetViewId)
            continue;
        const edgePos = layoutResult.edges.get(rel.id);
        const pointsString = edgePos?.pointsString ?? "100:100;200:200";
        switch (rel.type) {
            case "include":
                relationshipViews.push(createUMLIncludeViewNode(relViewId, diagramId, relModelId, sourceViewId, targetViewId, pointsString));
                break;
            case "extend":
                relationshipViews.push(createUMLExtendViewNode(relViewId, diagramId, relModelId, sourceViewId, targetViewId, pointsString));
                break;
            case "generalization":
                relationshipViews.push(createUMLConnectionViewNode("UMLGeneralizationView", relViewId, diagramId, relModelId, sourceViewId, targetViewId, pointsString));
                break;
            case "association":
            default:
                {
                    const ends = ucAssocEndsMap.get(rel.id) ?? { end1Id: generateStarUMLId(), end2Id: generateStarUMLId() };
                    relationshipViews.push(createUMLAssociationViewNode(relViewId, diagramId, relModelId, sourceViewId, targetViewId, pointsString, ends.end1Id, ends.end2Id));
                }
                break;
        }
    }
    // Diagram Node (boundaries first so they render under use cases)
    const diagramNode = createUMLUseCaseDiagramNode(diagramId, modelId, input.diagramName, [
        ...boundaryViews,
        ...actorViews,
        ...useCaseViews,
        ...relationshipViews
    ]);
    const modelNode = createUMLModelNode(modelId, projectId, input.projectName ?? "Model", [
        diagramNode,
        ...semanticSubjects,
        ...semanticActors,
        ...semanticUseCases
    ]);
    return createProjectNode(projectId, input.projectName ?? "Model", [modelNode]);
}
/**
 * Builds a complete, valid StarUML (.mdj) AST for a Sequence Diagram.
 */
export function buildSequenceDiagramMdj(input) {
    const registry = new IdRegistry();
    const projectId = generateStarUMLId();
    const modelId = generateStarUMLId();
    const interactionId = generateStarUMLId();
    const diagramId = generateStarUMLId();
    // Layout lifelines and messages chronologically
    const layoutResult = computeSequenceLayout(input.lifelines, input.messages);
    const lifelineViewMap = new Map();
    // Semantic lifelines & View nodes
    const semanticLifelines = [];
    const lifelineViews = [];
    for (const ll of input.lifelines) {
        const lifelineModelId = registry.resolve(ll.id);
        const lifelineViewId = generateStarUMLId();
        const linePartId = generateStarUMLId();
        lifelineViewMap.set(ll.id, { viewId: lifelineViewId, linePartId });
        semanticLifelines.push(createUMLLifelineNode(lifelineModelId, interactionId, ll.name, ll.representClass));
        const pos = layoutResult.lifelines.get(ll.id) ?? {
            left: 100,
            top: 40,
            width: 120,
            height: 400,
            centerX: 160,
            name: ll.name,
            id: ll.id
        };
        lifelineViews.push(createUMLSeqLifelineViewNode(lifelineViewId, diagramId, lifelineModelId, ll.name, {
            left: pos.left,
            top: pos.top,
            width: pos.width,
            height: pos.height
        }, linePartId));
    }
    // Semantic messages & View nodes
    const semanticMessages = [];
    const messageViews = [];
    for (const msgLayout of layoutResult.messages) {
        const msgModelId = registry.resolve(msgLayout.id);
        const msgViewId = generateStarUMLId();
        const sourceModelId = registry.resolve(msgLayout.sourceLifelineId);
        const targetModelId = registry.resolve(msgLayout.targetLifelineId);
        const sourceRefs = lifelineViewMap.get(msgLayout.sourceLifelineId);
        const targetRefs = lifelineViewMap.get(msgLayout.targetLifelineId);
        semanticMessages.push(createUMLMessageNode(msgModelId, interactionId, msgLayout.name, sourceModelId, targetModelId, msgLayout.messageSort));
        if (sourceRefs && targetRefs) {
            messageViews.push(createUMLSeqMessageViewNode(msgViewId, diagramId, msgModelId, msgLayout.name, sourceRefs.linePartId, targetRefs.linePartId, msgLayout.pointsString, msgLayout.messageSort, {
                left: msgLayout.labelLeft,
                top: msgLayout.labelTop,
                width: msgLayout.labelWidth
            }));
        }
    }
    // Sequence Diagram Node
    const sequenceDiagramNode = createUMLSequenceDiagramNode(diagramId, interactionId, input.diagramName, [
        ...lifelineViews,
        ...messageViews
    ]);
    // Interaction Node (holds participants, messages, and the diagram)
    const interactionNode = createUMLInteractionNode(interactionId, modelId, input.diagramName, semanticLifelines, semanticMessages, [sequenceDiagramNode]);
    const modelNode = createUMLModelNode(modelId, projectId, input.projectName ?? "Model", [interactionNode]);
    return createProjectNode(projectId, input.projectName ?? "Model", [modelNode]);
}
//# sourceMappingURL=mdj-builder.js.map