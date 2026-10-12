import type { StarUMLNode } from "../types.js";
import { generateStarUMLId } from "./id-generator.js";

/**
 * Pure factory functions to construct standard StarUML (.mdj) nodes,
 * strictly adhering to StarUML's metamodel and schema.
 */

// --- Project & Top-Level Containers ---

export function createProjectNode(id: string, name: string, ownedElements: StarUMLNode[] = []): StarUMLNode {
  return {
    _type: "Project",
    _id: id,
    name,
    ownedElements
  };
}

export function createUMLModelNode(
  id: string,
  parentId: string,
  name: string,
  ownedElements: StarUMLNode[] = []
): StarUMLNode {
  return {
    _type: "UMLModel",
    _id: id,
    _parent: { $ref: parentId },
    name,
    ownedElements
  };
}

// --- Class Diagram Semantic Nodes ---

export function createUMLParameterNode(
  id: string,
  parentId: string,
  name: string,
  type: string,
  direction?: "return" | "in" | "out" | "inout"
): StarUMLNode {
  const node: StarUMLNode = {
    _type: "UMLParameter",
    _id: id,
    _parent: { $ref: parentId },
    name,
    type
  };
  if (direction) {
    node.direction = direction;
  }
  return node;
}

export function createUMLOperationNode(
  id: string,
  parentId: string,
  name: string,
  returnType?: string,
  visibility: "public" | "protected" | "private" | "package" = "public",
  parameters: Array<{ name: string; type: string }> = []
): StarUMLNode {
  const paramNodes: StarUMLNode[] = parameters.map((p) =>
    createUMLParameterNode(generateStarUMLId(), id, p.name, p.type, "in")
  );

  if (returnType && returnType !== "void") {
    paramNodes.push(createUMLParameterNode(generateStarUMLId(), id, "", returnType, "return"));
  }

  return {
    _type: "UMLOperation",
    _id: id,
    _parent: { $ref: parentId },
    name,
    visibility,
    parameters: paramNodes
  };
}

export function createUMLAttributeNode(
  id: string,
  parentId: string,
  name: string,
  type: string,
  visibility: "public" | "protected" | "private" | "package" = "public"
): StarUMLNode {
  return {
    _type: "UMLAttribute",
    _id: id,
    _parent: { $ref: parentId },
    name,
    type,
    visibility
  };
}

export function createUMLClassNode(
  id: string,
  parentId: string,
  name: string,
  options: {
    stereotype?: string;
    isAbstract?: boolean;
    attributes?: StarUMLNode[];
    operations?: StarUMLNode[];
    ownedElements?: StarUMLNode[];
  } = {}
): StarUMLNode {
  const isInterface = options.stereotype?.toLowerCase() === "interface";
  const nodeType = isInterface ? "UMLInterface" : "UMLClass";

  const node: StarUMLNode = {
    _type: nodeType,
    _id: id,
    _parent: { $ref: parentId },
    name,
    attributes: options.attributes ?? [],
    operations: options.operations ?? [],
    ownedElements: options.ownedElements ?? []
  };

  if (options.stereotype && !isInterface) {
    node.stereotype = options.stereotype;
  }
  if (options.isAbstract) {
    node.isAbstract = true;
  }

  return node;
}

// --- Class Diagram Relationships (Semantic) ---

export function createUMLGeneralizationNode(
  id: string,
  sourceId: string,
  targetId: string,
  name?: string
): StarUMLNode {
  const node: StarUMLNode = {
    _type: "UMLGeneralization",
    _id: id,
    _parent: { $ref: sourceId },
    source: { $ref: sourceId },
    target: { $ref: targetId }
  };
  if (name) node.name = name;
  return node;
}

export function createUMLInterfaceRealizationNode(
  id: string,
  sourceId: string,
  targetId: string,
  name?: string
): StarUMLNode {
  const node: StarUMLNode = {
    _type: "UMLInterfaceRealization",
    _id: id,
    _parent: { $ref: sourceId },
    source: { $ref: sourceId },
    target: { $ref: targetId }
  };
  if (name) node.name = name;
  return node;
}

export function createUMLDependencyNode(
  id: string,
  sourceId: string,
  targetId: string,
  name?: string
): StarUMLNode {
  const node: StarUMLNode = {
    _type: "UMLDependency",
    _id: id,
    _parent: { $ref: sourceId },
    source: { $ref: sourceId },
    target: { $ref: targetId }
  };
  if (name) node.name = name;
  return node;
}

export function createUMLAssociationNode(
  id: string,
  sourceId: string,
  targetId: string,
  options: {
    name?: string;
    aggregationKind?: "none" | "shared" | "composite";
    sourceMultiplicity?: string;
    targetMultiplicity?: string;
    navigable?: "unspecified" | "navigable" | "notNavigable";
  } = {}
): StarUMLNode {
  const end1Id = generateStarUMLId();
  const end2Id = generateStarUMLId();

  const end1: StarUMLNode = {
    _type: "UMLAssociationEnd",
    _id: end1Id,
    _parent: { $ref: id },
    reference: { $ref: sourceId },
    navigable: "unspecified",
    aggregation: options.aggregationKind ?? "none"
  };
  if (options.sourceMultiplicity) {
    end1.multiplicity = options.sourceMultiplicity;
  }

  const end2: StarUMLNode = {
    _type: "UMLAssociationEnd",
    _id: end2Id,
    _parent: { $ref: id },
    reference: { $ref: targetId },
    navigable: options.navigable ?? "navigable",
    aggregation: "none"
  };
  if (options.targetMultiplicity) {
    end2.multiplicity = options.targetMultiplicity;
  }

  const node: StarUMLNode = {
    _type: "UMLAssociation",
    _id: id,
    _parent: { $ref: sourceId },
    end1,
    end2
  };
  if (options.name) node.name = options.name;

  return node;
}

// --- Use Case Diagram Semantic Nodes ---

export function createUMLActorNode(id: string, parentId: string, name: string): StarUMLNode {
  return {
    _type: "UMLActor",
    _id: id,
    _parent: { $ref: parentId },
    name
  };
}

export function createUMLUseCaseSubjectNode(id: string, parentId: string, name: string): StarUMLNode {
  return {
    _type: "UMLUseCaseSubject",
    _id: id,
    _parent: { $ref: parentId },
    name
  };
}

export function createUMLUseCaseNode(
  id: string,
  parentId: string,
  name: string,
  ownedElements: StarUMLNode[] = []
): StarUMLNode {
  return {
    _type: "UMLUseCase",
    _id: id,
    _parent: { $ref: parentId },
    name,
    ownedElements
  };
}

export function createUMLIncludeNode(
  id: string,
  sourceUseCaseId: string,
  targetUseCaseId: string
): StarUMLNode {
  return {
    _type: "UMLInclude",
    _id: id,
    _parent: { $ref: sourceUseCaseId },
    source: { $ref: sourceUseCaseId },
    target: { $ref: targetUseCaseId }
  };
}

export function createUMLExtendNode(
  id: string,
  sourceUseCaseId: string,
  targetUseCaseId: string
): StarUMLNode {
  return {
    _type: "UMLExtend",
    _id: id,
    _parent: { $ref: sourceUseCaseId },
    source: { $ref: sourceUseCaseId },
    target: { $ref: targetUseCaseId }
  };
}

// --- Sequence Diagram Semantic Nodes ---

export function createUMLLifelineNode(
  id: string,
  parentId: string,
  name: string,
  representClassId?: string
): StarUMLNode {
  const node: StarUMLNode = {
    _type: "UMLLifeline",
    _id: id,
    _parent: { $ref: parentId },
    name
  };
  if (representClassId) {
    node.represent = { $ref: representClassId };
  }
  return node;
}

