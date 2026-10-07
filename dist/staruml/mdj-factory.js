import { generateStarUMLId } from "./id-generator.js";
/**
 * Pure factory functions to construct standard StarUML (.mdj) nodes,
 * strictly adhering to StarUML's metamodel and schema.
 */
// --- Project & Top-Level Containers ---
export function createProjectNode(id, name, ownedElements = []) {
    return {
        _type: "Project",
        _id: id,
        name,
        ownedElements
    };
}
export function createUMLModelNode(id, parentId, name, ownedElements = []) {
    return {
        _type: "UMLModel",
        _id: id,
        _parent: { $ref: parentId },
        name,
        ownedElements
    };
}
// --- Class Diagram Semantic Nodes ---
export function createUMLParameterNode(id, parentId, name, type, direction) {
    const node = {
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
export function createUMLOperationNode(id, parentId, name, returnType, visibility = "public", parameters = []) {
    const paramNodes = parameters.map((p) => createUMLParameterNode(generateStarUMLId(), id, p.name, p.type, "in"));
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
export function createUMLAttributeNode(id, parentId, name, type, visibility = "public") {
    return {
        _type: "UMLAttribute",
        _id: id,
        _parent: { $ref: parentId },
        name,
        type,
        visibility
    };
}
export function createUMLClassNode(id, parentId, name, options = {}) {
    const isInterface = options.stereotype?.toLowerCase() === "interface";
    const nodeType = isInterface ? "UMLInterface" : "UMLClass";
    const node = {
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
export function createUMLGeneralizationNode(id, sourceId, targetId, name) {
    const node = {
        _type: "UMLGeneralization",
        _id: id,
        _parent: { $ref: sourceId },
        source: { $ref: sourceId },
        target: { $ref: targetId }
    };
    if (name)
        node.name = name;
    return node;
}
export function createUMLInterfaceRealizationNode(id, sourceId, targetId, name) {
    const node = {
        _type: "UMLInterfaceRealization",
        _id: id,
        _parent: { $ref: sourceId },
        source: { $ref: sourceId },
        target: { $ref: targetId }
    };
    if (name)
        node.name = name;
    return node;
}
export function createUMLDependencyNode(id, sourceId, targetId, name) {
    const node = {
        _type: "UMLDependency",
        _id: id,
        _parent: { $ref: sourceId },
        source: { $ref: sourceId },
        target: { $ref: targetId }
    };
    if (name)
        node.name = name;
    return node;
}
export function createUMLAssociationNode(id, sourceId, targetId, options = {}) {
    const end1Id = generateStarUMLId();
    const end2Id = generateStarUMLId();
    const end1 = {
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
    const end2 = {
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
    const node = {
        _type: "UMLAssociation",
        _id: id,
        _parent: { $ref: sourceId },
        end1,
        end2
    };
    if (options.name)
        node.name = options.name;
    return node;
}
// --- Use Case Diagram Semantic Nodes ---
export function createUMLActorNode(id, parentId, name) {
    return {
        _type: "UMLActor",
        _id: id,
        _parent: { $ref: parentId },
        name
    };
}
export function createUMLUseCaseSubjectNode(id, parentId, name) {
    return {
        _type: "UMLUseCaseSubject",
        _id: id,
        _parent: { $ref: parentId },
        name
    };
}
export function createUMLUseCaseNode(id, parentId, name, ownedElements = []) {
    return {
        _type: "UMLUseCase",
        _id: id,
        _parent: { $ref: parentId },
        name,
        ownedElements
    };
}
export function createUMLIncludeNode(id, sourceUseCaseId, targetUseCaseId) {
    return {
        _type: "UMLInclude",
        _id: id,
        _parent: { $ref: sourceUseCaseId },
        source: { $ref: sourceUseCaseId },
        target: { $ref: targetUseCaseId }
    };
}
export function createUMLExtendNode(id, sourceUseCaseId, targetUseCaseId) {
    return {
        _type: "UMLExtend",
        _id: id,
        _parent: { $ref: sourceUseCaseId },
        source: { $ref: sourceUseCaseId },
        target: { $ref: targetUseCaseId }
    };
}
// --- Sequence Diagram Semantic Nodes ---
export function createUMLLifelineNode(id, parentId, name, representClassId) {
    const node = {
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
export function createUMLMessageNode(id, parentId, name, sourceLifelineId, targetLifelineId, messageSort = "synchCall") {
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
export function createUMLInteractionNode(id, parentId, name, lifelines = [], messages = [], ownedElements = []) {
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
export function createUMLClassDiagramNode(id, parentId, name, ownedViews = []) {
    return {
        _type: "UMLClassDiagram",
        _id: id,
        _parent: { $ref: parentId },
        name,
        defaultDiagram: true,
        ownedViews
    };
}
export function createUMLUseCaseDiagramNode(id, parentId, name, ownedViews = []) {
    return {
        _type: "UMLUseCaseDiagram",
        _id: id,
        _parent: { $ref: parentId },
        name,
        defaultDiagram: true,
        ownedViews
    };
}
export function createUMLSequenceDiagramNode(id, parentId, name, ownedViews = []) {
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
export function createUMLClassViewNode(viewId, diagramId, modelId, className, bounds, options = {}) {
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
    const nameSubViews = [
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
    const nameCompartment = {
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
    const attrViews = [];
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
    const attrCompartment = {
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
    const opViews = [];
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
    const opCompartment = {
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
    const receptionCompartment = {
        _type: "UMLReceptionCompartmentView",
        _id: recCompId,
        _parent: { $ref: viewId },
        model: { $ref: modelId },
        visible: false,
        font: "Arial;13;0",
        width: 10,
        height: 10
    };
    const templateCompartment = {
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
function getVisibilityPrefix(visibility) {
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
export function createUMLConnectionViewNode(viewType, viewId, diagramId, modelId, tailViewId, headViewId, pointsString, options = {}) {
    const nameLabelId = generateStarUMLId();
    const stereoLabelId = generateStarUMLId();
    const propLabelId = generateStarUMLId();
    const subViews = [
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
export function createUMLAssociationViewNode(viewId, diagramId, modelId, tailViewId, headViewId, pointsString, end1Id, end2Id, options = {}) {
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
    const subViews = [
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
export function createUMLActorViewNode(viewId, diagramId, modelId, actorName, bounds) {
    const nameCompId = generateStarUMLId();
    const stereoLabelId = generateStarUMLId();
    const nameLabelId = generateStarUMLId();
    const nsLabelId = generateStarUMLId();
    const propLabelId = generateStarUMLId();
    const nameCompartment = {
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
export function createUMLUseCaseViewNode(viewId, diagramId, modelId, useCaseName, bounds) {
    const nameCompId = generateStarUMLId();
    const stereoLabelId = generateStarUMLId();
    const nameLabelId = generateStarUMLId();
    const nsLabelId = generateStarUMLId();
    const propLabelId = generateStarUMLId();
    const nameCompartment = {
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
export function createUMLUseCaseSubjectViewNode(viewId, diagramId, modelId, subjectName, bounds) {
    const nameCompId = generateStarUMLId();
    const stereoLabelId = generateStarUMLId();
    const nameLabelId = generateStarUMLId();
    const nsLabelId = generateStarUMLId();
    const propLabelId = generateStarUMLId();
    const nameCompartment = {
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
export function createUMLIncludeViewNode(viewId, diagramId, modelId, tailViewId, headViewId, pointsString) {
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
export function createUMLExtendViewNode(viewId, diagramId, modelId, tailViewId, headViewId, pointsString) {
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
export function createUMLSeqLifelineViewNode(viewId, diagramId, modelId, lifelineName, bounds, linePartId) {
    const nameCompId = generateStarUMLId();
    const stereoLabelId = generateStarUMLId();
    const nameLabelId = generateStarUMLId();
    const nsLabelId = generateStarUMLId();
    const propLabelId = generateStarUMLId();
    const nameCompartment = {
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
    const linePart = {
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
export function createUMLSeqMessageViewNode(viewId, diagramId, modelId, messageName, tailLinePartId, headLinePartId, pointsString, messageSort, labelBounds) {
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
    const activationView = {
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
//# sourceMappingURL=mdj-factory.js.map