import { CATEGORIES, type CategoryId } from "@/lib/tasks";
import { cn } from "@/lib/utils";

export type FilterValue = CategoryId | "all";

interface CategoryFilterProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  counts: Record<FilterValue, number>;
}

export function CategoryFilter({ value, onChange, counts }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={() => onChange("all")}
        className={cn(
          "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
          value === "all"
            ? "border-primary/60 bg-primary/10 text-primary glow-soft"
            : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
        )}
      >
        All · {counts.all}
      </button>
      {CATEGORIES.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200",
            value === c.id
              ? "border-current"
              : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
          )}
          style={
            value === c.id
              ? { color: c.color, background: `color-mix(in oklab, ${c.color} 12%, transparent)` }
              : undefined
          }
        >
          <span className="size-1.5 rounded-full" style={{ background: c.color }} />
          {c.label} · {counts[c.id]}
        </button>
      ))}
    </div>
  );
}