export function createUMLMessageNode(
  id: string,
  parentId: string,
  name: string,
  sourceLifelineId: string,
  targetLifelineId: string,
  messageSort: "synchCall" | "asynchCall" | "reply" = "synchCall"
): StarUMLNode {
  return {
    _type: "UMLMessage",
    _id: id,
    _parent: { $ref: parentId },
    name,
    source: { $ref: sourceLifelineId },
    target: { $ref: targetLifelineId },
    messageSort
  };
}

export function createUMLInteractionNode(
  id: string,
  parentId: string,
  name: string,
  lifelines: StarUMLNode[] = [],
  messages: StarUMLNode[] = [],
  ownedElements: StarUMLNode[] = []
): StarUMLNode {
  return {
    _type: "UMLInteraction",
    _id: id,
    _parent: { $ref: parentId },
    name,
    participants: lifelines,
    messages,
    ownedElements
  };
}

// ==========================================
// VIEW NODES & DIAGRAM LAYER
// ==========================================

export function createUMLClassDiagramNode(
  id: string,
  parentId: string,
  name: string,
  ownedViews: StarUMLNode[] = []
): StarUMLNode {
  return {
    _type: "UMLClassDiagram",
    _id: id,
    _parent: { $ref: parentId },
    name,
    defaultDiagram: true,
    ownedViews
  };
}

export function createUMLUseCaseDiagramNode(
  id: string,
  parentId: string,
  name: string,
  ownedViews: StarUMLNode[] = []
): StarUMLNode {
  return {
    _type: "UMLUseCaseDiagram",
    _id: id,
    _parent: { $ref: parentId },
    name,
    defaultDiagram: true,
    ownedViews
  };
}

export function createUMLSequenceDiagramNode(
  id: string,
  parentId: string,
  name: string,
  ownedViews: StarUMLNode[] = []
): StarUMLNode {
  return {
    _type: "UMLSequenceDiagram",
    _id: id,
    _parent: { $ref: parentId },
    name,
    defaultDiagram: true,
    ownedViews
  };
}

// --- Class & Interface Views ---

export function createUMLClassViewNode(
  viewId: string,
  diagramId: string,
  modelId: string,
  className: string,
  bounds: { left: number; top: number; width: number; height: number },
  options: {
    stereotype?: string;
    attributes?: Array<{ id: string; name: string; type: string; visibility?: string }>;
    operations?: Array<{ id: string; name: string; returnType?: string; visibility?: string; parameters?: Array<{ name: string; type: string }> }>;
  } = {}
): StarUMLNode {
  const isInterface = options.stereotype?.toLowerCase() === "interface";
  const viewType = isInterface ? "UMLInterfaceView" : "UMLClassView";

  const nameCompId = generateStarUMLId();
  const stereoLabelId = generateStarUMLId();
  const nameLabelId = generateStarUMLId();
  const nsLabelId = generateStarUMLId();
  const propLabelId = generateStarUMLId();

  const attrCompId = generateStarUMLId();
  const opCompId = generateStarUMLId();
  const recCompId = generateStarUMLId();
  const tmplCompId = generateStarUMLId();

  // Labels inside NameCompartment
  const hasStereo = !!options.stereotype;
  const nameCompHeight = hasStereo ? 38 : 25;

  const nameSubViews: StarUMLNode[] = [
    {
      _type: "LabelView",
      _id: stereoLabelId,
      _parent: { $ref: nameCompId },
      visible: hasStereo,
      font: "Arial;13;0",
      left: bounds.left + 5,
      top: bounds.top + 5,
      width: bounds.width - 10,
      height: 13,
      text: hasStereo ? `«${options.stereotype}»` : ""
    },
    {
      _type: "LabelView",
      _id: nameLabelId,
      _parent: { $ref: nameCompId },
      font: "Arial;13;1",
      left: bounds.left + 5,
      top: bounds.top + (hasStereo ? 20 : 6),
      width: bounds.width - 10,
      height: 13,
      text: className
    },
    {
      _type: "LabelView",
      _id: nsLabelId,
      _parent: { $ref: nameCompId },
      visible: false,
      font: "Arial;13;0",
      height: 13
    },
    {
      _type: "LabelView",
      _id: propLabelId,
      _parent: { $ref: nameCompId },
      visible: false,
      font: "Arial;13;0",
      height: 13,
      horizontalAlignment: 1
    }
  ];

  const nameCompartment: StarUMLNode = {
    _type: "UMLNameCompartmentView",
    _id: nameCompId,
    _parent: { $ref: viewId },
    model: { $ref: modelId },
    subViews: nameSubViews,
    font: "Arial;13;0",
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: nameCompHeight,
    stereotypeLabel: { $ref: stereoLabelId },
    nameLabel: { $ref: nameLabelId },
    namespaceLabel: { $ref: nsLabelId },
    propertyLabel: { $ref: propLabelId }
  };

  // Attribute Compartment SubViews
  const attrList = options.attributes ?? [];
  let currentTop = bounds.top + nameCompHeight;
  const attrViews: StarUMLNode[] = [];

  for (const attr of attrList) {
    const attrViewId = generateStarUMLId();
    const visChar = getVisibilityPrefix(attr.visibility);
    const attrText = `${visChar}${attr.name}: ${attr.type}`;

    attrViews.push({
      _type: "UMLAttributeView",
      _id: attrViewId,
      _parent: { $ref: attrCompId },
      model: { $ref: attr.id },
      font: "Arial;13;0",
      left: bounds.left + 5,
      top: currentTop,
      width: bounds.width - 10,
      height: 13,
      text: attrText,
      horizontalAlignment: 0
    });
    currentTop += 15;
  }

  const attrCompHeight = Math.max(10, attrViews.length * 15 + 4);
  const attrCompartment: StarUMLNode = {
    _type: "UMLAttributeCompartmentView",
    _id: attrCompId,
    _parent: { $ref: viewId },
    model: { $ref: modelId },
    subViews: attrViews,
    font: "Arial;13;0",
    left: bounds.left,
    top: bounds.top + nameCompHeight,
    width: bounds.width,
    height: attrCompHeight
  };

  // Operation Compartment SubViews
  const opList = options.operations ?? [];
  const opTop = bounds.top + nameCompHeight + attrCompHeight;
  let currentOpTop = opTop;
  const opViews: StarUMLNode[] = [];

  for (const op of opList) {
    const opViewId = generateStarUMLId();
    const visChar = getVisibilityPrefix(op.visibility);
    const paramsStr = (op.parameters ?? []).map((p) => `${p.name}: ${p.type}`).join(", ");
    const retStr = op.returnType && op.returnType !== "void" ? `: ${op.returnType}` : "";
    const opText = `${visChar}${op.name}(${paramsStr})${retStr}`;

    opViews.push({
      _type: "UMLOperationView",
      _id: opViewId,
      _parent: { $ref: opCompId },
      model: { $ref: op.id },
      font: "Arial;13;0",
      left: bounds.left + 5,
      top: currentOpTop,
      width: bounds.width - 10,
      height: 13,
      text: opText,
      horizontalAlignment: 0
    });
    currentOpTop += 15;
  }

  const opCompHeight = Math.max(10, opViews.length * 15 + 4);
  const opCompartment: StarUMLNode = {
    _type: "UMLOperationCompartmentView",
    _id: opCompId,
    _parent: { $ref: viewId },
    model: { $ref: modelId },
    subViews: opViews,
    font: "Arial;13;0",
    left: bounds.left,
    top: opTop,
    width: bounds.width,
    height: opCompHeight
  };

  const receptionCompartment: StarUMLNode = {
    _type: "UMLReceptionCompartmentView",
    _id: recCompId,
    _parent: { $ref: viewId },
    model: { $ref: modelId },
    visible: false,
    font: "Arial;13;0",
    width: 10,
    height: 10
  };

  const templateCompartment: StarUMLNode = {
    _type: "UMLTemplateParameterCompartmentView",
    _id: tmplCompId,
    _parent: { $ref: viewId },
    model: { $ref: modelId },
    visible: false,
    font: "Arial;13;0",
    width: 10,
    height: 10
  };

  return {
    _type: viewType,
    _id: viewId,
    _parent: { $ref: diagramId },
    model: { $ref: modelId },
    subViews: [nameCompartment, attrCompartment, opCompartment, receptionCompartment, templateCompartment],
    font: "Arial;13;0",
    containerChangeable: true,
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: bounds.height,
    nameCompartment: { $ref: nameCompId },
    attributeCompartment: { $ref: attrCompId },
    operationCompartment: { $ref: opCompId },
    receptionCompartment: { $ref: recCompId },
    templateParameterCompartment: { $ref: tmplCompId }
  };
}

