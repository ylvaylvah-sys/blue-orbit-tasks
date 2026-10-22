import { motion } from "framer-motion";
import { Check, Trash2 } from "lucide-react";
import { categoryById, type Task } from "@/lib/tasks";
import { cn } from "@/lib/utils";

const priorityStyles: Record<Task["priority"], string> = {
  low: "text-muted-foreground border-border",
  medium: "text-primary border-primary/40",
  high: "text-destructive border-destructive/40",
};

const priorityLabel: Record<Task["priority"], string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const category = categoryById(task.category);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.18 } }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className={cn(
        "glass group relative flex items-start gap-4 rounded-2xl p-4 pl-5 transition-all duration-300",
        "hover:border-primary/40",
        task.completed ? "opacity-55" : "hover:glow-soft",
      )}
    >
      <span
        aria-hidden
        className="absolute top-4 bottom-4 left-0 w-[3px] rounded-full transition-opacity duration-300"
        style={{ background: category.color, opacity: task.completed ? 0.25 : 1 }}
      />

      <button
        role="checkbox"
        aria-checked={task.completed}
        aria-label={`Mark "${task.title}" as ${task.completed ? "active" : "complete"}`}
        onClick={() => onToggle(task.id)}
        className={cn(
          "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border-2 transition-all duration-300",
          task.completed
            ? "border-primary bg-primary text-primary-foreground glow-soft"
            : "border-input hover:border-primary hover:shadow-[0_0_12px_color-mix(in_oklab,var(--primary)_35%,transparent)]",
        )}
      >
        <motion.span
          initial={false}
          animate={{ scale: task.completed ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 22 }}
          className="grid place-items-center"
        >
          <Check className="size-3.5" strokeWidth={3} />
        </motion.span>
      </button>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm font-medium transition-colors duration-300",
            task.completed && "text-muted-foreground line-through",
          )}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{task.description}</p>
        )}
        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] font-medium">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5"
            style={{
              color: category.color,
              background: `color-mix(in oklab, ${category.color} 14%, transparent)`,
            }}
          >
            <span className="size-1.5 rounded-full" style={{ background: category.color }} />
            {category.label}
          </span>
          <span className={cn("rounded-full border px-2 py-0.5", priorityStyles[task.priority])}>
            {priorityLabel[task.priority]}
          </span>
        </div>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        aria-label={`Delete "${task.title}"`}
        className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg text-muted-foreground opacity-0 transition-all duration-200 group-hover:opacity-100 focus-visible:opacity-100 hover:bg-destructive/10 hover:text-destructive"
      >
        <Trash2 className="size-4" />
      </button>
    </motion.div>
  );
}
