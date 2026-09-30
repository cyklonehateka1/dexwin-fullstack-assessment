const PRIORITY = {
  1: { label: 'High', cls: 'high' },
  2: { label: 'Medium', cls: 'medium' },
  3: { label: 'Low', cls: 'low' },
};

const STATUS_OPTIONS = [
  { value: 'TODO', label: 'To do' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'DONE', label: 'Done' },
];

export default function TaskItem({ task, onStatusChange }) {
  const status = task.status || 'TODO';
  const done = status === 'DONE';
  const priority = PRIORITY[task.priority];
  const title = task.title || task.name || 'Untitled task';
  const assigneeName = task.assignee?.username || null;
  const statusLabel = STATUS_OPTIONS.find((option) => option.value === status)?.label || 'To do';

  return (
    <div className={'task-card' + (done ? ' done' : '')}>
      <div className="task-main">
        <span className="task-title">{title}</span>
        <div className="task-meta">
          <label className="status-picker">
            <span className="sr-only">Task status</span>
            <select
              value={status}
              onChange={(event) => onStatusChange(task, event.target.value)}
              className={'status-select status-' + status.toLowerCase()}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          {task.priority != null && (
            <span className={'priority-pill' + (priority ? ' priority-' + priority.cls : '')}>
              {priority ? priority.label : 'P' + task.priority}
            </span>
          )}
          {assigneeName ? (
            <span className="assignee-chip">{assigneeName}</span>
          ) : (
            <span className="assignee-chip unassigned">Unassigned</span>
          )}
          <span className={'status-badge status-' + status.toLowerCase()}>{statusLabel}</span>
        </div>
      </div>
    </div>
  );
}