function getVisibilityPrefix(visibility?: string): string {
  switch (visibility) {
    case "private":
      return "-";
    case "protected":
      return "#";
    case "package":
      return "~";
    case "public":
    default:
      return "+";
  }
}

// --- Edge Views (Generalization, Realization, Dependency, Association) ---

export function createUMLConnectionViewNode(
  viewType: "UMLGeneralizationView" | "UMLInterfaceRealizationView" | "UMLDependencyView",
  viewId: string,
  diagramId: string,
  modelId: string,
  tailViewId: string,
  headViewId: string,
  pointsString: string,
  options: {
    name?: string;
  } = {}
): StarUMLNode {
  const nameLabelId = generateStarUMLId();
  const stereoLabelId = generateStarUMLId();
  const propLabelId = generateStarUMLId();

  const subViews: StarUMLNode[] = [
    {
      _type: "EdgeLabelView",
      _id: nameLabelId,
      _parent: { $ref: viewId },
      model: { $ref: modelId },
      visible: !!options.name,
      font: "Arial;13;0",
      height: 13,
      alpha: 1.5707963267948966,
      distance: 15,
      hostEdge: { $ref: viewId },
      edgePosition: 1,
      text: options.name ?? ""
    },
    {
      _type: "EdgeLabelView",
      _id: stereoLabelId,
      _parent: { $ref: viewId },
      model: { $ref: modelId },
      visible: false,
      font: "Arial;13;0",
      height: 13,
      alpha: 1.5707963267948966,
      distance: 30,
      hostEdge: { $ref: viewId },
      edgePosition: 1
    },
    {
      _type: "EdgeLabelView",
      _id: propLabelId,
      _parent: { $ref: viewId },
      model: { $ref: modelId },
      visible: false,
      font: "Arial;13;0",
      height: 13,
      alpha: -1.5707963267948966,
      distance: 15,
      hostEdge: { $ref: viewId },
      edgePosition: 1
    }
  ];

  return {
    _type: viewType,
    _id: viewId,
    _parent: { $ref: diagramId },
    model: { $ref: modelId },
    subViews,
    font: "Arial;13;0",
    lineColor: "#000000",
    head: { $ref: headViewId },
    tail: { $ref: tailViewId },
    lineStyle: 1,
    points: pointsString,
    showVisibility: true,
    nameLabel: { $ref: nameLabelId },
    stereotypeLabel: { $ref: stereoLabelId },
    propertyLabel: { $ref: propLabelId }
  };
}

export function createUMLAssociationViewNode(
  viewId: string,
  diagramId: string,
  modelId: string,
  tailViewId: string,
  headViewId: string,
  pointsString: string,
  end1Id: string,
  end2Id: string,
  options: {
    name?: string;
    sourceMultiplicity?: string;
    targetMultiplicity?: string;
  } = {}
): StarUMLNode {
  const nameLabelId = generateStarUMLId();
  const stereoLabelId = generateStarUMLId();
  const propLabelId = generateStarUMLId();
  const tailRoleNameLabelId = generateStarUMLId();
  const tailPropertyLabelId = generateStarUMLId();
  const tailMultiplicityLabelId = generateStarUMLId();
  const headRoleNameLabelId = generateStarUMLId();
  const headPropertyLabelId = generateStarUMLId();
  const headMultiplicityLabelId = generateStarUMLId();
  const tailQualifiersCompartmentId = generateStarUMLId();
  const headQualifiersCompartmentId = generateStarUMLId();

  const subViews: StarUMLNode[] = [
    {
      _type: "EdgeLabelView",
      _id: nameLabelId,
      _parent: { $ref: viewId },
      model: { $ref: modelId },
      visible: !!options.name,
      font: "Arial;13;0",
      height: 13,
      alpha: 1.5707963267948966,
      distance: 15,
      hostEdge: { $ref: viewId },
      edgePosition: 1,
      text: options.name ?? ""
    },
    {
      _type: "EdgeLabelView",
      _id: stereoLabelId,
      _parent: { $ref: viewId },
      model: { $ref: modelId },
      visible: false,
      font: "Arial;13;0",
      height: 13,
      alpha: 1.5707963267948966,
      distance: 30,
      hostEdge: { $ref: viewId },
      edgePosition: 1
    },
    {
      _type: "EdgeLabelView",
      _id: propLabelId,
      _parent: { $ref: viewId },
      model: { $ref: modelId },
      visible: false,
      font: "Arial;13;0",
      height: 13,
      alpha: -1.5707963267948966,
      distance: 15,
      hostEdge: { $ref: viewId },
      edgePosition: 1
    },
    {
      _type: "EdgeLabelView",
      _id: tailRoleNameLabelId,
      _parent: { $ref: viewId },
      model: { $ref: end1Id },
      visible: false,
      font: "Arial;13;0",
      height: 13,
      alpha: 0.5235987755982988,
      distance: 30,
      hostEdge: { $ref: viewId },
      edgePosition: 2
    },
    {
      _type: "EdgeLabelView",
      _id: tailPropertyLabelId,
      _parent: { $ref: viewId },
      model: { $ref: end1Id },
      visible: false,
      font: "Arial;13;0",
      height: 13,
      alpha: -0.7853981633974483,
      distance: 40,
      hostEdge: { $ref: viewId },
      edgePosition: 2
    },
    {
      _type: "EdgeLabelView",
      _id: tailMultiplicityLabelId,
      _parent: { $ref: viewId },
      model: { $ref: end1Id },
      visible: !!options.sourceMultiplicity,
      font: "Arial;13;0",
      height: 13,
      alpha: -0.5235987755982988,
      distance: 25,
      hostEdge: { $ref: viewId },
      edgePosition: 2,
      text: options.sourceMultiplicity ?? ""
    },
    {
      _type: "EdgeLabelView",
      _id: headRoleNameLabelId,
      _parent: { $ref: viewId },
      model: { $ref: end2Id },
      visible: false,
      font: "Arial;13;0",
      height: 13,
      alpha: -0.5235987755982988,
      distance: 30,
      hostEdge: { $ref: viewId },
      edgePosition: 0
    },
    {
      _type: "EdgeLabelView",
      _id: headPropertyLabelId,
      _parent: { $ref: viewId },
      model: { $ref: end2Id },
      visible: false,
      font: "Arial;13;0",
      height: 13,
      alpha: 0.7853981633974483,
      distance: 40,
      hostEdge: { $ref: viewId },
      edgePosition: 0
    },
    {
      _type: "EdgeLabelView",
      _id: headMultiplicityLabelId,
      _parent: { $ref: viewId },
      model: { $ref: end2Id },
      visible: !!options.targetMultiplicity,
      font: "Arial;13;0",
      height: 13,
      alpha: 0.5235987755982988,
      distance: 25,
      hostEdge: { $ref: viewId },
      edgePosition: 0,
      text: options.targetMultiplicity ?? ""
    },
    {
      _type: "UMLQualifierCompartmentView",
      _id: tailQualifiersCompartmentId,
      _parent: { $ref: viewId },
      model: { $ref: end1Id },
      visible: false,
      font: "Arial;13;0",
      parentStyle: true,
      width: 10,
      height: 10
    },
    {
      _type: "UMLQualifierCompartmentView",
      _id: headQualifiersCompartmentId,
      _parent: { $ref: viewId },
      model: { $ref: end2Id },
      visible: false,
      font: "Arial;13;0",
      parentStyle: true,
      width: 10,
      height: 10
    }
  ];

  return {
    _type: "UMLAssociationView",
    _id: viewId,
    _parent: { $ref: diagramId },
    model: { $ref: modelId },
    subViews,
    font: "Arial;13;0",
    lineColor: "#000000",
    head: { $ref: headViewId },
    tail: { $ref: tailViewId },
    lineStyle: 1,
    points: pointsString,
    showVisibility: true,
    nameLabel: { $ref: nameLabelId },
    stereotypeLabel: { $ref: stereoLabelId },
    propertyLabel: { $ref: propLabelId },
    tailRoleNameLabel: { $ref: tailRoleNameLabelId },
    tailPropertyLabel: { $ref: tailPropertyLabelId },
    tailMultiplicityLabel: { $ref: tailMultiplicityLabelId },
    headRoleNameLabel: { $ref: headRoleNameLabelId },
    headPropertyLabel: { $ref: headPropertyLabelId },
    headMultiplicityLabel: { $ref: headMultiplicityLabelId },
    tailQualifiersCompartment: { $ref: tailQualifiersCompartmentId },
    headQualifiersCompartment: { $ref: headQualifiersCompartmentId }
  };
}


