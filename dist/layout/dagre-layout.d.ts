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
    points: Array<{
        x: number;
        y: number;
    }>;
    pointsString: string;
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
export declare function computeGraphLayout(nodes: LayoutNodeInput[], edges: LayoutEdgeInput[], options?: LayoutOptions): GraphLayoutResult;
