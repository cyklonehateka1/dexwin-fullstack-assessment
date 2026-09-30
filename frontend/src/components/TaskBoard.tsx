import { useEffect, useState } from 'react';
import { getTasks, updateTaskStatus } from '../api/client';
import TaskItem from './TaskItem';

export default function TaskBoard({ projectId }) {
  const [tasks, setTasks] = useState([]);

  const refreshTasks = async () => {
    const data = await getTasks(projectId);
    setTasks(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    if (!projectId) return;
    refreshTasks();
  }, [projectId]);

  const handleStatusChange = async (task, nextStatus) => {
    const previousStatus = task.status;

    setTasks((currentTasks) =>
      currentTasks.map((item) =>
        item.id === task.id ? { ...item, status: nextStatus } : item,
      ),
    );

    try {
      await updateTaskStatus(task.id, nextStatus);
    } catch (error) {
      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.id === task.id ? { ...item, status: previousStatus } : item,
        ),
      );
      console.error('Failed to update task status:', error);
    }
  };

  return (
    <div>
      <div className="board-header">
        <h2>Tasks</h2>
        <span className="task-count">{tasks.length}</span>
      </div>
      <div className="task-list">
        {tasks.map((task, index) => (
          <TaskItem
            key={task.id ?? index}
            task={task}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
}