// --- Use Case Views ---

export function createUMLActorViewNode(
  viewId: string,
  diagramId: string,
  modelId: string,
  actorName: string,
  bounds: { left: number; top: number; width: number; height: number }
): StarUMLNode {
  const nameCompId = generateStarUMLId();
  const stereoLabelId = generateStarUMLId();
  const nameLabelId = generateStarUMLId();
  const nsLabelId = generateStarUMLId();
  const propLabelId = generateStarUMLId();

  const nameCompartment: StarUMLNode = {
    _type: "UMLNameCompartmentView",
    _id: nameCompId,
    _parent: { $ref: viewId },
    model: { $ref: modelId },
    subViews: [
      {
        _type: "LabelView",
        _id: stereoLabelId,
        _parent: { $ref: nameCompId },
        visible: false,
        font: "Arial;13;0",
        height: 13
      },
      {
        _type: "LabelView",
        _id: nameLabelId,
        _parent: { $ref: nameCompId },
        font: "Arial;13;1",
        left: bounds.left + 5,
        top: bounds.top + bounds.height - 25,
        width: bounds.width - 10,
        height: 15,
        text: actorName,
        wordWrap: true
      },
      {
        _type: "LabelView",
        _id: nsLabelId,
        _parent: { $ref: nameCompId },
        visible: false,
        font: "Arial;13;0",
        height: 13
      },
      {
        _type: "LabelView",
        _id: propLabelId,
        _parent: { $ref: nameCompId },
        visible: false,
        font: "Arial;13;0",
        height: 13,
        horizontalAlignment: 1
      }
    ],
    font: "Arial;13;0",
    left: bounds.left,
    top: bounds.top + bounds.height - 30,
    width: bounds.width,
    height: 25,
    stereotypeLabel: { $ref: stereoLabelId },
    nameLabel: { $ref: nameLabelId },
    namespaceLabel: { $ref: nsLabelId },
    propertyLabel: { $ref: propLabelId }
  };

  const attrCompId = generateStarUMLId();
  const opCompId = generateStarUMLId();

  return {
    _type: "UMLActorView",
    _id: viewId,
    _parent: { $ref: diagramId },
    model: { $ref: modelId },
    subViews: [
      nameCompartment,
      {
        _type: "UMLAttributeCompartmentView",
        _id: attrCompId,
        _parent: { $ref: viewId },
        model: { $ref: modelId },
        visible: false,
        font: "Arial;13;0",
        width: 10,
        height: 10
      },
      {
        _type: "UMLOperationCompartmentView",
        _id: opCompId,
        _parent: { $ref: viewId },
        model: { $ref: modelId },
        visible: false,
        font: "Arial;13;0",
        width: 10,
        height: 10
      }
    ],
    font: "Arial;13;0",
    containerChangeable: true,
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: bounds.height,
    nameCompartment: { $ref: nameCompId },
    wordWrap: true,
    suppressAttributes: true,
    suppressOperations: true,
    attributeCompartment: { $ref: attrCompId },
    operationCompartment: { $ref: opCompId }
  };
}

export function createUMLUseCaseViewNode(
  viewId: string,
  diagramId: string,
  modelId: string,
  useCaseName: string,
  bounds: { left: number; top: number; width: number; height: number }
): StarUMLNode {
  const nameCompId = generateStarUMLId();
  const stereoLabelId = generateStarUMLId();
  const nameLabelId = generateStarUMLId();
  const nsLabelId = generateStarUMLId();
  const propLabelId = generateStarUMLId();

  const nameCompartment: StarUMLNode = {
    _type: "UMLNameCompartmentView",
    _id: nameCompId,
    _parent: { $ref: viewId },
    model: { $ref: modelId },
    subViews: [
      {
        _type: "LabelView",
        _id: stereoLabelId,
        _parent: { $ref: nameCompId },
        visible: false,
        font: "Arial;13;0",
        height: 13
      },
      {
        _type: "LabelView",
        _id: nameLabelId,
        _parent: { $ref: nameCompId },
        font: "Arial;13;1",
        left: bounds.left + 10,
        top: bounds.top + Math.round((bounds.height - 15) / 2),
        width: bounds.width - 20,
        height: 15,
        text: useCaseName,
        wordWrap: true
      },
      {
        _type: "LabelView",
        _id: nsLabelId,
        _parent: { $ref: nameCompId },
        visible: false,
        font: "Arial;13;0",
        height: 13
      },
      {
        _type: "LabelView",
        _id: propLabelId,
        _parent: { $ref: nameCompId },
        visible: false,
        font: "Arial;13;0",
        height: 13,
        horizontalAlignment: 1
      }
    ],
    font: "Arial;13;0",
    left: bounds.left + 5,
    top: bounds.top + Math.round((bounds.height - 20) / 2),
    width: bounds.width - 10,
    height: 20,
    stereotypeLabel: { $ref: stereoLabelId },
    nameLabel: { $ref: nameLabelId },
    namespaceLabel: { $ref: nsLabelId },
    propertyLabel: { $ref: propLabelId }
  };

  return {
    _type: "UMLUseCaseView",
    _id: viewId,
    _parent: { $ref: diagramId },
    model: { $ref: modelId },
    subViews: [nameCompartment],
    font: "Arial;13;0",
    containerChangeable: true,
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: bounds.height,
    nameCompartment: { $ref: nameCompId },
    wordWrap: true
  };
}

