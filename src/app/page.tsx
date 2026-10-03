"use client";

import { FormEvent, useState } from "react";
import { useEffect } from "react";

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

const STORAGE_KEY = "playwright-task-app-tasks";

function loadTasks(): Task[] {
  if (typeof window === "undefined") {
    return [];
  }

  const storedTasks = localStorage.getItem(STORAGE_KEY);

  if (!storedTasks) {
    return [];
  }

  try {
    return JSON.parse(storedTasks) as Task[];
  } catch {
    return [];
  }
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [title, setTitle] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      title: trimmedTitle,
      completed: false,
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);
    setTitle("");
  }

  function toggleTask(id: number) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function deleteTask(id: number) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  }

  const remainingCount = tasks.filter((task) => !task.completed).length;

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Task App</h1>
        <p className="mt-2 text-gray-600">シンプルなタスク管理アプリ</p>
      </div>

      <form onSubmit={addTask} className="mb-8 flex gap-3">
        <label htmlFor="task-title" className="sr-only">
          タスク名
        </label>

        <input
          id="task-title"
          name="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="タスクを入力してください"
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-4 py-3 transition outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          追加
        </button>
      </form>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">タスク一覧</h2>
        <span className="text-sm text-gray-500">未完了: {remainingCount}</span>
      </div>

      {tasks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">
          タスクはありません
        </div>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                aria-label={`${task.title}を完了にする`}
                className="h-5 w-5"
              />

              <span
                className={`flex-1 ${
                  task.completed
                    ? "text-gray-400 line-through"
                    : "text-gray-800"
                }`}
              >
                {task.title}
              </span>

              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                className="rounded px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50"
              >
                削除
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
