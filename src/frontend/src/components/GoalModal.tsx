import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import type { Goal } from "../backend.d";

interface GoalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  goal?: Goal | null;
  onSubmit: (data: {
    title: string;
    description: string;
    targetCount: number;
  }) => Promise<void>;
  isLoading: boolean;
}

export default function GoalModal({
  open,
  onOpenChange,
  goal,
  onSubmit,
  isLoading,
}: GoalModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [targetCount, setTargetCount] = useState("30");

  useEffect(() => {
    if (!open) return;
    if (goal) {
      setTitle(goal.title);
      setDescription(goal.description);
      setTargetCount(Number(goal.targetCount).toString());
    } else {
      setTitle("");
      setDescription("");
      setTargetCount("30");
    }
  }, [goal, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(targetCount, 10);
    if (!title.trim() || isNaN(count) || count < 1) return;
    await onSubmit({ title: title.trim(), description: description.trim(), targetCount: count });
  };

  const isEditing = !!goal;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border bg-[oklch(0.19_0.02_252)] text-foreground shadow-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">
            {isEditing ? "Edit Goal" : "New Goal"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="goal-title" className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Title
            </Label>
            <Input
              id="goal-title"
              placeholder="e.g. Run every morning"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="bg-muted/50 border-border focus:border-primary focus:ring-primary/30 placeholder:text-muted-foreground/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal-description" className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Description
            </Label>
            <Textarea
              id="goal-description"
              placeholder="What does success look like?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="bg-muted/50 border-border focus:border-primary focus:ring-primary/30 placeholder:text-muted-foreground/50 resize-none"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="goal-target" className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Target Days
            </Label>
            <Input
              id="goal-target"
              type="number"
              placeholder="30"
              min={1}
              max={365}
              value={targetCount}
              onChange={(e) => setTargetCount(e.target.value)}
              required
              className="bg-muted/50 border-border focus:border-primary focus:ring-primary/30"
            />
            <p className="text-xs text-muted-foreground">
              Number of completions to reach 100%
            </p>
          </div>
          <DialogFooter className="pt-2 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-border hover:bg-accent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-sm"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Create Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
