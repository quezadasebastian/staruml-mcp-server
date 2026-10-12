import type {
  GenerateClassDiagramInput,
  GenerateUseCaseDiagramInput,
  GenerateSequenceDiagramInput,
  GenerateActivityDiagramInput,
  GenerateStateMachineDiagramInput,
  GenerateComponentDiagramInput,
  GenerateDeploymentDiagramInput,
  GenerateObjectDiagramInput,
  GenerateCommunicationDiagramInput,
  StarUMLNode
} from "../types.js";
import { IdRegistry, generateStarUMLId } from "./id-generator.js";
import { computeGraphLayout, type LayoutNodeInput, type LayoutEdgeInput } from "../layout/dagre-layout.js";
import { computeSequenceLayout } from "../layout/sequence-layout.js";
import {
  createProjectNode,
  createUMLModelNode,
  createUMLClassNode,
  createUMLAttributeNode,
  createUMLOperationNode,
  createUMLGeneralizationNode,
  createUMLInterfaceRealizationNode,
  createUMLDependencyNode,
  createUMLAssociationNode,
  createUMLClassDiagramNode,
  createUMLClassViewNode,
  createUMLConnectionViewNode,
  createUMLAssociationViewNode,
  createUMLActorNode,
  createUMLUseCaseSubjectNode,
  createUMLUseCaseNode,
  createUMLIncludeNode,
  createUMLExtendNode,
  createUMLUseCaseDiagramNode,
  createUMLActorViewNode,
  createUMLUseCaseViewNode,
  createUMLUseCaseSubjectViewNode,
  createUMLIncludeViewNode,
  createUMLExtendViewNode,
  createUMLInteractionNode,
  createUMLLifelineNode,
  createUMLMessageNode,
  createUMLSequenceDiagramNode,
  createUMLSeqLifelineViewNode,
  createUMLSeqMessageViewNode,
  createUMLActivityNode,
  createUMLActionNode,
  createUMLControlNode,
  createUMLControlFlowNode,
  createUMLActivityDiagramNode,
  createUMLActionViewNode,
  createUMLControlNodeViewNode,
  createUMLGenericEdgeViewNode,
  createUMLStateMachineNode,
  createUMLRegionNode,
  createUMLStateNode,
  createUMLPseudostateNode,
  createUMLFinalStateNode,
  createUMLTransitionNode,
  createUMLStatechartDiagramNode,
  createUMLStateViewNode,
  createUMLPseudostateViewNode,
  createUMLFinalStateViewNode,
  createUMLComponentNode,
  createUMLComponentDiagramNode,
  createUMLComponentViewNode,
  createUMLDeploymentNode,
  createUMLArtifactNode,
  createUMLCommunicationPathNode,
  createUMLDeploymentDiagramNode,
  createUMLDeploymentNodeViewNode,
  createUMLArtifactViewNode,
  createUMLObjectNode,
  createUMLLinkNode,
  createUMLObjectDiagramNode,
  createUMLObjectViewNode,
  createUMLCommunicationDiagramNode,
  createUMLCommLifelineViewNode
} from "./mdj-factory.js";

/**
 * Builds a complete, valid StarUML (.mdj) AST for a Class Diagram.
 */
