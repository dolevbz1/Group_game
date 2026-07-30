import InfoFlowMap from '../components/InfoFlowMap';
import type { FlowSourceId } from '../data/sourceLogsData';

type EmptyViewProps = {
  onSelectNode: (id: FlowSourceId) => void;
};

export default function EmptyView({ onSelectNode }: EmptyViewProps) {
  return (
    <div className="admin-view admin-view--flowmap">
      <div className="admin-view-header">
        <h1 className="admin-view-title text-h2-bold">מפת מידע</h1>
        <p className="admin-view-sub text-small-normal">מקורות המידע שמזינים את שומר הסף של ה-AI והחיבור לקהילה</p>
      </div>
      <div className="admin-card admin-flowmap-card">
        <InfoFlowMap onSelect={onSelectNode} />
      </div>
    </div>
  );
}
