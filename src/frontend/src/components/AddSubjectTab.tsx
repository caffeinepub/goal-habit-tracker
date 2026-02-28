import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, PlusCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddSubject } from "../hooks/useQueries";

const SUBJECT_TEMPLATES = [
  {
    name: "Quantitative Aptitude",
    desc: "Number system, Algebra, Geometry, Trigonometry, Data Interpretation",
  },
  {
    name: "English Language",
    desc: "Reading comprehension, Grammar, Vocabulary, Cloze test, Error spotting",
  },
  {
    name: "General Intelligence",
    desc: "Reasoning, Analogies, Series, Coding-decoding, Directions",
  },
  {
    name: "General Awareness",
    desc: "Current affairs, History, Geography, Polity, Science & Technology",
  },
  {
    name: "Statistics (Tier II)",
    desc: "Collection of data, Measures of central tendency, Dispersion, Correlation",
  },
];

export default function AddSubjectTab() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const addSubject = useAddSubject();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Subject name is required");
      return;
    }
    addSubject.mutate(
      { name: name.trim(), description: description.trim() },
      {
        onSuccess: () => {
          toast.success(`"${name}" added successfully`);
          setName("");
          setDescription("");
        },
        onError: () => toast.error("Failed to add subject"),
      },
    );
  };

  const applyTemplate = (template: { name: string; desc: string }) => {
    setName(template.name);
    setDescription(template.desc);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Add Subject
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Add a new subject to your 30-day tracker
        </p>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-border mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="font-display text-base font-semibold flex items-center gap-2">
              <BookOpen size={16} className="text-primary" />
              Subject Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="subject-name"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Subject Name *
                </Label>
                <Input
                  id="subject-name"
                  placeholder="e.g. Quantitative Aptitude"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-muted/40 border-input focus:border-primary/50"
                  autoComplete="off"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="subject-desc"
                  className="text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  Topic Details
                </Label>
                <Textarea
                  id="subject-desc"
                  placeholder="Topics covered: Number system, Algebra, Geometry..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="bg-muted/40 border-input focus:border-primary/50 resize-none"
                />
              </div>

              <Button
                type="submit"
                disabled={addSubject.isPending || !name.trim()}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                {addSubject.isPending ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    Adding...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <PlusCircle size={16} />
                    Add Subject
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* Templates */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3">
          Quick Templates
        </p>
        <div className="space-y-2">
          {SUBJECT_TEMPLATES.map((template, i) => (
            <motion.button
              key={template.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => applyTemplate(template)}
              className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-150 group"
            >
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {template.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {template.desc}
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
