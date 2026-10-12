import path from "node:path";
import dagre from "dagre";
import { generateStarUMLId } from "../src/staruml/id-generator.js";
import { writeAtomicJson } from "../src/utils/file-writer.js";
import type { StarUMLNode } from "../src/types.js";

interface StateNodeDef {
  id: string;
  name: string;
  type: "initial" | "state" | "final";
  width?: number;
  height?: number;
}

interface TransitionDef {
  id: string;
  name: string;
  sourceId: string;
  targetId: string;
}

interface StateMachineDef {
  name: string;
  diagramName: string;
  nodes: StateNodeDef[];
  transitions: TransitionDef[];
}

function layoutStateMachine(def: StateMachineDef) {
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: "TB",
    nodesep: 80,
    ranksep: 100,
    marginx: 80,
    marginy: 60
  });
  g.setDefaultEdgeLabel(() => ({}));

  for (const n of def.nodes) {
    const w = n.type === "initial" ? 22 : n.type === "final" ? 26 : Math.max(140, n.name.length * 10 + 40);
    const h = n.type === "initial" ? 22 : n.type === "final" ? 26 : 60;
    g.setNode(n.id, { width: w, height: h });
  }

  for (const t of def.transitions) {
    if (t.sourceId !== t.targetId) {
      g.setEdge(t.sourceId, t.targetId);
    }
  }

  dagre.layout(g);

  const nodePositions = new Map<string, { left: number; top: number; width: number; height: number; centerX: number; centerY: number }>();

  for (const n of def.nodes) {
    const dagreNode = g.node(n.id);
    const w = dagreNode.width;
    const h = dagreNode.height;
    const left = Math.round(dagreNode.x - w / 2);
    const top = Math.round(dagreNode.y - h / 2);
    nodePositions.set(n.id, {
      left,
      top,
      width: w,
      height: h,
      centerX: Math.round(dagreNode.x),
      centerY: Math.round(dagreNode.y)
    });
  }

  const edgePoints = new Map<string, string>();
  for (const t of def.transitions) {
    const src = nodePositions.get(t.sourceId)!;
    const tgt = nodePositions.get(t.targetId)!;
    if (t.sourceId === t.targetId) {
      // Loop
      const x1 = src.left + src.width;
      const y1 = src.top + 20;
      const x2 = x1 + 40;
      const y2 = y1;
      const x3 = x2;
      const y3 = src.top + 45;
      const x4 = src.left + src.width;
      const y4 = y3;
      edgePoints.set(t.id, `${x1}:${y1};${x2}:${y2};${x3}:${y3};${x4}:${y4}`);
    } else {
      const edge = g.edge(t.sourceId, t.targetId);
      if (edge && edge.points && edge.points.length > 0) {
        edgePoints.set(t.id, edge.points.map((p) => `${Math.round(p.x)}:${Math.round(p.y)}`).join(";"));
      } else {
        const x1 = src.centerX;
        const y1 = src.centerY;
        const x2 = tgt.centerX;
        const y2 = tgt.centerY;
        edgePoints.set(t.id, `${x1}:${y1};${x2}:${y2}`);
      }
    }
  }

  return { nodePositions, edgePoints };
}