export function createUMLUseCaseSubjectViewNode(
  viewId: string,
  diagramId: string,
  modelId: string,
  subjectName: string,
  bounds: { left: number; top: number; width: number; height: number }
): StarUMLNode {
  const nameCompId = generateStarUMLId();
  const stereoLabelId = generateStarUMLId();
  const nameLabelId = generateStarUMLId();
  const nsLabelId = generateStarUMLId();
  const propLabelId = generateStarUMLId();

  const nameCompartment: StarUMLNode = {
    _type: "UMLNameCompartmentView",
    _id: nameCompId,
    _parent: { $ref: viewId },
    model: { $ref: modelId },
    subViews: [
      {
        _type: "LabelView",
        _id: stereoLabelId,
        _parent: { $ref: nameCompId },
        visible: false,
        font: "Arial;13;0",
        height: 13
      },
      {
        _type: "LabelView",
        _id: nameLabelId,
        _parent: { $ref: nameCompId },
        font: "Arial;13;1",
        left: bounds.left + 5,
        top: bounds.top + 7,
        width: Math.max(10, bounds.width - 10),
        height: 13,
        text: subjectName
      },
      {
        _type: "LabelView",
        _id: nsLabelId,
        _parent: { $ref: nameCompId },
        visible: false,
        font: "Arial;13;0",
        width: Math.max(10, bounds.width - 10),
        height: 13
      },
      {
        _type: "LabelView",
        _id: propLabelId,
        _parent: { $ref: nameCompId },
        visible: false,
        font: "Arial;13;0",
        height: 13,
        horizontalAlignment: 1
      }
    ],
    font: "Arial;13;0",
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: 25,
    stereotypeLabel: { $ref: stereoLabelId },
    nameLabel: { $ref: nameLabelId },
    namespaceLabel: { $ref: nsLabelId },
    propertyLabel: { $ref: propLabelId }
  };

  return {
    _type: "UMLUseCaseSubjectView",
    _id: viewId,
    _parent: { $ref: diagramId },
    model: { $ref: modelId },
    subViews: [nameCompartment],
    font: "Arial;13;0",
    containerChangeable: true,
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: bounds.height,
    nameCompartment: { $ref: nameCompId }
  };
}

export function createUMLIncludeViewNode(
  viewId: string,
  diagramId: string,
  modelId: string,
  tailViewId: string,
  headViewId: string,
  pointsString: string
): StarUMLNode {
  const nameLabelId = generateStarUMLId();
  const stereoLabelId = generateStarUMLId();

  return {
    _type: "UMLIncludeView",
    _id: viewId,
    _parent: { $ref: diagramId },
    model: { $ref: modelId },
    subViews: [
      {
        _type: "EdgeLabelView",
        _id: nameLabelId,
        _parent: { $ref: viewId },
        model: { $ref: modelId },
        visible: false,
        font: "Arial;13;0",
        height: 13,
        alpha: 1.5707963267948966,
        distance: 15,
        hostEdge: { $ref: viewId },
        edgePosition: 1
      },
      {
        _type: "EdgeLabelView",
        _id: stereoLabelId,
        _parent: { $ref: viewId },
        model: { $ref: modelId },
        visible: true,
        font: "Arial;13;0",
        height: 13,
        alpha: 1.5707963267948966,
        distance: 25,
        hostEdge: { $ref: viewId },
        edgePosition: 1,
        text: "«include»"
      }
    ],
    font: "Arial;13;0",
    lineColor: "#000000",
    head: { $ref: headViewId },
    tail: { $ref: tailViewId },
    lineStyle: 1,
    points: pointsString,
    nameLabel: { $ref: nameLabelId },
    stereotypeLabel: { $ref: stereoLabelId }
  };
}

export function createUMLExtendViewNode(
  viewId: string,
  diagramId: string,
  modelId: string,
  tailViewId: string,
  headViewId: string,
  pointsString: string
): StarUMLNode {
  const nameLabelId = generateStarUMLId();
  const stereoLabelId = generateStarUMLId();

  return {
    _type: "UMLExtendView",
    _id: viewId,
    _parent: { $ref: diagramId },
    model: { $ref: modelId },
    subViews: [
      {
        _type: "EdgeLabelView",
        _id: nameLabelId,
        _parent: { $ref: viewId },
        model: { $ref: modelId },
        visible: false,
        font: "Arial;13;0",
        height: 13,
        alpha: 1.5707963267948966,
        distance: 15,
        hostEdge: { $ref: viewId },
        edgePosition: 1
      },
      {
        _type: "EdgeLabelView",
        _id: stereoLabelId,
        _parent: { $ref: viewId },
        model: { $ref: modelId },
        visible: true,
        font: "Arial;13;0",
        height: 13,
        alpha: 1.5707963267948966,
        distance: 25,
        hostEdge: { $ref: viewId },
        edgePosition: 1,
        text: "«extend»"
      }
    ],
    font: "Arial;13;0",
    lineColor: "#000000",
    head: { $ref: headViewId },
    tail: { $ref: tailViewId },
    lineStyle: 1,
    points: pointsString,
    nameLabel: { $ref: nameLabelId },
    stereotypeLabel: { $ref: stereoLabelId }
  };
}

// --- Sequence Views ---

export function createUMLSeqLifelineViewNode(
  viewId: string,
  diagramId: string,
  modelId: string,
  lifelineName: string,
  bounds: { left: number; top: number; width: number; height: number },
  linePartId: string
): StarUMLNode {
  const nameCompId = generateStarUMLId();
  const stereoLabelId = generateStarUMLId();
  const nameLabelId = generateStarUMLId();
  const nsLabelId = generateStarUMLId();
  const propLabelId = generateStarUMLId();

  const nameCompartment: StarUMLNode = {
    _type: "UMLNameCompartmentView",
    _id: nameCompId,
    _parent: { $ref: viewId },
    model: { $ref: modelId },
    subViews: [
      {
        _type: "LabelView",
        _id: stereoLabelId,
        _parent: { $ref: nameCompId },
        visible: false,
        font: "Arial;13;0",
        height: 13
      },
      {
        _type: "LabelView",
        _id: nameLabelId,
        _parent: { $ref: nameCompId },
        font: "Arial;13;1",
        left: bounds.left + 5,
        top: bounds.top + 7,
        width: bounds.width - 10,
        height: 13,
        text: lifelineName
      },
      {
        _type: "LabelView",
        _id: nsLabelId,
        _parent: { $ref: nameCompId },
        visible: false,
        font: "Arial;13;0",
        height: 13
      },
      {
        _type: "LabelView",
        _id: propLabelId,
        _parent: { $ref: nameCompId },
        visible: false,
        font: "Arial;13;0",
        height: 13,
        horizontalAlignment: 1
      }
    ],
    font: "Arial;13;0",
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: 40,
    stereotypeLabel: { $ref: stereoLabelId },
    nameLabel: { $ref: nameLabelId },
    namespaceLabel: { $ref: nsLabelId },
    propertyLabel: { $ref: propLabelId }
  };

  const linePart: StarUMLNode = {
    _type: "UMLLinePartView",
    _id: linePartId,
    _parent: { $ref: viewId },
    model: { $ref: modelId },
    font: "Arial;13;0",
    left: bounds.left + Math.round(bounds.width / 2),
    top: bounds.top + 40,
    width: 1,
    height: bounds.height - 40
  };

  return {
    _type: "UMLSeqLifelineView",
    _id: viewId,
    _parent: { $ref: diagramId },
    model: { $ref: modelId },
    subViews: [nameCompartment, linePart],
    font: "Arial;13;0",
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: bounds.height,
    nameCompartment: { $ref: nameCompId },
    lineCompartment: { $ref: linePartId }
  };
}

