import { useMemo, useState } from 'react';
import {
  TASK_PRIORITY_LABELS,
  type AdminTask,
  type TaskDueGroup,
} from '../data/tasksMockData';

type TaskFilter = 'open' | TaskDueGroup | 'completed';

type TasksViewProps = {
  tasks: AdminTask[];
  onToggleTask: (id: string) => void;
};

const FILTERS: Array<{ id: TaskFilter; label: string }> = [
  { id: 'open', label: 'פתוחות' },
  { id: 'today', label: 'להיום' },
  { id: 'overdue', label: 'באיחור' },
  { id: 'upcoming', label: 'בהמשך' },
  { id: 'completed', label: 'הושלמו' },
];

const DUE_ORDER: Record<TaskDueGroup, number> = {
  overdue: 0,
  today: 1,
  upcoming: 2,
};

export default function TasksView({ tasks, onToggleTask }: TasksViewProps) {
  const [filter, setFilter] = useState<TaskFilter>('open');

  const visibleTasks = useMemo(() => {
    const filtered = tasks.filter((task) => {
      if (filter === 'completed') return task.completed;
      if (filter === 'open') return !task.completed;
      return !task.completed && task.dueGroup === filter;
    });

    return filtered.sort((a, b) => DUE_ORDER[a.dueGroup] - DUE_ORDER[b.dueGroup]);
  }, [filter, tasks]);

  const openCount = tasks.filter((task) => !task.completed).length;
  const todayCount = tasks.filter((task) => !task.completed && task.dueGroup === 'today').length;
  const overdueCount = tasks.filter((task) => !task.completed && task.dueGroup === 'overdue').length;

  return (
    <div className="admin-view admin-view--tasks">
      <header className="admin-view-header">
        <h1 className="admin-view-title text-h2-bold">משימות</h1>
        <p className="admin-view-sub text-small-normal">כל מה שדורש טיפול, לפי דחיפות ומועד</p>
      </header>

      <section className="tasks-summary" aria-label="סיכום משימות">
        <div className="tasks-summary-item">
          <strong className="text-h2-bold">{openCount}</strong>
          <span className="text-small-normal">משימות פתוחות</span>
        </div>
        <div className="tasks-summary-item">
          <strong className="text-h2-bold">{todayCount}</strong>
          <span className="text-small-normal">להיום</span>
        </div>
        <div className={`tasks-summary-item${overdueCount ? ' is-urgent' : ''}`}>
          <strong className="text-h2-bold">{overdueCount}</strong>
          <span className="text-small-normal">באיחור</span>
        </div>
      </section>

      <section className="tasks-card" aria-labelledby="tasks-list-title">
        <div className="tasks-card-head">
          <div>
            <h2 id="tasks-list-title" className="text-small-bold">המשימות שלי</h2>
            <p className="text-tiny-normal">{visibleTasks.length} משימות בתצוגה</p>
          </div>
          <div className="tasks-filters" aria-label="סינון משימות">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`tasks-filter text-tiny-bold${filter === item.id ? ' is-active' : ''}`}
                onClick={() => setFilter(item.id)}
                aria-pressed={filter === item.id}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="tasks-list">
          {visibleTasks.map((task) => (
            <article key={task.id} className={`task-row priority-${task.priority}${task.completed ? ' is-completed' : ''}`}>
              <button
                type="button"
                className="task-checkbox"
                onClick={() => onToggleTask(task.id)}
                aria-label={task.completed ? `פתיחת המשימה מחדש: ${task.title}` : `סימון כהושלמה: ${task.title}`}
                aria-pressed={task.completed}
              >
                {task.completed && <span aria-hidden="true">✓</span>}
              </button>

              <div className="task-row-content">
                <div className="task-row-title">
                  <h3 className="text-small-bold">{task.title}</h3>
                  <span className={`task-priority priority-${task.priority} text-tiny-bold`}>
                    {TASK_PRIORITY_LABELS[task.priority]}
                  </span>
                </div>
                <p className="task-description text-small-normal">{task.description}</p>
                <div className="task-metadata">
                  <span className="text-tiny-normal">{task.context}</span>
                  <time className={`text-tiny-bold${task.dueGroup === 'overdue' && !task.completed ? ' is-overdue' : ''}`}>
                    {task.dueLabel}
                  </time>
                </div>
              </div>
            </article>
          ))}

          {visibleTasks.length === 0 && (
            <div className="tasks-empty">
              <span aria-hidden="true">✓</span>
              <p className="text-small-bold">אין משימות בתצוגה הזו</p>
              <button type="button" className="admin-btn admin-btn--ghost text-small-normal" onClick={() => setFilter('open')}>
                הצגת משימות פתוחות
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
