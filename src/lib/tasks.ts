export type Priority = "low" | "medium" | "high";

export type CategoryId =
  | "design"
  | "development"
  | "research"
  | "personal"
  | "operations";

export interface Category {
  id: CategoryId;
  label: string;
  /** CSS color value (oklch), applied through a --cat custom property */
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: CategoryId;
  priority: Priority;
  completed: boolean;
  createdAt: number;
  completedAt: number | null;
}

export const CATEGORIES: Category[] = [
  { id: "design", label: "Design", color: "var(--cat-design)" },
  { id: "development", label: "Development", color: "var(--cat-development)" },
  { id: "research", label: "Research", color: "var(--cat-research)" },
  { id: "personal", label: "Personal", color: "var(--cat-personal)" },
  { id: "operations", label: "Operations", color: "var(--cat-operations)" },
];

export const PRIORITIES: { id: Priority; label: string }[] = [
  { id: "low", label: "Low" },
  { id: "medium", label: "Medium" },
  { id: "high", label: "High" },
];

export function categoryById(id: CategoryId): Category {
  const found = CATEGORIES.find((c) => c.id === id);
  if (found) return found;
  return CATEGORIES[0]!;
}

const STORAGE_KEY = "nebula-tasks-v1";

const seedTasks: Task[] = [
  {
    id: "seed-1",
    title: "Ship the orbital dashboard redesign",
    description: "Final pass on the glass cards and neon glow tokens.",
    category: "design",
    priority: "high",
    completed: false,
    createdAt: Date.now() - 86400000 * 3,
    completedAt: null,
  },
  {
    id: "seed-2",
    title: "Wire up realtime sync engine",
    description: "Connect the client store to the sync service.",
    category: "development",
    priority: "high",
    completed: false,
    createdAt: Date.now() - 86400000 * 2,
    completedAt: null,
  },
  {
    id: "seed-3",
    title: "Research competitor AI workflows",
    description: "Benchmark Linear, Height, and Motion flows.",
    category: "research",
    priority: "medium",
    completed: false,
    createdAt: Date.now() - 86400000 * 2,
    completedAt: null,
  },
  {
    id: "seed-4",
    title: "Write launch announcement",
    description: "Draft the changelog and landing copy.",
    category: "operations",
    priority: "low",
    completed: false,
    createdAt: Date.now() - 86400000,
    completedAt: null,
  },
  {
    id: "seed-5",
    title: "Evening run — 5k",
    description: "Keep the streak alive.",
    category: "personal",
    priority: "low",
    completed: true,
    createdAt: Date.now() - 86400000,
    completedAt: Date.now() - 3600000,
  },
  {
    id: "seed-6",
    title: "Audit accessibility of core flows",
    description: "Keyboard nav + focus rings on every interactive card.",
    category: "development",
    priority: "medium",
    completed: true,
    createdAt: Date.now() - 86400000 * 4,
    completedAt: Date.now() - 86400000,
  },
];

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedTasks));
      return seedTasks;
    }
    const parsed = JSON.parse(raw) as Task[];
    return Array.isArray(parsed) ? parsed : seedTasks;
  } catch {
    return seedTasks;
  }
}

export function saveTasks(tasks: Task[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    /* storage unavailable — keep in-memory state */
  }
}

export function createTask(input: {
  title: string;
  description: string;
  category: CategoryId;
  priority: Priority;
}): Task {
  return {
    id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: input.title.trim(),
    description: input.description.trim(),
    category: input.category,
    priority: input.priority,
    completed: false,
    createdAt: Date.now(),
    completedAt: null,
  };
}