function buildStateMachineAST(def: StateMachineDef, parentModelId: string) {
  const smId = generateStarUMLId();
  const regionId = generateStarUMLId();
  const diagramId = generateStarUMLId();

  const idMap = new Map<string, string>();
  for (const n of def.nodes) {
    idMap.set(n.id, generateStarUMLId());
  }

  const transMap = new Map<string, string>();
  for (const t of def.transitions) {
    transMap.set(t.id, generateStarUMLId());
  }

  const viewMap = new Map<string, string>();
  for (const n of def.nodes) {
    viewMap.set(n.id, generateStarUMLId());
  }

  const { nodePositions, edgePoints } = layoutStateMachine(def);

  // Semantic vertices
  const vertices: StarUMLNode[] = [];
  for (const n of def.nodes) {
    const vId = idMap.get(n.id)!;
    if (n.type === "initial") {
      vertices.push({
        _type: "UMLPseudostate",
        _id: vId,
        _parent: { $ref: regionId },
        name: n.name || "Initial",
        kind: "initial"
      });
    } else if (n.type === "final") {
      vertices.push({
        _type: "UMLFinalState",
        _id: vId,
        _parent: { $ref: regionId },
        name: n.name || "Final"
      });
    } else {
      vertices.push({
        _type: "UMLState",
        _id: vId,
        _parent: { $ref: regionId },
        name: n.name
      });
    }
  }

  // Semantic transitions
  const transitions: StarUMLNode[] = [];
  for (const t of def.transitions) {
    const tId = transMap.get(t.id)!;
    const srcModelId = idMap.get(t.sourceId)!;
    const tgtModelId = idMap.get(t.targetId)!;
    transitions.push({
      _type: "UMLTransition",
      _id: tId,
      _parent: { $ref: regionId },
      name: t.name,
      source: { $ref: srcModelId },
      target: { $ref: tgtModelId }
    });
  }

  // Region
  const regionNode: StarUMLNode = {
    _type: "UMLRegion",
    _id: regionId,
    _parent: { $ref: smId },
    name: "Region1",
    vertices,
    transitions
  };

  // Graphical views
  const ownedViews: StarUMLNode[] = [];

  for (const n of def.nodes) {
    const vId = idMap.get(n.id)!;
    const viewId = viewMap.get(n.id)!;
    const pos = nodePositions.get(n.id)!;

    if (n.type === "initial") {
      const nameLabelId = generateStarUMLId();
      ownedViews.push({
        _type: "UMLPseudostateView",
        _id: viewId,
        _parent: { $ref: diagramId },
        model: { $ref: vId },
        font: "Arial;13;0",
        left: pos.left,
        top: pos.top,
        width: pos.width,
        height: pos.height,
        nameLabel: { $ref: nameLabelId },
        subViews: [
          {
            _type: "NodeLabelView",
            _id: nameLabelId,
            _parent: { $ref: viewId },
            model: { $ref: vId },
            visible: false,
            font: "Arial;13;0",
            left: pos.left,
            top: pos.top - 15,
            width: 0,
            height: 13
          }
        ]
      });
    } else if (n.type === "final") {
      ownedViews.push({
        _type: "UMLFinalStateView",
        _id: viewId,
        _parent: { $ref: diagramId },
        model: { $ref: vId },
        font: "Arial;13;0",
        left: pos.left,
        top: pos.top,
        width: pos.width,
        height: pos.height,
        subViews: []
      });
    } else {
      // UMLStateView with 4 compartments
      const nameCompId = generateStarUMLId();
      const nameLabelId = generateStarUMLId();
      const nsLabelId = generateStarUMLId();
      const actCompId = generateStarUMLId();
      const transCompId = generateStarUMLId();
      const decompCompId = generateStarUMLId();

      ownedViews.push({
        _type: "UMLStateView",
        _id: viewId,
        _parent: { $ref: diagramId },
        model: { $ref: vId },
        subViews: [
          {
            _type: "UMLNameCompartmentView",
            _id: nameCompId,
            _parent: { $ref: viewId },
            model: { $ref: vId },
            subViews: [
              {
                _type: "LabelView",
                _id: nsLabelId,
                _parent: { $ref: nameCompId },
                visible: false,
                font: "Arial;13;0",
                left: pos.left,
                top: pos.top + 5,
                width: 0,
                height: 13
              },
              {
                _type: "LabelView",
                _id: nameLabelId,
                _parent: { $ref: nameCompId },
                font: "Arial;13;1",
                left: pos.left + 5,
                top: pos.top + 7,
                width: pos.width - 10,
                height: 15,
                text: n.name,
                horizontalAlignment: 2
              }
            ],
            font: "Arial;13;0",
            left: pos.left,
            top: pos.top,
            width: pos.width,
            height: 25,
            nameLabel: { $ref: nameLabelId },
            namespaceLabel: { $ref: nsLabelId }
          },
          {
            _type: "UMLInternalActivityCompartmentView",
            _id: actCompId,
            _parent: { $ref: viewId },
            model: { $ref: vId },
            visible: false,
            font: "Arial;13;0",
            left: pos.left,
            top: pos.top + 25,
            width: pos.width,
            height: 10
          },
          {
            _type: "UMLInternalTransitionCompartmentView",
            _id: transCompId,
            _parent: { $ref: viewId },
            model: { $ref: vId },
            visible: false,
            font: "Arial;13;0",
            left: pos.left,
            top: pos.top + 25,
            width: pos.width,
            height: 10
          },
          {
            _type: "UMLDecompositionCompartmentView",
            _id: decompCompId,
            _parent: { $ref: viewId },
            model: { $ref: vId },
            visible: false,
            font: "Arial;13;0",
            left: pos.left,
            top: pos.top + 25,
            width: pos.width,
            height: 10
          }
        ],
        font: "Arial;13;0",
        containerChangeable: true,
        left: pos.left,
        top: pos.top,
        width: pos.width,
        height: pos.height,
        nameCompartment: { $ref: nameCompId },
        internalActivityCompartment: { $ref: actCompId },
        internalTransitionCompartment: { $ref: transCompId },
        decompositionCompartment: { $ref: decompCompId }
      });
    }
  }

  // Graphical transitions
  for (const t of def.transitions) {
    const tModelId = transMap.get(t.id)!;
    const tViewId = generateStarUMLId();
    const srcViewId = viewMap.get(t.sourceId)!;
    const tgtViewId = viewMap.get(t.targetId)!;
    const pts = edgePoints.get(t.id) || "100:100;200:200";

    const nameLabelId = generateStarUMLId();
    const stereoLabelId = generateStarUMLId();
    const propLabelId = generateStarUMLId();

    const midPt = pts.split(";")[Math.floor(pts.split(";").length / 2)].split(":");
    const midX = parseInt(midPt[0], 10) || 150;
    const midY = parseInt(midPt[1], 10) || 150;

    ownedViews.push({
      _type: "UMLTransitionView",
      _id: tViewId,
      _parent: { $ref: diagramId },
      model: { $ref: tModelId },
      subViews: [
        {
          _type: "EdgeLabelView",
          _id: nameLabelId,
          _parent: { $ref: tViewId },
          model: { $ref: tModelId },
          visible: Boolean(t.name && t.name.length > 0),
          font: "Arial;12;0",
          left: midX + 10,
          top: midY - 12,
          width: Math.min(250, (t.name?.length || 0) * 7),
          height: 13,
          text: t.name,
          edgePosition: 2
        },
        {
          _type: "EdgeLabelView",
          _id: stereoLabelId,
          _parent: { $ref: tViewId },
          model: { $ref: tModelId },
          visible: false,
          font: "Arial;13;0",
          left: midX,
          top: midY,
          width: 0,
          height: 13,
          edgePosition: 2
        },
        {
          _type: "EdgeLabelView",
          _id: propLabelId,
          _parent: { $ref: tViewId },
          model: { $ref: tModelId },
          visible: false,
          font: "Arial;13;0",
          left: midX,
          top: midY,
          width: 0,
          height: 13,
          edgePosition: 2
        }
      ],
      font: "Arial;13;0",
      head: { $ref: tgtViewId },
      tail: { $ref: srcViewId },
      lineStyle: 1,
      points: pts,
      nameLabel: { $ref: nameLabelId },
      stereotypeLabel: { $ref: stereoLabelId },
      propertyLabel: { $ref: propLabelId }
    });
  }

  // Diagram
  const diagramNode: StarUMLNode = {
    _type: "UMLStatechartDiagram",
    _id: diagramId,
    _parent: { $ref: smId },
    name: def.diagramName,
    ownedViews
  };

  // State Machine Node
  const smNode: StarUMLNode = {
    _type: "UMLStateMachine",
    _id: smId,
    _parent: { $ref: parentModelId },
    name: def.name,
    regions: [regionNode],
    ownedElements: [diagramNode]
  };

  return smNode;
}

