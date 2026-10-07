import dagre from "dagre";

export interface LayoutNodeInput {
  id: string;
  width: number;
  height: number;
}

export interface LayoutEdgeInput {
  id: string;
  sourceId: string;
  targetId: string;
}

export interface LayoutNodePosition {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export interface LayoutEdgePosition {
  id: string;
  sourceId: string;
  targetId: string;
  points: Array<{ x: number; y: number }>;
  pointsString: string; // Formatted as "x1:y1;x2:y2;..." for StarUML
}

export interface GraphLayoutResult {
  nodes: Map<string, LayoutNodePosition>;
  edges: Map<string, LayoutEdgePosition>;
  totalWidth: number;
  totalHeight: number;
}

export interface LayoutOptions {
  rankdir?: "TB" | "BT" | "LR" | "RL";
  nodesep?: number;
  ranksep?: number;
  marginx?: number;
  marginy?: number;
}

/**
 * Computes 2D layout coordinates for nodes and routes edges using dagre graph library.
 */
export function computeGraphLayout(
  nodes: LayoutNodeInput[],
  edges: LayoutEdgeInput[],
  options: LayoutOptions = {}
): GraphLayoutResult {
  const g = new dagre.graphlib.Graph();

  g.setGraph({
    rankdir: options.rankdir ?? "TB",
    nodesep: options.nodesep ?? 60,
    ranksep: options.ranksep ?? 80,
    marginx: options.marginx ?? 50,
    marginy: options.marginy ?? 50
  });

  g.setDefaultEdgeLabel(() => ({}));

  for (const node of nodes) {
    g.setNode(node.id, {
      width: Math.max(10, node.width),
      height: Math.max(10, node.height)
    });
  }

  for (const edge of edges) {
    // Only set edge if both source and target exist
    if (g.hasNode(edge.sourceId) && g.hasNode(edge.targetId)) {
      g.setEdge(edge.sourceId, edge.targetId, { id: edge.id });
    }
  }

  dagre.layout(g);

  const nodePositions = new Map<string, LayoutNodePosition>();
  let maxX = 0;
  let maxY = 0;

  for (const node of nodes) {
    const layoutNode = g.node(node.id);
    if (!layoutNode) continue;

    const left = Math.round(layoutNode.x - layoutNode.width / 2);
    const top = Math.round(layoutNode.y - layoutNode.height / 2);
    const width = Math.round(layoutNode.width);
    const height = Math.round(layoutNode.height);

    nodePositions.set(node.id, {
      id: node.id,
      left,
      top,
      width,
      height,
      centerX: Math.round(layoutNode.x),
      centerY: Math.round(layoutNode.y)
    });

    if (left + width > maxX) maxX = left + width;
    if (top + height > maxY) maxY = top + height;
  }

  const edgePositions = new Map<string, LayoutEdgePosition>();

  for (const edge of edges) {
    const dagreEdge = g.edge(edge.sourceId, edge.targetId);
    let pts: Array<{ x: number; y: number }> = [];

    if (dagreEdge && Array.isArray(dagreEdge.points) && dagreEdge.points.length >= 2) {
      pts = dagreEdge.points.map((p) => ({
        x: Math.round(p.x),
        y: Math.round(p.y)
      }));
    } else {
      // Fallback: connect centers of source and target
      const src = nodePositions.get(edge.sourceId);
      const tgt = nodePositions.get(edge.targetId);
      if (src && tgt) {
        pts = [
          { x: src.centerX, y: src.centerY },
          { x: tgt.centerX, y: tgt.centerY }
        ];
      } else {
        pts = [
          { x: 0, y: 0 },
          { x: 100, y: 100 }
        ];
      }
    }

    const pointsString = pts.map((p) => `${p.x}:${p.y}`).join(";");

    edgePositions.set(edge.id, {
      id: edge.id,
      sourceId: edge.sourceId,
      targetId: edge.targetId,
      points: pts,
      pointsString
    });
  }

  return {
    nodes: nodePositions,
    edges: edgePositions,
    totalWidth: maxX + 50,
    totalHeight: maxY + 50
  };
}