export function buildClassDiagramMdj(input: GenerateClassDiagramInput): StarUMLNode {
  const registry = new IdRegistry();
  const projectId = generateStarUMLId();
  const modelId = generateStarUMLId();
  const diagramId = generateStarUMLId();

  // Register class model IDs and create class view IDs
  const classViewIdMap = new Map<string, string>(); // classInputId -> classViewId

  const layoutNodes: LayoutNodeInput[] = [];

  for (const cls of input.classes) {
    const classModelId = registry.resolve(cls.id);
    const classViewId = generateStarUMLId();
    classViewIdMap.set(cls.id, classViewId);

    // Calculate dimensions based on member counts and text lengths
    let maxTextLength = cls.name.length;
    for (const attr of cls.attributes ?? []) {
      const len = attr.name.length + attr.type.length + 5;
      if (len > maxTextLength) maxTextLength = len;
    }
    for (const op of cls.operations ?? []) {
      const paramsLen = (op.parameters ?? []).reduce((acc, p) => acc + p.name.length + p.type.length + 4, 0);
      const retLen = op.returnType ? op.returnType.length + 2 : 0;
      const len = op.name.length + paramsLen + retLen + 5;
      if (len > maxTextLength) maxTextLength = len;
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
  const layoutEdges: LayoutEdgeInput[] = input.relationships.map((rel) => ({
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
  const classOwnedRelations = new Map<string, StarUMLNode[]>();
  const relationshipModelIdMap = new Map<string, string>(); // relInputId -> relModelId
  const classAssocEndsMap = new Map<string, { end1Id: string; end2Id: string }>();

  for (const rel of input.relationships) {
    const relModelId = registry.resolve(rel.id);
    relationshipModelIdMap.set(rel.id, relModelId);
    const sourceModelId = registry.resolve(rel.sourceId);
    const targetModelId = registry.resolve(rel.targetId);

    let semanticNode: StarUMLNode;
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
          end1Id: (semanticNode.end1 as StarUMLNode)._id,
          end2Id: (semanticNode.end2 as StarUMLNode)._id
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
          end1Id: (semanticNode.end1 as StarUMLNode)._id,
          end2Id: (semanticNode.end2 as StarUMLNode)._id
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
          end1Id: (semanticNode.end1 as StarUMLNode)._id,
          end2Id: (semanticNode.end2 as StarUMLNode)._id
        });
        break;
    }

    const existing = classOwnedRelations.get(rel.sourceId) ?? [];
    existing.push(semanticNode);
    classOwnedRelations.set(rel.sourceId, existing);
  }

  // Build semantic class nodes
  const semanticClasses: StarUMLNode[] = [];
  const classViews: StarUMLNode[] = [];

  for (const cls of input.classes) {
    const classModelId = registry.resolve(cls.id);
    const classViewId = classViewIdMap.get(cls.id)!;
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
    const attrNodes: StarUMLNode[] = [];
    const attrViewDefs: Array<{ id: string; name: string; type: string; visibility?: string }> = [];

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
    const opNodes: StarUMLNode[] = [];
    const opViewDefs: Array<{ id: string; name: string; returnType?: string; visibility?: string; parameters?: Array<{ name: string; type: string }> }> = [];

    for (const op of cls.operations ?? []) {
      const opId = generateStarUMLId();
      opNodes.push(
        createUMLOperationNode(opId, classModelId, op.name, op.returnType, op.visibility, op.parameters)
      );
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
    const classViewNode = createUMLClassViewNode(
      classViewId,
      diagramId,
      classModelId,
      cls.name,
      {
        left: pos.left,
        top: pos.top,
        width: pos.width,
        height: pos.height
      },
      {
        stereotype: cls.stereotype,
        attributes: attrViewDefs,
        operations: opViewDefs
      }
    );
    classViews.push(classViewNode);
  }

  // Build relationship View nodes
  const relationshipViews: StarUMLNode[] = [];

  for (const rel of input.relationships) {
    const relModelId = relationshipModelIdMap.get(rel.id)!;
    const relViewId = generateStarUMLId();
    const sourceViewId = classViewIdMap.get(rel.sourceId);
    const targetViewId = classViewIdMap.get(rel.targetId);

    if (!sourceViewId || !targetViewId) continue;

    const edgePos = layoutResult.edges.get(rel.id);
    const pointsString = edgePos?.pointsString ?? "100:100;200:200";

    if (rel.type === "composition" || rel.type === "aggregation" || rel.type === "association") {
      const ends = classAssocEndsMap.get(rel.id) ?? { end1Id: generateStarUMLId(), end2Id: generateStarUMLId() };
      const edgeViewNode = createUMLAssociationViewNode(
        relViewId,
        diagramId,
        relModelId,
        sourceViewId,
        targetViewId,
        pointsString,
        ends.end1Id,
        ends.end2Id,
        {
          name: rel.name,
          sourceMultiplicity: rel.sourceMultiplicity,
          targetMultiplicity: rel.targetMultiplicity
        }
      );
      relationshipViews.push(edgeViewNode);
    } else {
      let viewType: "UMLGeneralizationView" | "UMLInterfaceRealizationView" | "UMLDependencyView";
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

      const edgeViewNode = createUMLConnectionViewNode(
        viewType,
        relViewId,
        diagramId,
        relModelId,
        sourceViewId,
        targetViewId,
        pointsString,
        {
          name: rel.name
        }
      );
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
export function buildUseCaseDiagramMdj(input: GenerateUseCaseDiagramInput): StarUMLNode {
  const registry = new IdRegistry();
  const projectId = generateStarUMLId();
  const modelId = generateStarUMLId();
  const diagramId = generateStarUMLId();

  const viewIdMap = new Map<string, string>(); // inputId -> viewId
  const layoutNodes: LayoutNodeInput[] = [];

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
  const layoutEdges: LayoutEdgeInput[] = input.relationships.map((rel) => ({
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
  const boundaryMap = new Map<string, Array<{ id: string; left: number; top: number; width: number; height: number }>>();
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

  const semanticSubjects: StarUMLNode[] = [];
  const boundaryViews: StarUMLNode[] = [];
  for (const [boundaryName, items] of boundaryMap.entries()) {
    if (items.length === 0) continue;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    for (const item of items) {
      if (item.left < minX) minX = item.left;
      if (item.top < minY) minY = item.top;
      if (item.left + item.width > maxX) maxX = item.left + item.width;
      if (item.top + item.height > maxY) maxY = item.top + item.height;
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
    boundaryViews.push(
      createUMLUseCaseSubjectViewNode(bViewId, diagramId, bModelId, boundaryName, {
        left: bLeft,
        top: bTop,
        width: bWidth,
        height: bHeight
      })
    );
  }

  // Build semantic relationships owned by source elements
  const ownedRelations = new Map<string, StarUMLNode[]>();
  const relModelIdMap = new Map<string, string>();
  const ucAssocEndsMap = new Map<string, { end1Id: string; end2Id: string }>();

  for (const rel of input.relationships) {
    const relModelId = registry.resolve(rel.id);
    relModelIdMap.set(rel.id, relModelId);
    const sourceModelId = registry.resolve(rel.sourceId);
    const targetModelId = registry.resolve(rel.targetId);

    let semanticNode: StarUMLNode;
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
          end1Id: (semanticNode.end1 as StarUMLNode)._id,
          end2Id: (semanticNode.end2 as StarUMLNode)._id
        });
        break;
    }

    const existing = ownedRelations.get(rel.sourceId) ?? [];
    existing.push(semanticNode);
    ownedRelations.set(rel.sourceId, existing);
  }

  // Semantic Actor nodes and View nodes
  const semanticActors: StarUMLNode[] = [];
  const actorViews: StarUMLNode[] = [];

  for (const actor of input.actors) {
    const actorModelId = registry.resolve(actor.id);
    const actorViewId = viewIdMap.get(actor.id)!;
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

    actorViews.push(
      createUMLActorViewNode(actorViewId, diagramId, actorModelId, actor.name, {
        left: pos.left,
        top: pos.top,
        width: pos.width,
        height: pos.height
      })
    );
  }

  // Semantic Use Case nodes and View nodes
  const semanticUseCases: StarUMLNode[] = [];
  const useCaseViews: StarUMLNode[] = [];

  for (const uc of input.useCases) {
    const ucModelId = registry.resolve(uc.id);
    const ucViewId = viewIdMap.get(uc.id)!;
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

    useCaseViews.push(
      createUMLUseCaseViewNode(ucViewId, diagramId, ucModelId, uc.name, {
        left: pos.left,
        top: pos.top,
        width: pos.width,
        height: pos.height
      })
    );
  }

  // Relationship Views
  const relationshipViews: StarUMLNode[] = [];

  for (const rel of input.relationships) {
    const relModelId = relModelIdMap.get(rel.id)!;
    const relViewId = generateStarUMLId();
    const sourceViewId = viewIdMap.get(rel.sourceId);
    const targetViewId = viewIdMap.get(rel.targetId);

    if (!sourceViewId || !targetViewId) continue;

    const edgePos = layoutResult.edges.get(rel.id);
    const pointsString = edgePos?.pointsString ?? "100:100;200:200";

    switch (rel.type) {
      case "include":
        relationshipViews.push(
          createUMLIncludeViewNode(relViewId, diagramId, relModelId, sourceViewId, targetViewId, pointsString)
        );
        break;
      case "extend":
        relationshipViews.push(
          createUMLExtendViewNode(relViewId, diagramId, relModelId, sourceViewId, targetViewId, pointsString)
        );
        break;
      case "generalization":
        relationshipViews.push(
          createUMLConnectionViewNode(
            "UMLGeneralizationView",
            relViewId,
            diagramId,
            relModelId,
            sourceViewId,
            targetViewId,
            pointsString
          )
        );
        break;
      case "association":
      default:
        {
          const ends = ucAssocEndsMap.get(rel.id) ?? { end1Id: generateStarUMLId(), end2Id: generateStarUMLId() };
          relationshipViews.push(
            createUMLAssociationViewNode(
              relViewId,
              diagramId,
              relModelId,
              sourceViewId,
              targetViewId,
              pointsString,
              ends.end1Id,
              ends.end2Id
            )
          );
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
export function buildSequenceDiagramMdj(input: GenerateSequenceDiagramInput): StarUMLNode {
  const registry = new IdRegistry();
  const projectId = generateStarUMLId();
  const modelId = generateStarUMLId();
  const interactionId = generateStarUMLId();
  const diagramId = generateStarUMLId();

  // Layout lifelines and messages chronologically
  const layoutResult = computeSequenceLayout(input.lifelines, input.messages);

  const lifelineViewMap = new Map<string, { viewId: string; linePartId: string }>();

  // Semantic lifelines & View nodes
  const semanticLifelines: StarUMLNode[] = [];
  const lifelineViews: StarUMLNode[] = [];

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

    lifelineViews.push(
      createUMLSeqLifelineViewNode(
        lifelineViewId,
        diagramId,
        lifelineModelId,
        ll.name,
        {
          left: pos.left,
          top: pos.top,
          width: pos.width,
          height: pos.height
        },
        linePartId
      )
    );
  }

  // Semantic messages & View nodes
  const semanticMessages: StarUMLNode[] = [];
  const messageViews: StarUMLNode[] = [];

  for (const msgLayout of layoutResult.messages) {
    const msgModelId = registry.resolve(msgLayout.id);
    const msgViewId = generateStarUMLId();
    const sourceModelId = registry.resolve(msgLayout.sourceLifelineId);
    const targetModelId = registry.resolve(msgLayout.targetLifelineId);

    const sourceRefs = lifelineViewMap.get(msgLayout.sourceLifelineId);
    const targetRefs = lifelineViewMap.get(msgLayout.targetLifelineId);

    semanticMessages.push(
      createUMLMessageNode(
        msgModelId,
        interactionId,
        msgLayout.name,
        sourceModelId,
        targetModelId,
        msgLayout.messageSort
      )
    );

    if (sourceRefs && targetRefs) {
      messageViews.push(
        createUMLSeqMessageViewNode(
          msgViewId,
          diagramId,
          msgModelId,
          msgLayout.name,
          sourceRefs.linePartId,
          targetRefs.linePartId,
          msgLayout.pointsString,
          msgLayout.messageSort,
          {
            left: msgLayout.labelLeft,
            top: msgLayout.labelTop,
            width: msgLayout.labelWidth
          }
        )
      );
    }
  }

  // Sequence Diagram Node
  const sequenceDiagramNode = createUMLSequenceDiagramNode(diagramId, interactionId, input.diagramName, [
    ...lifelineViews,
    ...messageViews
  ]);

  // Interaction Node (holds participants, messages, and the diagram)
  const interactionNode = createUMLInteractionNode(
    interactionId,
    modelId,
    input.diagramName,
    semanticLifelines,
    semanticMessages,
    [sequenceDiagramNode]
  );

  const modelNode = createUMLModelNode(modelId, projectId, input.projectName ?? "Model", [interactionNode]);

  return createProjectNode(projectId, input.projectName ?? "Model", [modelNode]);
}

/**
 * Builds a complete StarUML (.mdj) AST for an Activity Diagram.
 */
export function buildActivityDiagramMdj(input: GenerateActivityDiagramInput): StarUMLNode {
  const registry = new IdRegistry();
  const projectId = generateStarUMLId();
  const modelId = generateStarUMLId();
  const activityId = generateStarUMLId();
  const diagramId = generateStarUMLId();

  const nodeViewIdMap = new Map<string, string>();
  const layoutNodes: LayoutNodeInput[] = [];
  const semanticNodes: StarUMLNode[] = [];

  for (const node of input.nodes) {
    const nodeModelId = registry.resolve(node.id);
    const nodeViewId = generateStarUMLId();
    nodeViewIdMap.set(node.id, nodeViewId);

    let width = 140;
    let height = 45;

    if (node.type === "initial") {
      width = 20;
      height = 20;
      semanticNodes.push(createUMLControlNode("UMLInitialNode", nodeModelId, activityId, node.name));
    } else if (node.type === "final") {
      width = 26;
      height = 26;
      semanticNodes.push(createUMLControlNode("UMLActivityFinalNode", nodeModelId, activityId, node.name));
    } else if (node.type === "flowFinal") {
      width = 26;
      height = 26;
      semanticNodes.push(createUMLControlNode("UMLFlowFinalNode", nodeModelId, activityId, node.name));
    } else if (node.type === "decision") {
      width = 30;
      height = 30;
      semanticNodes.push(createUMLControlNode("UMLDecisionNode", nodeModelId, activityId, node.name));
    } else if (node.type === "merge") {
      width = 30;
      height = 30;
      semanticNodes.push(createUMLControlNode("UMLMergeNode", nodeModelId, activityId, node.name));
    } else if (node.type === "fork") {
      width = 80;
      height = 8;
      semanticNodes.push(createUMLControlNode("UMLForkNode", nodeModelId, activityId, node.name));
    } else if (node.type === "join") {
      width = 80;
      height = 8;
      semanticNodes.push(createUMLControlNode("UMLJoinNode", nodeModelId, activityId, node.name));
    } else {
      width = Math.max(120, Math.min(360, Math.round(node.name.length * 8.5 + 30)));
      height = 45;
      semanticNodes.push(createUMLActionNode(nodeModelId, activityId, node.name));
    }

    layoutNodes.push({ id: node.id, width, height });
  }

  const layoutEdges: LayoutEdgeInput[] = input.flows.map((f) => ({
    id: f.id,
    sourceId: f.sourceId,
    targetId: f.targetId
  }));

  const layoutResult = computeGraphLayout(layoutNodes, layoutEdges, {
    rankdir: "TB",
    nodesep: 40,
    ranksep: 50
  });

  const nodeViews: StarUMLNode[] = [];
  for (const node of input.nodes) {
    const nodeModelId = registry.resolve(node.id);
    const nodeViewId = nodeViewIdMap.get(node.id)!;
    const pos = layoutResult.nodes.get(node.id) ?? { left: 100, top: 100, width: 120, height: 45 };

    if (node.type === "action") {
      nodeViews.push(createUMLActionViewNode(nodeViewId, diagramId, nodeModelId, node.name, pos));
    } else {
      nodeViews.push(createUMLControlNodeViewNode(nodeViewId, diagramId, nodeModelId, pos));
    }
  }

  const flowViews: StarUMLNode[] = [];
  const semanticFlows: StarUMLNode[] = [];

  for (const flow of input.flows) {
    const flowModelId = registry.resolve(flow.id);
    const flowViewId = generateStarUMLId();
    const srcModelId = registry.resolve(flow.sourceId);
    const tgtModelId = registry.resolve(flow.targetId);
    const srcViewId = nodeViewIdMap.get(flow.sourceId);
    const tgtViewId = nodeViewIdMap.get(flow.targetId);

    if (!srcViewId || !tgtViewId) continue;

    semanticFlows.push(createUMLControlFlowNode(flowModelId, activityId, srcModelId, tgtModelId, flow.name, flow.guard));

    const edgeLayout = layoutResult.edges.get(flow.id);
    const pointsString = edgeLayout?.pointsString ?? "100,100;100,200";

    flowViews.push(
      createUMLGenericEdgeViewNode(
        "UMLControlFlowView",
        flowViewId,
        diagramId,
        flowModelId,
        srcViewId,
        tgtViewId,
        pointsString,
        { label: flow.guard ? `${flow.name ?? ""} ${flow.guard}`.trim() : flow.name }
      )
    );
  }

  const diagramNode = createUMLActivityDiagramNode(diagramId, activityId, input.diagramName, [
    ...nodeViews,
    ...flowViews
  ]);

  const activityNode = createUMLActivityNode(
    activityId,
    modelId,
    input.diagramName,
    semanticNodes,
    semanticFlows,
    [diagramNode]
  );

  const modelNode = createUMLModelNode(modelId, projectId, input.projectName ?? "Model", [activityNode]);
  return createProjectNode(projectId, input.projectName ?? "Model", [modelNode]);
}

/**
 * Builds a complete StarUML (.mdj) AST for a State Machine Diagram.
 */
export function buildStateMachineDiagramMdj(input: GenerateStateMachineDiagramInput): StarUMLNode {
  const registry = new IdRegistry();
  const projectId = generateStarUMLId();
  const modelId = generateStarUMLId();
  const stateMachineId = generateStarUMLId();
  const regionId = generateStarUMLId();
  const diagramId = generateStarUMLId();

  const stateViewIdMap = new Map<string, string>();
  const layoutNodes: LayoutNodeInput[] = [];
  const vertices: StarUMLNode[] = [];

  for (const state of input.states) {
    const stateModelId = registry.resolve(state.id);
    const stateViewId = generateStarUMLId();
    stateViewIdMap.set(state.id, stateViewId);

    let width = 120;
    let height = 50;

    if (state.type === "initial") {
      width = 20;
      height = 20;
      vertices.push(createUMLPseudostateNode(stateModelId, regionId, "initial", state.name));
    } else if (state.type === "choice") {
      width = 25;
      height = 25;
      vertices.push(createUMLPseudostateNode(stateModelId, regionId, "choice", state.name));
    } else if (state.type === "junction") {
      width = 20;
      height = 20;
      vertices.push(createUMLPseudostateNode(stateModelId, regionId, "junction", state.name));
    } else if (state.type === "final") {
      width = 26;
      height = 26;
      vertices.push(createUMLFinalStateNode(stateModelId, regionId, state.name));
    } else {
      width = Math.max(120, Math.min(360, Math.round(state.name.length * 8.5 + 30)));
      height = 50;
      vertices.push(
        createUMLStateNode(
          stateModelId,
          regionId,
          state.name,
          state.entryActivity,
          state.exitActivity,
          state.doActivity
        )
      );
    }

    layoutNodes.push({ id: state.id, width, height });
  }

  const layoutEdges: LayoutEdgeInput[] = input.transitions.map((t) => ({
    id: t.id,
    sourceId: t.sourceId,
    targetId: t.targetId
  }));

  const layoutResult = computeGraphLayout(layoutNodes, layoutEdges, {
    rankdir: "LR",
    nodesep: 50,
    ranksep: 70
  });

  const stateViews: StarUMLNode[] = [];
  for (const state of input.states) {
    const stateModelId = registry.resolve(state.id);
    const stateViewId = stateViewIdMap.get(state.id)!;
    const pos = layoutResult.nodes.get(state.id) ?? { left: 100, top: 100, width: 120, height: 50 };

    if (state.type === "initial" || state.type === "choice" || state.type === "junction") {
      stateViews.push(createUMLPseudostateViewNode(stateViewId, diagramId, stateModelId, pos));
    } else if (state.type === "final") {
      stateViews.push(createUMLFinalStateViewNode(stateViewId, diagramId, stateModelId, pos));
    } else {
      stateViews.push(createUMLStateViewNode(stateViewId, diagramId, stateModelId, state.name, pos));
    }
  }

  const transViews: StarUMLNode[] = [];
  const transitions: StarUMLNode[] = [];

  for (const t of input.transitions) {
    const transModelId = registry.resolve(t.id);
    const transViewId = generateStarUMLId();
    const srcModelId = registry.resolve(t.sourceId);
    const tgtModelId = registry.resolve(t.targetId);
    const srcViewId = stateViewIdMap.get(t.sourceId);
    const tgtViewId = stateViewIdMap.get(t.targetId);

    if (!srcViewId || !tgtViewId) continue;

    transitions.push(
      createUMLTransitionNode(
        transModelId,
        regionId,
        srcModelId,
        tgtModelId,
        t.name,
        t.guard,
        t.trigger,
        t.effect
      )
    );

    const edgeLayout = layoutResult.edges.get(t.id);
    const pointsString = edgeLayout?.pointsString ?? "100,100;200,100";

    const label = t.guard
      ? `${t.trigger ?? t.name ?? ""} ${t.guard}`.trim()
      : (t.trigger ?? t.name ?? "");

    transViews.push(
      createUMLGenericEdgeViewNode(
        "UMLTransitionView",
        transViewId,
        diagramId,
        transModelId,
        srcViewId,
        tgtViewId,
        pointsString,
        { label }
      )
    );
  }

  const diagramNode = createUMLStatechartDiagramNode(diagramId, stateMachineId, input.diagramName, [
    ...stateViews,
    ...transViews
  ]);

  const regionNode = createUMLRegionNode(regionId, stateMachineId, "Region1", vertices, transitions);

  const stateMachineNode = createUMLStateMachineNode(
    stateMachineId,
    modelId,
    input.diagramName,
    [regionNode],
    [diagramNode]
  );

  const modelNode = createUMLModelNode(modelId, projectId, input.projectName ?? "Model", [stateMachineNode]);
  return createProjectNode(projectId, input.projectName ?? "Model", [modelNode]);
}

/**
 * Builds a complete StarUML (.mdj) AST for a Component Diagram.
 */
export function buildComponentDiagramMdj(input: GenerateComponentDiagramInput): StarUMLNode {
  const registry = new IdRegistry();
  const projectId = generateStarUMLId();
  const modelId = generateStarUMLId();
  const diagramId = generateStarUMLId();

  const viewIdMap = new Map<string, string>();
  const layoutNodes: LayoutNodeInput[] = [];
  const semanticElements: StarUMLNode[] = [];

  for (const comp of input.components) {
    const compModelId = registry.resolve(comp.id);
    const compViewId = generateStarUMLId();
    viewIdMap.set(comp.id, compViewId);

    const width = Math.max(140, Math.min(360, Math.round(comp.name.length * 8.5 + 40)));
    const height = comp.stereotype ? 60 : 45;

    semanticElements.push(createUMLComponentNode(compModelId, modelId, comp.name, comp.stereotype));
    layoutNodes.push({ id: comp.id, width, height });
  }

  for (const iface of input.interfaces ?? []) {
    const ifaceModelId = registry.resolve(iface.id);
    const ifaceViewId = generateStarUMLId();
    viewIdMap.set(iface.id, ifaceViewId);

    const width = Math.max(110, Math.min(300, Math.round(iface.name.length * 8.5 + 30)));
    const height = 40;

    semanticElements.push(createUMLClassNode(ifaceModelId, modelId, iface.name, { stereotype: "interface" }));
    layoutNodes.push({ id: iface.id, width, height });
  }

  const layoutEdges: LayoutEdgeInput[] = input.relationships.map((r) => ({
    id: r.id,
    sourceId: r.sourceId,
    targetId: r.targetId
  }));

  const layoutResult = computeGraphLayout(layoutNodes, layoutEdges, {
    rankdir: "TB",
    nodesep: 60,
    ranksep: 80
  });

  const nodeViews: StarUMLNode[] = [];
  for (const comp of input.components) {
    const compModelId = registry.resolve(comp.id);
    const compViewId = viewIdMap.get(comp.id)!;
    const pos = layoutResult.nodes.get(comp.id) ?? { left: 100, top: 100, width: 140, height: 50 };
    nodeViews.push(createUMLComponentViewNode(compViewId, diagramId, compModelId, comp.name, pos, comp.stereotype));
  }

  for (const iface of input.interfaces ?? []) {
    const ifaceModelId = registry.resolve(iface.id);
    const ifaceViewId = viewIdMap.get(iface.id)!;
    const pos = layoutResult.nodes.get(iface.id) ?? { left: 100, top: 100, width: 110, height: 40 };
    nodeViews.push(createUMLClassViewNode(ifaceViewId, diagramId, ifaceModelId, iface.name, pos, { stereotype: "interface" }));
  }

  const edgeViews: StarUMLNode[] = [];
  for (const rel of input.relationships) {
    const relModelId = registry.resolve(rel.id);
    const relViewId = generateStarUMLId();
    const srcModelId = registry.resolve(rel.sourceId);
    const tgtModelId = registry.resolve(rel.targetId);
    const srcViewId = viewIdMap.get(rel.sourceId);
    const tgtViewId = viewIdMap.get(rel.targetId);

    if (!srcViewId || !tgtViewId) continue;

    const edgeLayout = layoutResult.edges.get(rel.id);
    const pointsString = edgeLayout?.pointsString ?? "100,100;100,200";

    let viewType = "UMLDependencyView";
    if (rel.type === "realization") {
      semanticElements.push(createUMLInterfaceRealizationNode(relModelId, srcModelId, tgtModelId, rel.name));
      viewType = "UMLInterfaceRealizationView";
    } else if (rel.type === "association") {
      semanticElements.push(createUMLAssociationNode(relModelId, srcModelId, tgtModelId, { name: rel.name }));
      viewType = "UMLAssociationView";
    } else {
      semanticElements.push(createUMLDependencyNode(relModelId, srcModelId, tgtModelId, rel.name));
      viewType = "UMLDependencyView";
    }

    edgeViews.push(
      createUMLGenericEdgeViewNode(
        viewType,
        relViewId,
        diagramId,
        relModelId,
        srcViewId,
        tgtViewId,
        pointsString,
        { name: rel.name }
      )
    );
  }

  const diagramNode = createUMLComponentDiagramNode(diagramId, modelId, input.diagramName, [
    ...nodeViews,
    ...edgeViews
  ]);

  const modelNode = createUMLModelNode(modelId, projectId, input.projectName ?? "Model", [
    diagramNode,
    ...semanticElements
  ]);

  return createProjectNode(projectId, input.projectName ?? "Model", [modelNode]);
}

/**
 * Builds a complete StarUML (.mdj) AST for a Deployment Diagram.
 */
export function buildDeploymentDiagramMdj(input: GenerateDeploymentDiagramInput): StarUMLNode {
  const registry = new IdRegistry();
  const projectId = generateStarUMLId();
  const modelId = generateStarUMLId();
  const diagramId = generateStarUMLId();

  const viewIdMap = new Map<string, string>();
  const layoutNodes: LayoutNodeInput[] = [];
  const semanticElements: StarUMLNode[] = [];

  for (const node of input.nodes) {
    const nodeModelId = registry.resolve(node.id);
    const nodeViewId = generateStarUMLId();
    viewIdMap.set(node.id, nodeViewId);

    const width = Math.max(160, Math.min(360, Math.round(node.name.length * 8.5 + 40)));
    const height = node.stereotype ? 75 : 60;

    semanticElements.push(createUMLDeploymentNode(nodeModelId, modelId, node.name, node.stereotype));
    layoutNodes.push({ id: node.id, width, height });
  }

  for (const art of input.artifacts ?? []) {
    const artModelId = registry.resolve(art.id);
    const artViewId = generateStarUMLId();
    viewIdMap.set(art.id, artViewId);

    const width = Math.max(120, Math.min(300, Math.round(art.name.length * 8.5 + 30)));
    const height = 45;

    semanticElements.push(createUMLArtifactNode(artModelId, modelId, art.name));
    layoutNodes.push({ id: art.id, width, height });
  }

  const layoutEdges: LayoutEdgeInput[] = input.connections.map((c) => ({
    id: c.id,
    sourceId: c.sourceId,
    targetId: c.targetId
  }));

  const layoutResult = computeGraphLayout(layoutNodes, layoutEdges, {
    rankdir: "TB",
    nodesep: 60,
    ranksep: 80
  });

  const nodeViews: StarUMLNode[] = [];
  for (const node of input.nodes) {
    const nodeModelId = registry.resolve(node.id);
    const nodeViewId = viewIdMap.get(node.id)!;
    const pos = layoutResult.nodes.get(node.id) ?? { left: 100, top: 100, width: 160, height: 60 };
    nodeViews.push(createUMLDeploymentNodeViewNode(nodeViewId, diagramId, nodeModelId, node.name, pos, node.stereotype));
  }

  for (const art of input.artifacts ?? []) {
    const artModelId = registry.resolve(art.id);
    const artViewId = viewIdMap.get(art.id)!;
    const pos = layoutResult.nodes.get(art.id) ?? { left: 100, top: 100, width: 120, height: 45 };
    nodeViews.push(createUMLArtifactViewNode(artViewId, diagramId, artModelId, art.name, pos));
  }

  const edgeViews: StarUMLNode[] = [];
  for (const conn of input.connections) {
    const connModelId = registry.resolve(conn.id);
    const connViewId = generateStarUMLId();
    const srcModelId = registry.resolve(conn.sourceId);
    const tgtModelId = registry.resolve(conn.targetId);
    const srcViewId = viewIdMap.get(conn.sourceId);
    const tgtViewId = viewIdMap.get(conn.targetId);

    if (!srcViewId || !tgtViewId) continue;

    semanticElements.push(createUMLCommunicationPathNode(connModelId, modelId, srcModelId, tgtModelId, conn.name));

    const edgeLayout = layoutResult.edges.get(conn.id);
    const pointsString = edgeLayout?.pointsString ?? "100,100;100,200";

    edgeViews.push(
      createUMLGenericEdgeViewNode(
        "UMLCommunicationPathView",
        connViewId,
        diagramId,
        connModelId,
        srcViewId,
        tgtViewId,
        pointsString,
        { name: conn.name }
      )
    );
  }

  const diagramNode = createUMLDeploymentDiagramNode(diagramId, modelId, input.diagramName, [
    ...nodeViews,
    ...edgeViews
  ]);

  const modelNode = createUMLModelNode(modelId, projectId, input.projectName ?? "Model", [
    diagramNode,
    ...semanticElements
  ]);

  return createProjectNode(projectId, input.projectName ?? "Model", [modelNode]);
}

/**
 * Builds a complete StarUML (.mdj) AST for an Object Diagram.
 */
export function buildObjectDiagramMdj(input: GenerateObjectDiagramInput): StarUMLNode {
  const registry = new IdRegistry();
  const projectId = generateStarUMLId();
  const modelId = generateStarUMLId();
  const diagramId = generateStarUMLId();

  const viewIdMap = new Map<string, string>();
  const layoutNodes: LayoutNodeInput[] = [];
  const semanticElements: StarUMLNode[] = [];

  for (const obj of input.objects) {
    const objModelId = registry.resolve(obj.id);
    const objViewId = generateStarUMLId();
    viewIdMap.set(obj.id, objViewId);

    const width = Math.max(140, Math.min(360, Math.round(obj.name.length * 8.5 + 40)));
    const slotCount = obj.slots?.length ?? 0;
    const height = Math.max(45, 30 + slotCount * 18);

    semanticElements.push(createUMLObjectNode(objModelId, modelId, obj.name, obj.className, obj.slots));
    layoutNodes.push({ id: obj.id, width, height });
  }

  const layoutEdges: LayoutEdgeInput[] = input.links.map((l) => ({
    id: l.id,
    sourceId: l.sourceId,
    targetId: l.targetId
  }));

  const layoutResult = computeGraphLayout(layoutNodes, layoutEdges, {
    rankdir: "TB",
    nodesep: 60,
    ranksep: 80
  });

  const nodeViews: StarUMLNode[] = [];
  for (const obj of input.objects) {
    const objModelId = registry.resolve(obj.id);
    const objViewId = viewIdMap.get(obj.id)!;
    const pos = layoutResult.nodes.get(obj.id) ?? { left: 100, top: 100, width: 140, height: 45 };
    nodeViews.push(createUMLObjectViewNode(objViewId, diagramId, objModelId, obj.name, pos, obj.slots));
  }

  const edgeViews: StarUMLNode[] = [];
  for (const link of input.links) {
    const linkModelId = registry.resolve(link.id);
    const linkViewId = generateStarUMLId();
    const srcModelId = registry.resolve(link.sourceId);
    const tgtModelId = registry.resolve(link.targetId);
    const srcViewId = viewIdMap.get(link.sourceId);
    const tgtViewId = viewIdMap.get(link.targetId);

    if (!srcViewId || !tgtViewId) continue;

    semanticElements.push(createUMLLinkNode(linkModelId, modelId, srcModelId, tgtModelId, link.name));

    const edgeLayout = layoutResult.edges.get(link.id);
    const pointsString = edgeLayout?.pointsString ?? "100,100;100,200";

    edgeViews.push(
      createUMLGenericEdgeViewNode(
        "UMLLinkView",
        linkViewId,
        diagramId,
        linkModelId,
        srcViewId,
        tgtViewId,
        pointsString,
        { name: link.name }
      )
    );
  }

  const diagramNode = createUMLObjectDiagramNode(diagramId, modelId, input.diagramName, [
    ...nodeViews,
    ...edgeViews
  ]);

  const modelNode = createUMLModelNode(modelId, projectId, input.projectName ?? "Model", [
    diagramNode,
    ...semanticElements
  ]);

  return createProjectNode(projectId, input.projectName ?? "Model", [modelNode]);
}

/**
 * Builds a complete StarUML (.mdj) AST for a Communication Diagram.
 */
export function buildCommunicationDiagramMdj(input: GenerateCommunicationDiagramInput): StarUMLNode {
  const registry = new IdRegistry();
  const projectId = generateStarUMLId();
  const modelId = generateStarUMLId();
  const interactionId = generateStarUMLId();
  const diagramId = generateStarUMLId();

  const viewIdMap = new Map<string, string>();
  const layoutNodes: LayoutNodeInput[] = [];
  const semanticLifelines: StarUMLNode[] = [];

  for (const ll of input.lifelines) {
    const llModelId = registry.resolve(ll.id);
    const llViewId = generateStarUMLId();
    viewIdMap.set(ll.id, llViewId);

    const width = Math.max(140, Math.min(360, Math.round(ll.name.length * 8.5 + 40)));
    const height = 45;

    semanticLifelines.push(createUMLLifelineNode(llModelId, interactionId, ll.name, ll.representClass));
    layoutNodes.push({ id: ll.id, width, height });
  }

  const layoutEdges: LayoutEdgeInput[] = input.messages.map((m) => ({
    id: m.id,
    sourceId: m.sourceId,
    targetId: m.targetId
  }));

  const layoutResult = computeGraphLayout(layoutNodes, layoutEdges, {
    rankdir: "TB",
    nodesep: 70,
    ranksep: 90
  });

  const lifelineViews: StarUMLNode[] = [];
  for (const ll of input.lifelines) {
    const llModelId = registry.resolve(ll.id);
    const llViewId = viewIdMap.get(ll.id)!;
    const pos = layoutResult.nodes.get(ll.id) ?? { left: 100, top: 100, width: 140, height: 45 };
    lifelineViews.push(createUMLCommLifelineViewNode(llViewId, diagramId, llModelId, ll.name, pos));
  }

  const messageViews: StarUMLNode[] = [];
  const semanticMessages: StarUMLNode[] = [];

  for (const msg of input.messages) {
    const msgModelId = registry.resolve(msg.id);
    const msgViewId = generateStarUMLId();
    const srcModelId = registry.resolve(msg.sourceId);
    const tgtModelId = registry.resolve(msg.targetId);
    const srcViewId = viewIdMap.get(msg.sourceId);
    const tgtViewId = viewIdMap.get(msg.targetId);

    if (!srcViewId || !tgtViewId) continue;

    const fullMsgName = `${msg.sequenceNumber}: ${msg.name}`;
    semanticMessages.push(createUMLMessageNode(msgModelId, interactionId, fullMsgName, srcModelId, tgtModelId));

    const edgeLayout = layoutResult.edges.get(msg.id);
    const pointsString = edgeLayout?.pointsString ?? "100,100;100,200";

    messageViews.push(
      createUMLGenericEdgeViewNode(
        "UMLLinkView",
        msgViewId,
        diagramId,
        msgModelId,
        srcViewId,
        tgtViewId,
        pointsString,
        { name: fullMsgName }
      )
    );
  }

  const diagramNode = createUMLCommunicationDiagramNode(diagramId, interactionId, input.diagramName, [
    ...lifelineViews,
    ...messageViews
  ]);

  const interactionNode = createUMLInteractionNode(
    interactionId,
    modelId,
    input.diagramName,
    semanticLifelines,
    semanticMessages,
    [diagramNode]
  );

  const modelNode = createUMLModelNode(modelId, projectId, input.projectName ?? "Model", [interactionNode]);
  return createProjectNode(projectId, input.projectName ?? "Model", [modelNode]);
}