export function createUMLSeqMessageViewNode(
  viewId: string,
  diagramId: string,
  modelId: string,
  messageName: string,
  tailLinePartId: string,
  headLinePartId: string,
  pointsString: string,
  messageSort: "synchCall" | "asynchCall" | "reply",
  labelBounds: { left: number; top: number; width: number }
): StarUMLNode {
  const nameLabelId = generateStarUMLId();
  const stereoLabelId = generateStarUMLId();
  const propLabelId = generateStarUMLId();
  const activationId = generateStarUMLId();

  // Extract head coordinates from pointsString for activation view
  const pts = pointsString.split(";");
  const lastPt = pts[pts.length - 1] ?? "100:100";
  const [headXStr, headYStr] = lastPt.split(":");
  const headX = parseInt(headXStr, 10) || 100;
  const headY = parseInt(headYStr, 10) || 100;

  const activationView: StarUMLNode = {
    _type: "UMLActivationView",
    _id: activationId,
    _parent: { $ref: viewId },
    model: { $ref: modelId },
    font: "Arial;13;0",
    left: headX - 7,
    top: headY,
    width: 14,
    height: 30
  };

  return {
    _type: "UMLSeqMessageView",
    _id: viewId,
    _parent: { $ref: diagramId },
    model: { $ref: modelId },
    subViews: [
      {
        _type: "EdgeLabelView",
        _id: nameLabelId,
        _parent: { $ref: viewId },
        model: { $ref: modelId },
        font: "Arial;13;0",
        left: labelBounds.left,
        top: labelBounds.top,
        width: labelBounds.width,
        height: 13,
        alpha: -1.5707963267948966,
        distance: 10,
        hostEdge: { $ref: viewId },
        edgePosition: 1,
        text: messageName
      },
      {
        _type: "EdgeLabelView",
        _id: stereoLabelId,
        _parent: { $ref: viewId },
        model: { $ref: modelId },
        visible: false,
        font: "Arial;13;0",
        height: 13,
        alpha: 1.5707963267948966,
        distance: 25,
        hostEdge: { $ref: viewId },
        edgePosition: 1
      },
      {
        _type: "EdgeLabelView",
        _id: propLabelId,
        _parent: { $ref: viewId },
        model: { $ref: modelId },
        visible: false,
        font: "Arial;13;0",
        height: 13,
        alpha: -1.5707963267948966,
        distance: 10,
        hostEdge: { $ref: viewId },
        edgePosition: 1
      },
      activationView
    ],
    font: "Arial;13;0",
    head: { $ref: headLinePartId },
    tail: { $ref: tailLinePartId },
    points: pointsString,
    messageSort,
    nameLabel: { $ref: nameLabelId },
    stereotypeLabel: { $ref: stereoLabelId },
    propertyLabel: { $ref: propLabelId },
    activation: { $ref: activationId }
  };
}

// --- Activity Diagram Semantic Nodes & Views ---

export function createUMLActivityNode(
  id: string,
  parentId: string,
  name: string,
  nodes: StarUMLNode[] = [],
  edges: StarUMLNode[] = [],
  ownedElements: StarUMLNode[] = []
): StarUMLNode {
  return {
    _type: "UMLActivity",
    _id: id,
    _parent: { $ref: parentId },
    name,
    ownedElements,
    nodes,
    edges
  };
}

export function createUMLActionNode(id: string, parentId: string, name: string): StarUMLNode {
  return {
    _type: "UMLAction",
    _id: id,
    _parent: { $ref: parentId },
    name
  };
}

export function createUMLControlNode(
  nodeType: "UMLInitialNode" | "UMLActivityFinalNode" | "UMLFlowFinalNode" | "UMLDecisionNode" | "UMLMergeNode" | "UMLForkNode" | "UMLJoinNode",
  id: string,
  parentId: string,
  name: string
): StarUMLNode {
  return {
    _type: nodeType,
    _id: id,
    _parent: { $ref: parentId },
    name
  };
}

export function createUMLControlFlowNode(
  id: string,
  parentId: string,
  sourceId: string,
  targetId: string,
  name?: string,
  guard?: string
): StarUMLNode {
  const node: StarUMLNode = {
    _type: "UMLControlFlow",
    _id: id,
    _parent: { $ref: parentId },
    source: { $ref: sourceId },
    target: { $ref: targetId }
  };
  if (name) node.name = name;
  if (guard) node.guard = guard;
  return node;
}

export function createUMLActivityDiagramNode(
  id: string,
  parentId: string,
  name: string,
  ownedViews: StarUMLNode[] = []
): StarUMLNode {
  return {
    _type: "UMLActivityDiagram",
    _id: id,
    _parent: { $ref: parentId },
    name,
    ownedViews
  };
}

export function createUMLActionViewNode(
  viewId: string,
  diagramId: string,
  modelId: string,
  actionName: string,
  bounds: { left: number; top: number; width: number; height: number }
): StarUMLNode {
  const nameCompId = generateStarUMLId();
  const nameLabelId = generateStarUMLId();

  return {
    _type: "UMLActionView",
    _id: viewId,
    _parent: { $ref: diagramId },
    model: { $ref: modelId },
    subViews: [
      {
        _type: "UMLNameCompartmentView",
        _id: nameCompId,
        _parent: { $ref: viewId },
        model: { $ref: modelId },
        subViews: [
          {
            _type: "LabelView",
            _id: nameLabelId,
            _parent: { $ref: nameCompId },
            font: "Arial;13;0",
            left: bounds.left + 5,
            top: bounds.top + Math.floor((bounds.height - 15) / 2),
            width: bounds.width - 10,
            height: 13,
            text: actionName
          }
        ],
        font: "Arial;13;0",
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
        nameLabel: { $ref: nameLabelId }
      }
    ],
    font: "Arial;13;0",
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: bounds.height,
    nameCompartment: { $ref: nameCompId }
  };
}

export function createUMLControlNodeViewNode(
  viewId: string,
  diagramId: string,
  modelId: string,
  bounds: { left: number; top: number; width: number; height: number }
): StarUMLNode {
  return {
    _type: "UMLControlNodeView",
    _id: viewId,
    _parent: { $ref: diagramId },
    model: { $ref: modelId },
    font: "Arial;13;0",
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: bounds.height
  };
}

// --- Generic Edge View Node ---

export function createUMLGenericEdgeViewNode(
  viewType: string,
  viewId: string,
  diagramId: string,
  modelId: string,
  tailViewId: string,
  headViewId: string,
  pointsString: string,
  options: { name?: string; label?: string } = {}
): StarUMLNode {
  const nameLabelId = generateStarUMLId();
  const labelText = options.name ?? options.label ?? "";

  return {
    _type: viewType,
    _id: viewId,
    _parent: { $ref: diagramId },
    model: { $ref: modelId },
    subViews: [
      {
        _type: "EdgeLabelView",
        _id: nameLabelId,
        _parent: { $ref: viewId },
        model: { $ref: modelId },
        visible: !!labelText,
        font: "Arial;13;0",
        height: 13,
        alpha: 1.5707963267948966,
        distance: 15,
        hostEdge: { $ref: viewId },
        edgePosition: 1,
        text: labelText
      }
    ],
    font: "Arial;13;0",
    lineColor: "#000000",
    head: { $ref: headViewId },
    tail: { $ref: tailViewId },
    lineStyle: 1,
    points: pointsString,
    nameLabel: { $ref: nameLabelId }
  };
}

// --- State Machine Diagram Semantic Nodes & Views ---

export function createUMLStateMachineNode(
  id: string,
  parentId: string,
  name: string,
  regions: StarUMLNode[] = [],
  ownedElements: StarUMLNode[] = []
): StarUMLNode {
  return {
    _type: "UMLStateMachine",
    _id: id,
    _parent: { $ref: parentId },
    name,
    regions,
    ownedElements
  };
}

export function createUMLRegionNode(
  id: string,
  parentId: string,
  name: string,
  vertices: StarUMLNode[] = [],
  transitions: StarUMLNode[] = []
): StarUMLNode {
  return {
    _type: "UMLRegion",
    _id: id,
    _parent: { $ref: parentId },
    name,
    vertices,
    transitions
  };
}

export function createUMLStateNode(
  id: string,
  parentId: string,
  name: string,
  entry?: string,
  exit?: string,
  doActivity?: string
): StarUMLNode {
  const node: StarUMLNode = {
    _type: "UMLState",
    _id: id,
    _parent: { $ref: parentId },
    name
  };
  if (entry) node.entryActivities = [{ _type: "UMLOpaqueBehavior", _id: generateStarUMLId(), name: entry }];
  if (exit) node.exitActivities = [{ _type: "UMLOpaqueBehavior", _id: generateStarUMLId(), name: exit }];
  if (doActivity) node.doActivities = [{ _type: "UMLOpaqueBehavior", _id: generateStarUMLId(), name: doActivity }];
  return node;
}

export function createUMLPseudostateNode(
  id: string,
  parentId: string,
  kind: "initial" | "choice" | "junction" = "initial",
  name?: string
): StarUMLNode {
  return {
    _type: "UMLPseudostate",
    _id: id,
    _parent: { $ref: parentId },
    name: name ?? kind,
    kind
  };
}

