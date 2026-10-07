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
export function computeSequenceLayout(
  lifelines: Array<{ id: string; name: string }>,
  messages: Array<{
    id: string;
    name: string;
    sourceLifelineId: string;
    targetLifelineId: string;
    messageSort: "synchCall" | "asynchCall" | "reply";
  }>
): SequenceDiagramLayoutResult {
  const startX = 60;
  const topY = 40;
  const messageStep = 55;
  const startMessageY = 110;

  const totalHeight = Math.max(350, startMessageY + messages.length * messageStep + 80);

  // Layout lifelines horizontally
  let currentX = startX;
  const lifelineMap = new Map<string, SequenceLifelineLayout>();

  for (const ll of lifelines) {
    const textWidth = Math.max(60, ll.name.length * 8 + 20);
    const width = Math.max(100, textWidth + 30);
    const height = totalHeight - topY;
    const centerX = Math.round(currentX + width / 2);

    lifelineMap.set(ll.id, {
      id: ll.id,
      name: ll.name,
      left: currentX,
      top: topY,
      width,
      height,
      centerX
    });

    currentX += width + 90;
  }

  // Layout messages vertically in chronological order
  const messageLayouts: SequenceMessageLayout[] = [];

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const y = startMessageY + i * messageStep;

    const src = lifelineMap.get(msg.sourceLifelineId);
    const tgt = lifelineMap.get(msg.targetLifelineId);

    const srcX = src ? src.centerX : 100;
    const tgtX = tgt ? tgt.centerX : 200;

    let pointsString: string;
    let labelLeft: number;

    if (msg.sourceLifelineId === msg.targetLifelineId) {
      // Self-message: small loop to the right
      const loopWidth = 45;
      const loopHeight = 22;
      pointsString = `${srcX}:${y};${srcX + loopWidth}:${y};${srcX + loopWidth}:${y + loopHeight};${srcX}:${y + loopHeight}`;
      labelLeft = srcX + 10;
    } else {
      pointsString = `${srcX}:${y};${tgtX}:${y}`;
      labelLeft = Math.round((srcX + tgtX) / 2 - (msg.name.length * 7) / 2);
    }

    messageLayouts.push({
      id: msg.id,
      name: msg.name,
      sourceLifelineId: msg.sourceLifelineId,
      targetLifelineId: msg.targetLifelineId,
      messageSort: msg.messageSort,
      y,
      pointsString,
      labelLeft,
      labelTop: y - 16,
      labelWidth: Math.max(60, msg.name.length * 8 + 10)
    });
  }

  return {
    lifelines: lifelineMap,
    messages: messageLayouts,
    totalWidth: currentX + 60,
    totalHeight: totalHeight + 40
  };
}
