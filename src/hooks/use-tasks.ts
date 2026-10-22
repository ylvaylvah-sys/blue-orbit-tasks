import { useCallback, useEffect, useState } from "react";
import {
  createTask as makeTask,
  loadTasks,
  saveTasks,
  type CategoryId,
  type Priority,
  type Task,
} from "@/lib/tasks";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback(
    (input: {
      title: string;
      description: string;
      category: CategoryId;
      priority: Priority;
    }) => {
      const task = makeTask(input);
      setTasks((prev) => [task, ...prev]);
      return task;
    },
    [],
  );

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? Date.now() : null,
            }
          : t,
      ),
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  }, []);

  return { tasks, addTask, toggleTask, deleteTask, clearCompleted };
}