export function createUMLFinalStateNode(id: string, parentId: string, name = "FinalState"): StarUMLNode {
  return {
    _type: "UMLFinalState",
    _id: id,
    _parent: { $ref: parentId },
    name
  };
}

export function createUMLTransitionNode(
  id: string,
  parentId: string,
  sourceId: string,
  targetId: string,
  name?: string,
  guard?: string,
  trigger?: string,
  effect?: string
): StarUMLNode {
  const node: StarUMLNode = {
    _type: "UMLTransition",
    _id: id,
    _parent: { $ref: parentId },
    source: { $ref: sourceId },
    target: { $ref: targetId }
  };
  if (name) node.name = name;
  if (guard) node.guard = guard;
  if (trigger) node.triggers = [{ _type: "UMLEvent", _id: generateStarUMLId(), name: trigger }];
  if (effect) node.effects = [{ _type: "UMLOpaqueBehavior", _id: generateStarUMLId(), name: effect }];
  return node;
}

export function createUMLStatechartDiagramNode(
  id: string,
  parentId: string,
  name: string,
  ownedViews: StarUMLNode[] = []
): StarUMLNode {
  return {
    _type: "UMLStatechartDiagram",
    _id: id,
    _parent: { $ref: parentId },
    name,
    ownedViews
  };
}

export function createUMLStateViewNode(
  viewId: string,
  diagramId: string,
  modelId: string,
  stateName: string,
  bounds: { left: number; top: number; width: number; height: number }
): StarUMLNode {
  const nameCompId = generateStarUMLId();
  const nameLabelId = generateStarUMLId();

  return {
    _type: "UMLStateView",
    _id: viewId,
    _parent: { $ref: diagramId },
    model: { $ref: modelId },
    subViews: [
      {
        _type: "UMLNameCompartmentView",
        _id: nameCompId,
        _parent: { $ref: viewId },
        model: { $ref: modelId },
        subViews: [
          {
            _type: "LabelView",
            _id: nameLabelId,
            _parent: { $ref: nameCompId },
            font: "Arial;13;1",
            left: bounds.left + 5,
            top: bounds.top + 6,
            width: bounds.width - 10,
            height: 13,
            text: stateName
          }
        ],
        font: "Arial;13;0",
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: 25,
        nameLabel: { $ref: nameLabelId }
      }
    ],
    font: "Arial;13;0",
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: bounds.height,
    nameCompartment: { $ref: nameCompId }
  };
}

export function createUMLPseudostateViewNode(
  viewId: string,
  diagramId: string,
  modelId: string,
  bounds: { left: number; top: number; width: number; height: number }
): StarUMLNode {
  return {
    _type: "UMLPseudostateView",
    _id: viewId,
    _parent: { $ref: diagramId },
    model: { $ref: modelId },
    font: "Arial;13;0",
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: bounds.height
  };
}

export function createUMLFinalStateViewNode(
  viewId: string,
  diagramId: string,
  modelId: string,
  bounds: { left: number; top: number; width: number; height: number }
): StarUMLNode {
  return {
    _type: "UMLFinalStateView",
    _id: viewId,
    _parent: { $ref: diagramId },
    model: { $ref: modelId },
    font: "Arial;13;0",
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: bounds.height
  };
}

// --- Component Diagram Semantic Nodes & Views ---

export function createUMLComponentNode(
  id: string,
  parentId: string,
  name: string,
  stereotype?: string
): StarUMLNode {
  const node: StarUMLNode = {
    _type: "UMLComponent",
    _id: id,
    _parent: { $ref: parentId },
    name
  };
  if (stereotype) node.stereotype = stereotype;
  return node;
}

export function createUMLComponentDiagramNode(
  id: string,
  parentId: string,
  name: string,
  ownedViews: StarUMLNode[] = []
): StarUMLNode {
  return {
    _type: "UMLComponentDiagram",
    _id: id,
    _parent: { $ref: parentId },
    name,
    ownedViews
  };
}

export function createUMLComponentViewNode(
  viewId: string,
  diagramId: string,
  modelId: string,
  componentName: string,
  bounds: { left: number; top: number; width: number; height: number },
  stereotype?: string
): StarUMLNode {
  const nameCompId = generateStarUMLId();
  const nameLabelId = generateStarUMLId();
  const stereoLabelId = generateStarUMLId();
  const hasStereo = !!stereotype;

  return {
    _type: "UMLComponentView",
    _id: viewId,
    _parent: { $ref: diagramId },
    model: { $ref: modelId },
    subViews: [
      {
        _type: "UMLNameCompartmentView",
        _id: nameCompId,
        _parent: { $ref: viewId },
        model: { $ref: modelId },
        subViews: [
          {
            _type: "LabelView",
            _id: stereoLabelId,
            _parent: { $ref: nameCompId },
            visible: hasStereo,
            font: "Arial;13;0",
            left: bounds.left + 5,
            top: bounds.top + 5,
            width: bounds.width - 10,
            height: 13,
            text: hasStereo ? `«${stereotype}»` : ""
          },
          {
            _type: "LabelView",
            _id: nameLabelId,
            _parent: { $ref: nameCompId },
            font: "Arial;13;1",
            left: bounds.left + 5,
            top: bounds.top + (hasStereo ? 20 : 6),
            width: bounds.width - 10,
            height: 13,
            text: componentName
          }
        ],
        font: "Arial;13;0",
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: hasStereo ? 38 : 25,
        nameLabel: { $ref: nameLabelId },
        stereotypeLabel: { $ref: stereoLabelId }
      }
    ],
    font: "Arial;13;0",
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: bounds.height,
    nameCompartment: { $ref: nameCompId }
  };
}

// --- Deployment Diagram Semantic Nodes & Views ---

export function createUMLDeploymentNode(
  id: string,
  parentId: string,
  name: string,
  stereotype?: string
): StarUMLNode {
  const node: StarUMLNode = {
    _type: "UMLNode",
    _id: id,
    _parent: { $ref: parentId },
    name
  };
  if (stereotype) node.stereotype = stereotype;
  return node;
}

export function createUMLArtifactNode(id: string, parentId: string, name: string): StarUMLNode {
  return {
    _type: "UMLArtifact",
    _id: id,
    _parent: { $ref: parentId },
    name
  };
}

export function createUMLCommunicationPathNode(
  id: string,
  parentId: string,
  sourceId: string,
  targetId: string,
  name?: string
): StarUMLNode {
  const end1Id = generateStarUMLId();
  const end2Id = generateStarUMLId();
  const node: StarUMLNode = {
    _type: "UMLCommunicationPath",
    _id: id,
    _parent: { $ref: parentId },
    end1: {
      _type: "UMLAssociationEnd",
      _id: end1Id,
      _parent: { $ref: id },
      reference: { $ref: sourceId }
    },
    end2: {
      _type: "UMLAssociationEnd",
      _id: end2Id,
      _parent: { $ref: id },
      reference: { $ref: targetId }
    }
  };
  if (name) node.name = name;
  return node;
}

export function createUMLDeploymentDiagramNode(
  id: string,
  parentId: string,
  name: string,
  ownedViews: StarUMLNode[] = []
): StarUMLNode {
  return {
    _type: "UMLDeploymentDiagram",
    _id: id,
    _parent: { $ref: parentId },
    name,
    ownedViews
  };
}

