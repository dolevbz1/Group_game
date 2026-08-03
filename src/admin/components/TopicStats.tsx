import type { TopicStat } from '../data/adminMockData';

type TopicStatsProps = {
  topics: TopicStat[];
};

export default function TopicStats({ topics }: TopicStatsProps) {
  return (
    <ul className="admin-topic-stats">
      {topics.map((topic, index) => (
        <li key={topic.id} className={`admin-topic-row${index === 0 ? ' is-top' : ''}`}>
          <div className="admin-topic-info">
            <div className="admin-topic-head">
              <span className="admin-topic-label text-small-normal">{topic.label}</span>
              <span className="admin-topic-count text-small-bold">{topic.count} שאלות</span>
            </div>
            <div className="admin-topic-bar-track">
              <div
                className="admin-topic-bar-fill"
                style={{ width: `${topic.pct}%` }}
              />
            </div>
          </div>
          <span className={`admin-topic-trend text-tiny-normal trend-${topic.trend}`}>
            {topic.trend === 'up' && '↑ '}
            {topic.trend === 'down' && '↓ '}
            {topic.trendLabel}
          </span>
        </li>
      ))}
    </ul>
  );
}
