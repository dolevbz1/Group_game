import type { FlowSourceId } from '../data/sourceLogsData';

type FlowNode = {
  id: string;
  label: string;
  top: number;
};

const WIDTH = 640;
const HEIGHT = 300;
const NODE_WIDTH = 132;
const NODE_HEIGHT = 56;
const HUB_WIDTH = 112;
const HUB_HEIGHT = 92;
const HUB_LEFT = (WIDTH - HUB_WIDTH) / 2;
const HUB_TOP = (HEIGHT - HUB_HEIGHT) / 2;
const HUB_CENTER_Y = HUB_TOP + HUB_HEIGHT / 2;

const INPUT_NODES: FlowNode[] = [
  { id: 'residents', label: 'תושבים', top: 24 },
  { id: 'manager', label: 'מנהל קהילה', top: 210 },
];

const SOURCE_NODES: Array<FlowNode & { id: FlowSourceId }> = [
  { id: 'whatsapp', label: 'ואטסאפ', top: 10 },
  { id: 'email', label: 'מייל', top: 117 },
  { id: 'app', label: 'שיחת טלפון בוט', top: 224 },
];

function elbowPath(fromX: number, fromY: number, toX: number, toY: number, bendX: number) {
  if (fromY === toY) {
    return `M ${fromX} ${fromY} L ${toX} ${toY}`;
  }
  return `M ${fromX} ${fromY} L ${bendX} ${fromY} L ${bendX} ${toY} L ${toX} ${toY}`;
}

type InfoFlowMapProps = {
  onSelect?: (id: FlowSourceId) => void;
};

export default function InfoFlowMap({ onSelect }: InfoFlowMapProps) {
  const inputCenterX = NODE_WIDTH;
  const outputStartX = WIDTH - NODE_WIDTH;

  return (
    <div className="admin-flowmap">
      <svg
        className="admin-flowmap-svg"
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        aria-hidden="true"
      >
        <line
          x1={NODE_WIDTH / 2}
          y1={INPUT_NODES[0].top + NODE_HEIGHT}
          x2={NODE_WIDTH / 2}
          y2={INPUT_NODES[1].top}
          className="admin-flowmap-line"
        />
        <path
          d={elbowPath(inputCenterX, INPUT_NODES[0].top + NODE_HEIGHT / 2, HUB_LEFT, HUB_CENTER_Y - 20, inputCenterX + 65)}
          className="admin-flowmap-line"
          fill="none"
        />
        <path
          d={elbowPath(inputCenterX, INPUT_NODES[1].top + NODE_HEIGHT / 2, HUB_LEFT, HUB_CENTER_Y + 20, inputCenterX + 65)}
          className="admin-flowmap-line"
          fill="none"
        />
        <path
          d={elbowPath(HUB_LEFT + HUB_WIDTH, HUB_CENTER_Y - 20, outputStartX, SOURCE_NODES[0].top + NODE_HEIGHT / 2, HUB_LEFT + HUB_WIDTH + 65)}
          className="admin-flowmap-line"
          fill="none"
        />
        <path
          d={elbowPath(HUB_LEFT + HUB_WIDTH, HUB_CENTER_Y, outputStartX, SOURCE_NODES[1].top + NODE_HEIGHT / 2, HUB_LEFT + HUB_WIDTH + 65)}
          className="admin-flowmap-line"
          fill="none"
        />
        <path
          d={elbowPath(HUB_LEFT + HUB_WIDTH, HUB_CENTER_Y + 20, outputStartX, SOURCE_NODES[2].top + NODE_HEIGHT / 2, HUB_LEFT + HUB_WIDTH + 65)}
          className="admin-flowmap-line"
          fill="none"
        />
      </svg>

      {INPUT_NODES.map((node) => (
        <div
          key={node.id}
          className="admin-flowmap-node admin-flowmap-node--static"
          style={{ left: 0, top: node.top, width: NODE_WIDTH, height: NODE_HEIGHT }}
        >
          <span className="text-small-normal">{node.label}</span>
        </div>
      ))}

      <div
        className="admin-flowmap-node admin-flowmap-node--static admin-flowmap-hub"
        style={{ left: HUB_LEFT, top: HUB_TOP, width: HUB_WIDTH, height: HUB_HEIGHT }}
      >
        <span className="admin-flowmap-hub-icon" aria-hidden="true">✦</span>
        <span className="text-small-bold">AI</span>
      </div>

      {SOURCE_NODES.map((node) => (
        <button
          key={node.id}
          type="button"
          className="admin-flowmap-node"
          style={{ left: outputStartX, top: node.top, width: NODE_WIDTH, height: NODE_HEIGHT }}
          onClick={() => onSelect?.(node.id)}
        >
          <span className="text-small-normal">{node.label}</span>
        </button>
      ))}
    </div>
  );
}