export function createUMLDeploymentNodeViewNode(
  viewId: string,
  diagramId: string,
  modelId: string,
  nodeName: string,
  bounds: { left: number; top: number; width: number; height: number },
  stereotype?: string
): StarUMLNode {
  const nameCompId = generateStarUMLId();
  const nameLabelId = generateStarUMLId();
  const stereoLabelId = generateStarUMLId();
  const hasStereo = !!stereotype;

  return {
    _type: "UMLNodeView",
    _id: viewId,
    _parent: { $ref: diagramId },
    model: { $ref: modelId },
    subViews: [
      {
        _type: "UMLNameCompartmentView",
        _id: nameCompId,
        _parent: { $ref: viewId },
        model: { $ref: modelId },
        subViews: [
          {
            _type: "LabelView",
            _id: stereoLabelId,
            _parent: { $ref: nameCompId },
            visible: hasStereo,
            font: "Arial;13;0",
            left: bounds.left + 5,
            top: bounds.top + 5,
            width: bounds.width - 10,
            height: 13,
            text: hasStereo ? `«${stereotype}»` : ""
          },
          {
            _type: "LabelView",
            _id: nameLabelId,
            _parent: { $ref: nameCompId },
            font: "Arial;13;1",
            left: bounds.left + 5,
            top: bounds.top + (hasStereo ? 20 : 6),
            width: bounds.width - 10,
            height: 13,
            text: nodeName
          }
        ],
        font: "Arial;13;0",
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: hasStereo ? 38 : 25,
        nameLabel: { $ref: nameLabelId },
        stereotypeLabel: { $ref: stereoLabelId }
      }
    ],
    font: "Arial;13;0",
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: bounds.height,
    nameCompartment: { $ref: nameCompId }
  };
}

export function createUMLArtifactViewNode(
  viewId: string,
  diagramId: string,
  modelId: string,
  artifactName: string,
  bounds: { left: number; top: number; width: number; height: number }
): StarUMLNode {
  const nameCompId = generateStarUMLId();
  const nameLabelId = generateStarUMLId();

  return {
    _type: "UMLArtifactView",
    _id: viewId,
    _parent: { $ref: diagramId },
    model: { $ref: modelId },
    subViews: [
      {
        _type: "UMLNameCompartmentView",
        _id: nameCompId,
        _parent: { $ref: viewId },
        model: { $ref: modelId },
        subViews: [
          {
            _type: "LabelView",
            _id: nameLabelId,
            _parent: { $ref: nameCompId },
            font: "Arial;13;1",
            left: bounds.left + 5,
            top: bounds.top + 6,
            width: bounds.width - 10,
            height: 13,
            text: artifactName
          }
        ],
        font: "Arial;13;0",
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: 25,
        nameLabel: { $ref: nameLabelId }
      }
    ],
    font: "Arial;13;0",
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: bounds.height,
    nameCompartment: { $ref: nameCompId }
  };
}

// --- Object Diagram Semantic Nodes & Views ---

export function createUMLObjectNode(
  id: string,
  parentId: string,
  name: string,
  classifierName?: string,
  slots: Array<{ name: string; value: string }> = []
): StarUMLNode {
  const slotNodes: StarUMLNode[] = slots.map((s) => ({
    _type: "UMLSlot",
    _id: generateStarUMLId(),
    _parent: { $ref: id },
    name: s.name,
    value: s.value
  }));

  const node: StarUMLNode = {
    _type: "UMLObject",
    _id: id,
    _parent: { $ref: parentId },
    name,
    slots: slotNodes
  };
  if (classifierName) node.classifierName = classifierName;
  return node;
}

export function createUMLLinkNode(
  id: string,
  parentId: string,
  sourceId: string,
  targetId: string,
  name?: string
): StarUMLNode {
  const end1Id = generateStarUMLId();
  const end2Id = generateStarUMLId();

  const node: StarUMLNode = {
    _type: "UMLLink",
    _id: id,
    _parent: { $ref: parentId },
    end1: {
      _type: "UMLLinkEnd",
      _id: end1Id,
      _parent: { $ref: id },
      reference: { $ref: sourceId }
    },
    end2: {
      _type: "UMLLinkEnd",
      _id: end2Id,
      _parent: { $ref: id },
      reference: { $ref: targetId }
    }
  };
  if (name) node.name = name;
  return node;
}

export function createUMLObjectDiagramNode(
  id: string,
  parentId: string,
  name: string,
  ownedViews: StarUMLNode[] = []
): StarUMLNode {
  return {
    _type: "UMLObjectDiagram",
    _id: id,
    _parent: { $ref: parentId },
    name,
    ownedViews
  };
}

export function createUMLObjectViewNode(
  viewId: string,
  diagramId: string,
  modelId: string,
  objectName: string,
  bounds: { left: number; top: number; width: number; height: number },
  slots: Array<{ name: string; value: string }> = []
): StarUMLNode {
  const nameCompId = generateStarUMLId();
  const nameLabelId = generateStarUMLId();
  const slotCompId = generateStarUMLId();

  const slotViews: StarUMLNode[] = slots.map((s) => ({
    _type: "LabelView",
    _id: generateStarUMLId(),
    _parent: { $ref: slotCompId },
    font: "Arial;13;0",
    left: bounds.left + 5,
    top: bounds.top + 30,
    width: bounds.width - 10,
    height: 13,
    text: `${s.name} = ${s.value}`
  }));

  return {
    _type: "UMLObjectView",
    _id: viewId,
    _parent: { $ref: diagramId },
    model: { $ref: modelId },
    subViews: [
      {
        _type: "UMLNameCompartmentView",
        _id: nameCompId,
        _parent: { $ref: viewId },
        model: { $ref: modelId },
        subViews: [
          {
            _type: "LabelView",
            _id: nameLabelId,
            _parent: { $ref: nameCompId },
            font: "Arial;13;5", // underline for instance
            left: bounds.left + 5,
            top: bounds.top + 6,
            width: bounds.width - 10,
            height: 13,
            text: objectName
          }
        ],
        font: "Arial;13;0",
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: 25,
        nameLabel: { $ref: nameLabelId }
      },
      {
        _type: "UMLSlotCompartmentView",
        _id: slotCompId,
        _parent: { $ref: viewId },
        model: { $ref: modelId },
        subViews: slotViews,
        visible: slots.length > 0,
        font: "Arial;13;0",
        left: bounds.left,
        top: bounds.top + 25,
        width: bounds.width,
        height: Math.max(10, slots.length * 15 + 5)
      }
    ],
    font: "Arial;13;0",
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: bounds.height,
    nameCompartment: { $ref: nameCompId }
  };
}

// --- Communication Diagram Semantic Nodes & Views ---

export function createUMLCommunicationDiagramNode(
  id: string,
  parentId: string,
  name: string,
  ownedViews: StarUMLNode[] = []
): StarUMLNode {
  return {
    _type: "UMLCommunicationDiagram",
    _id: id,
    _parent: { $ref: parentId },
    name,
    ownedViews
  };
}

export function createUMLCommLifelineViewNode(
  viewId: string,
  diagramId: string,
  modelId: string,
  lifelineName: string,
  bounds: { left: number; top: number; width: number; height: number }
): StarUMLNode {
  const nameCompId = generateStarUMLId();
  const nameLabelId = generateStarUMLId();

  return {
    _type: "UMLCommLifelineView",
    _id: viewId,
    _parent: { $ref: diagramId },
    model: { $ref: modelId },
    subViews: [
      {
        _type: "UMLNameCompartmentView",
        _id: nameCompId,
        _parent: { $ref: viewId },
        model: { $ref: modelId },
        subViews: [
          {
            _type: "LabelView",
            _id: nameLabelId,
            _parent: { $ref: nameCompId },
            font: "Arial;13;5", // underlined
            left: bounds.left + 5,
            top: bounds.top + Math.floor((bounds.height - 15) / 2),
            width: bounds.width - 10,
            height: 13,
            text: lifelineName
          }
        ],
        font: "Arial;13;0",
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
        nameLabel: { $ref: nameLabelId }
      }
    ],
    font: "Arial;13;0",
    left: bounds.left,
    top: bounds.top,
    width: bounds.width,
    height: bounds.height,
    nameCompartment: { $ref: nameCompId }
  };
}

