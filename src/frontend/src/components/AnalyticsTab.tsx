import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Award, BarChart3, Plus, Target, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddMockScore } from "../hooks/useQueries";

interface AnalyticsTabProps {
  mockScores: bigint[];
  isLoading: boolean;
  overallCompletion: number;
  predictedScore: number;
}

function ScoreBar({ score, max = 200 }: { score: number; max?: number }) {
  const pct = Math.min((score / max) * 100, 100);
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="h-full bg-primary rounded-full"
        />
      </div>
      <span className="font-mono text-sm font-semibold text-foreground w-10 text-right">
        {score}
      </span>
    </div>
  );
}

export default function AnalyticsTab({
  mockScores,
  isLoading,
  overallCompletion,
  predictedScore,
}: AnalyticsTabProps) {
  const [scoreInput, setScoreInput] = useState("");
  const addScore = useAddMockScore();

  const rawScores = mockScores.map(Number);
  const scores = rawScores.map((v, idx) => ({
    value: v,
    uid: `sc-${idx}-${v}`,
  }));
  const avgScore =
    rawScores.length > 0
      ? Math.round(rawScores.reduce((a, b) => a + b, 0) / rawScores.length)
      : 0;
  const maxScore = rawScores.length > 0 ? Math.max(...rawScores) : 0;

  const handleAddScore = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number.parseInt(scoreInput, 10);
    if (Number.isNaN(val) || val < 0 || val > 200) {
      toast.error("Enter a valid score between 0 and 200");
      return;
    }
    addScore.mutate(val, {
      onSuccess: () => {
        toast.success(`Score ${val} added`);
        setScoreInput("");
      },
      onError: () => toast.error("Failed to add score"),
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">
          Analytics
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Mock test scores and performance prediction
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          {
            label: "Predicted Score",
            value: predictedScore,
            suffix: "/200",
            highlight: true,
          },
          { label: "Average Score", value: avgScore, suffix: "/200" },
          { label: "Best Score", value: maxScore, suffix: "/200" },
          { label: "Completion", value: overallCompletion, suffix: "%" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
          >
            <Card
              className={`border ${stat.highlight ? "border-primary/30 bg-primary/5" : "border-border"}`}
            >
              <CardContent className="p-4">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
                  {stat.label}
                </p>
                <div className="flex items-end gap-0.5">
                  <span
                    className={`font-display text-2xl font-bold leading-none ${
                      stat.highlight
                        ? "text-primary glow-red"
                        : "text-foreground"
                    }`}
                  >
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted-foreground mb-0.5">
                    {stat.suffix}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Add Score */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base font-semibold flex items-center gap-2">
                <Plus size={16} className="text-primary" />
                Add Mock Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddScore} className="space-y-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="score-input"
                    className="text-xs text-muted-foreground uppercase tracking-wider"
                  >
                    Score (0 – 200)
                  </Label>
                  <Input
                    id="score-input"
                    type="number"
                    min={0}
                    max={200}
                    placeholder="e.g. 145"
                    value={scoreInput}
                    onChange={(e) => setScoreInput(e.target.value)}
                    className="bg-muted/40 border-input focus:border-primary/50 font-mono"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={addScore.isPending || !scoreInput}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  {addScore.isPending ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Adding...
                    </span>
                  ) : (
                    "Add Score"
                  )}
                </Button>
              </form>

              {/* Score prediction breakdown */}
              {rawScores.length > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-muted/40 border border-border">
                  <p className="text-xs text-muted-foreground mb-2">
                    Score Breakdown
                  </p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Mock average
                      </span>
                      <span className="font-mono text-foreground">
                        {avgScore}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Consistency bonus
                      </span>
                      <span className="font-mono text-primary">
                        +{Math.round(overallCompletion / 10)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-1 mt-1">
                      <span className="text-foreground font-medium">
                        Predicted
                      </span>
                      <span className="font-mono font-bold text-primary">
                        {predictedScore}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Score history */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Card className="border-border h-full">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-base font-semibold flex items-center gap-2">
                <BarChart3 size={16} className="text-primary" />
                Score History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-6 rounded bg-muted animate-pulse"
                    />
                  ))}
                </div>
              ) : rawScores.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Target size={24} className="text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No scores yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add your first mock test score
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scores.map(({ value, uid }, i) => (
                    <motion.div
                      key={uid}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground w-12">
                          Test {i + 1}
                        </span>
                        <div
                          className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                            value >= 150
                              ? "bg-primary/15 text-primary"
                              : value >= 120
                                ? "bg-yellow-500/15 text-yellow-500"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {value >= 150
                            ? "STRONG"
                            : value >= 120
                              ? "GOOD"
                              : "WEAK"}
                        </div>
                      </div>
                      <ScoreBar score={value} />
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Prediction summary */}
      {rawScores.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-6"
        >
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <Award size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-display font-semibold text-foreground">
                    SSC CGL Score Prediction
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your predicted score is{" "}
                    <strong className="text-primary">
                      {predictedScore}/200
                    </strong>
                    .{" "}
                    {predictedScore >= 150
                      ? "Excellent! Keep maintaining this consistency."
                      : predictedScore >= 120
                        ? "Good progress! Focus on weak subjects to improve."
                        : "More consistent practice needed. Target weaker areas."}
                  </p>
                </div>
                <div className="shrink-0">
                  <Progress
                    value={(predictedScore / 200) * 100}
                    className="w-20 h-1.5 bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
