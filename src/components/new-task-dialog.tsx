import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CATEGORIES, PRIORITIES, type CategoryId, type Priority } from "@/lib/tasks";
import { cn } from "@/lib/utils";

interface NewTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (input: {
    title: string;
    description: string;
    category: CategoryId;
    priority: Priority;
  }) => void;
}

export function NewTaskDialog({ open, onOpenChange, onCreate }: NewTaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CategoryId>("development");
  const [priority, setPriority] = useState<Priority>("medium");

  useEffect(() => {
    if (!open) {
      setTitle("");
      setDescription("");
      setCategory("development");
      setPriority("medium");
    }
  }, [open]);

  const canSubmit = title.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    onCreate({ title, description, category, priority });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong max-w-md rounded-3xl border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Create a new task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="What needs to get done?"
            autoFocus
            className="h-11 rounded-xl bg-background/60"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add context (optional)"
            rows={3}
            className="resize-none rounded-xl bg-background/60"
          />

          <div>
            <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Category
            </p>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all duration-200",
                    category === c.id
                      ? "border-current"
                      : "border-border text-muted-foreground hover:border-foreground/30",
                  )}
                  style={
                    category === c.id
                      ? { color: c.color, background: `color-mix(in oklab, ${c.color} 12%, transparent)` }
                      : undefined
                  }
                >
                  <span className="size-1.5 rounded-full" style={{ background: c.color }} />
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Priority
            </p>
            <div className="grid grid-cols-3 gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id)}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-xs font-medium capitalize transition-all duration-200",
                    priority === p.id
                      ? "border-primary/60 bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-foreground/30",
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={submit}
            disabled={!canSubmit}
            className="h-11 w-full rounded-xl font-display font-semibold"
          >
            Create task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