async function main() {
  const projectId = generateStarUMLId();
  const modelId = generateStarUMLId();

  // 1. Habitación Lifecycle
  const roomSmDef: StateMachineDef = {
    name: "Ciclo de Vida de Habitación (Room)",
    diagramName: "Máquina de Estados - Habitación",
    nodes: [
      { id: "r_init", name: "", type: "initial" },
      { id: "r_available", name: "AVAILABLE (Lista/Disponible)", type: "state" },
      { id: "r_occupied", name: "OCCUPIED (Ocupada)", type: "state" },
      { id: "r_cleaning", name: "CLEANING_PENDING (Aseo Pendiente)", type: "state" },
      { id: "r_maintenance", name: "MAINTENANCE (Bloqueada/Avería)", type: "state" }
    ],
    transitions: [
      { id: "rt1", name: "higienizada()", sourceId: "r_init", targetId: "r_available" },
      { id: "rt2", name: "checkIn() [asignarHuesped]", sourceId: "r_available", targetId: "r_occupied" },
      { id: "rt3", name: "detectarAveria() [bloqueo]", sourceId: "r_available", targetId: "r_maintenance" },
      { id: "rt4", name: "checkOut() [folioSaldado]", sourceId: "r_occupied", targetId: "r_cleaning" },
      { id: "rt5", name: "notificarDesinfeccion()", sourceId: "r_cleaning", targetId: "r_available" },
      { id: "rt6", name: "reparacionConcluida()", sourceId: "r_maintenance", targetId: "r_cleaning" }
    ]
  };

  // 2. Reserva Lifecycle
  const resSmDef: StateMachineDef = {
    name: "Ciclo de Vida de Reserva (Reservation)",
    diagramName: "Máquina de Estados - Reserva",
    nodes: [
      { id: "res_init", name: "", type: "initial" },
      { id: "res_confirmed", name: "CONFIRMED (Garantizada/Pagada)", type: "state" },
      { id: "res_checked_in", name: "CHECKED_IN (En Estadía)", type: "state" },
      { id: "res_completed", name: "COMPLETED (Finalizada)", type: "state" },
      { id: "res_cancelled", name: "CANCELLED (Cancelada)", type: "state" },
      { id: "res_no_show", name: "NO_SHOW (Incomparecencia)", type: "state" },
      { id: "res_final", name: "", type: "final" }
    ],
    transitions: [
      { id: "rest1", name: "pagoTotalOPrenotaValida()", sourceId: "res_init", targetId: "res_confirmed" },
      { id: "rest2", name: "realizarCheckIn() [hora >= 15:00]", sourceId: "res_confirmed", targetId: "res_checked_in" },
      { id: "rest3", name: "cancelar() [>= 48h gratis / < 48h cargo 1 noche]", sourceId: "res_confirmed", targetId: "res_cancelled" },
      { id: "rest4", name: "noPresentarse() [cargo 1 noche en Flexible]", sourceId: "res_confirmed", targetId: "res_no_show" },
      { id: "rest5", name: "realizarCheckOut() [folioCerrado]", sourceId: "res_checked_in", targetId: "res_completed" },
      { id: "rest6", name: "archivarEstadia()", sourceId: "res_completed", targetId: "res_final" },
      { id: "rest7", name: "cerrarExpediente()", sourceId: "res_cancelled", targetId: "res_final" },
      { id: "rest8", name: "cerrarExpediente()", sourceId: "res_no_show", targetId: "res_final" }
    ]
  };

  // 3. Folio Lifecycle
  const folioSmDef: StateMachineDef = {
    name: "Ciclo de Vida de Folio (Folio)",
    diagramName: "Máquina de Estados - Folio",
    nodes: [
      { id: "f_init", name: "", type: "initial" },
      { id: "f_open", name: "OPEN (Abierto/Consumos)", type: "state" },
      { id: "f_settled", name: "SETTLED (Saldado)", type: "state" },
      { id: "f_closed", name: "CLOSED (Cerrado/Facturado)", type: "state" },
      { id: "f_final", name: "", type: "final" }
    ],
    transitions: [
      { id: "ft1", name: "aperturarEnCheckIn()", sourceId: "f_init", targetId: "f_open" },
      { id: "ft2", name: "imputarConsumo() [habOcupada]", sourceId: "f_open", targetId: "f_open" },
      { id: "ft3", name: "liquidarCuenta() [pagoAprobado]", sourceId: "f_open", targetId: "f_settled" },
      { id: "ft4", name: "emitirFacturaElectronica()", sourceId: "f_settled", targetId: "f_closed" },
      { id: "ft5", name: "archivarFolio()", sourceId: "f_closed", targetId: "f_final" }
    ]
  };

  const sm1 = buildStateMachineAST(roomSmDef, modelId);
  const sm2 = buildStateMachineAST(resSmDef, modelId);
  const sm3 = buildStateMachineAST(folioSmDef, modelId);

  const modelNode: StarUMLNode = {
    _type: "UMLModel",
    _id: modelId,
    _parent: { $ref: projectId },
    name: "Máquinas de Estado y Ciclos de Vida",
    ownedElements: [sm1, sm2, sm3]
  };

  const projectNode: StarUMLNode = {
    _type: "Project",
    _id: projectId,
    name: "Grand Horizon Boutique Hotels - Ciclos de Vida",
    ownedElements: [modelNode]
  };

  const outputPath = path.resolve("./output/grand_horizon_state_machines.mdj");
  await writeAtomicJson(outputPath, projectNode);
  console.log(`Successfully generated state machines at: ${outputPath}`);
}

main().catch((err) => {
  console.error("Error generating state machines:", err);
  process.exit(1);
});
