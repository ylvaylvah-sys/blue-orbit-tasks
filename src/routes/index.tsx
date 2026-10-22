import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Flame,
  ListChecks,
  Plus,
  Radar,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { CategoryFilter, type FilterValue } from "@/components/category-filter";
import { NewTaskDialog } from "@/components/new-task-dialog";
import { ProgressRing } from "@/components/progress-ring";
import { StatCard } from "@/components/stat-card";
import { TaskItem } from "@/components/task-item";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTasks } from "@/hooks/use-tasks";
import { CATEGORIES, categoryById, type CategoryId } from "@/lib/tasks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nebula — Futuristic Task Management" },
      {
        name: "description",
        content:
          "Nebula is a sleek, futuristic task command center — glassmorphism dashboard, progress tracking, categories, and instant task creation.",
      },
      { property: "og:title", content: "Nebula — Futuristic Task Management" },
      {
        property: "og:description",
        content: "Command your day with a glassmorphism task dashboard, progress rings, and neon focus.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { tasks, addTask, toggleTask, deleteTask, clearCompleted } = useTasks();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState<FilterValue>("all");

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = total - completed;
    const highPriority = tasks.filter((t) => t.priority === "high" && !t.completed).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, active, highPriority, percent };
  }, [tasks]);

  const counts = useMemo(() => {
    const result: Record<FilterValue, number> = {
      all: tasks.length,
      design: 0,
      development: 0,
      research: 0,
      personal: 0,
      operations: 0,
    };
    for (const t of tasks) result[t.category]++;
    return result;
  }, [tasks]);

  const categoryBreakdown = useMemo(
    () =>
      CATEGORIES.map((c) => {
        const catTasks = tasks.filter((t) => t.category === c.id);
        const done = catTasks.filter((t) => t.completed).length;
        const pct = catTasks.length === 0 ? 0 : Math.round((done / catTasks.length) * 100);
        return { ...c, total: catTasks.length, done, pct };
      }),
    [tasks],
  );

  const visibleTasks = useMemo(
    () => tasks.filter((t) => filter === "all" || t.category === filter),
    [tasks, filter],
  );
  const activeTasks = visibleTasks.filter((t) => !t.completed);
  const completedTasks = visibleTasks.filter((t) => t.completed);

  return (
    <div className="relative min-h-screen">
      <div className="app-aurora" />
      <div aria-hidden className="tech-grid pointer-events-none absolute inset-x-0 top-0 h-72" />

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Header */}
        <header className="flex items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="glow-soft grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-[var(--cat-research)] text-primary-foreground">
              <Sparkles className="size-5" />
            </span>
            <h1 className="truncate font-display text-lg font-bold tracking-wide">
              NEBULA
              <span className="ml-2 rounded-full border border-primary/40 px-2 py-0.5 align-middle text-[10px] font-medium tracking-widest text-primary">
                TASK OS
              </span>
            </h1>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
              <span className="pulse-dot size-1.5 rounded-full bg-primary" />
              Live sync
            </span>
            <ThemeToggle />
          </div>
        </header>

        {/* Hero */}
        <section className="mt-10 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-xs font-medium tracking-widest text-primary uppercase">
              <Radar className="size-3.5" /> Mission control
            </p>
            <h2 className="text-glow font-display mt-2 text-3xl font-bold sm:text-4xl">
              Command your day
            </h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              {stats.active === 0
                ? "All systems clear — every task is complete."
                : `${stats.active} active ${stats.active === 1 ? "mission" : "missions"} in orbit. ${stats.highPriority > 0 ? `${stats.highPriority} need priority attention.` : "Smooth trajectory."}`}
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => setDialogOpen(true)}
            className="glow-soft rounded-xl font-display font-semibold"
          >
            <Plus className="size-4" /> New task
          </Button>
        </section>

        {/* Stats */}
        <section className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard label="Total" value={stats.total} hint="tasks tracked" icon={ListChecks} />
          <StatCard label="Active" value={stats.active} hint="in progress now" icon={Circle} />
          <StatCard label="Done" value={stats.completed} hint="missions complete" icon={CheckCircle2} />
          <StatCard label="Priority" value={stats.highPriority} hint="high-priority open" icon={Flame} />
        </section>

        {/* Main grid */}
        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Task list column */}
          <section className="min-w-0 space-y-6">
            <CategoryFilter value={filter} onChange={setFilter} counts={counts} />

            <div>
              <h3 className="font-display mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                <Zap className="size-3.5 text-primary" /> Active
                <span className="text-xs normal-case opacity-60">({activeTasks.length})</span>
              </h3>
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {activeTasks.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                    />
                  ))}
                </AnimatePresence>
                {activeTasks.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass rounded-2xl px-4 py-10 text-center text-sm text-muted-foreground"
                  >
                    {filter === "all"
                      ? "Nothing in orbit — create your first task."
                      : `No active ${categoryById(filter as CategoryId).label.toLowerCase()} tasks.`}
                  </motion.div>
                )}
              </div>
            </div>

            {completedTasks.length > 0 && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-display flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                    <CheckCircle2 className="size-3.5" /> Completed
                    <span className="text-xs normal-case opacity-60">({completedTasks.length})</span>
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearCompleted}
                    className="h-8 gap-1.5 rounded-lg text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="size-3" /> Clear
                  </Button>
                </div>
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {completedTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </section>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="glass rounded-2xl p-5">
              <h3 className="font-display text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                Overall progress
              </h3>
              <div className="mt-4 grid place-items-center">
                <ProgressRing value={stats.percent} />
              </div>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                {stats.completed} of {stats.total} tasks complete
              </p>
            </div>

            <div className="glass rounded-2xl p-5">
              <h3 className="font-display text-sm font-semibold tracking-wide text-muted-foreground uppercase">
                Categories
              </h3>
              <div className="mt-4 space-y-3.5">
                {categoryBreakdown.map((c) => (
                  <div key={c.id}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="inline-flex items-center gap-1.5 font-medium">
                        <span className="size-1.5 rounded-full" style={{ background: c.color }} />
                        {c.label}
                      </span>
                      <span className="tabular-nums text-muted-foreground">
                        {c.done}/{c.total}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: c.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${c.pct}%` }}
                        transition={{ type: "spring", stiffness: 70, damping: 20 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <NewTaskDialog open={dialogOpen} onOpenChange={setDialogOpen} onCreate={addTask} />
    </div>
  );
}
