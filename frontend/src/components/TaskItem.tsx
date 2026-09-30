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

export default function TaskItem({ task, isUpdating, onStatusChange }) {
  const status = task.status || 'TODO';
  const done = status === 'DONE';
  const priority = PRIORITY[task.priority];
  const title = task.title || task.name || 'Untitled task';
  const assigneeName = task.assignee?.username || null;
  const statusIndex = STATUS_OPTIONS.findIndex((option) => option.value === status);
  const statusOption = STATUS_OPTIONS[statusIndex] || STATUS_OPTIONS[0];
  const nextStatus = STATUS_OPTIONS[(statusIndex + 1) % STATUS_OPTIONS.length].value;

  return (
    <div className={'task-card' + (done ? ' done' : '')}>
      <div className="task-main">
        <span className="task-title">{title}</span>
        <div className="task-meta">
          <span className={'status-badge status-' + status.toLowerCase()}>
            {statusOption.label}
          </span>
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
        </div>
      </div>
      <button
        type="button"
        className="toggle-btn"
        disabled={isUpdating}
        aria-busy={isUpdating}
        aria-label={`Task status: ${statusOption.label}. Click to change status.`}
        onClick={() => onStatusChange(task, nextStatus)}
      >
        {isUpdating ? 'Saving...' : statusOption.label}
      </button>
    </div>
  );
}
