export interface SequenceLifelineLayout {
    id: string;
    name: string;
    left: number;
    top: number;
    width: number;
    height: number;
    centerX: number;
}
export interface SequenceMessageLayout {
    id: string;
    name: string;
    sourceLifelineId: string;
    targetLifelineId: string;
    messageSort: "synchCall" | "asynchCall" | "reply";
    y: number;
    pointsString: string;
    labelLeft: number;
    labelTop: number;
    labelWidth: number;
}
export interface SequenceDiagramLayoutResult {
    lifelines: Map<string, SequenceLifelineLayout>;
    messages: SequenceMessageLayout[];
    totalWidth: number;
    totalHeight: number;
}
/**
 * Computes chronological vertical arrangement for lifelines and messages in a Sequence diagram.
 */
export declare function computeSequenceLayout(lifelines: Array<{
    id: string;
    name: string;
}>, messages: Array<{
    id: string;
    name: string;
    sourceLifelineId: string;
    targetLifelineId: string;
    messageSort: "synchCall" | "asynchCall" | "reply";
}>): SequenceDiagramLayoutResult;
