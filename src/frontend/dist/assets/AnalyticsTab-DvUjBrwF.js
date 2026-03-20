import { r as reactExports, c as useAddMockScore, j as jsxRuntimeExports, B as Button, P as Palette, m as motion, L as Label, I as Input, d as ChartColumn, T as Target, e as Progress, b as ue } from "./index-BsN7n755.js";
import { C as Card, c as CardContent, a as CardHeader, b as CardTitle } from "./card-DpdnamAG.js";
import { u as useSectionStyle, S as SectionStylePanel } from "./SectionStylePanel-N7W_wvoR.js";
import { P as Plus } from "./plus-BIQ3KfIE.js";
import { A as Award } from "./award-Bd1GaVME.js";
function ScoreBar({ score, max = 200 }) {
  const pct = Math.min(score / max * 100, 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { width: 0 },
        animate: { width: `${pct}%` },
        transition: { duration: 0.6, ease: "easeOut" },
        className: "h-full bg-primary rounded-full"
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm font-semibold text-foreground w-10 text-right", children: score })
  ] });
}
function AnalyticsTab({
  mockScores,
  isLoading,
  overallCompletion,
  predictedScore
}) {
  const [scoreInput, setScoreInput] = reactExports.useState("");
  const addScore = useAddMockScore();
  const [showStylePanel, setShowStylePanel] = reactExports.useState(false);
  const styleBtnRef = reactExports.useRef(null);
  const { style: sectionStyle } = useSectionStyle("analytics");
  const rawScores = mockScores.map(Number);
  const scores = rawScores.map((v, idx) => ({
    value: v,
    uid: `sc-${idx}-${v}`
  }));
  const avgScore = rawScores.length > 0 ? Math.round(rawScores.reduce((a, b) => a + b, 0) / rawScores.length) : 0;
  const maxScore = rawScores.length > 0 ? Math.max(...rawScores) : 0;
  const handleAddScore = (e) => {
    e.preventDefault();
    const val = Number.parseInt(scoreInput, 10);
    if (Number.isNaN(val) || val < 0 || val > 200) {
      ue.error("Enter a valid score between 0 and 200");
      return;
    }
    addScore.mutate(val, {
      onSuccess: () => {
        ue.success(`Score ${val} added`);
        setScoreInput("");
      },
      onError: () => ue.error("Failed to add score")
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-3xl mx-auto", style: sectionStyle, children: [
    showStylePanel && /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionStylePanel,
      {
        sectionId: "analytics",
        sectionLabel: "Analytics",
        onClose: () => setShowStylePanel(false),
        anchorRef: styleBtnRef
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: "Analytics" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Mock test scores and performance prediction" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          ref: styleBtnRef,
          size: "sm",
          variant: "outline",
          className: "h-7 w-7 p-0 border-border text-muted-foreground hover:text-primary hover:border-primary/50 shrink-0",
          onClick: () => setShowStylePanel((p) => !p),
          title: "Customize section style",
          "data-ocid": "analytics.style.button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 13 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-6", children: [
      {
        label: "Predicted Score",
        value: predictedScore,
        suffix: "/200",
        highlight: true
      },
      { label: "Average Score", value: avgScore, suffix: "/200" },
      { label: "Best Score", value: maxScore, suffix: "/200" },
      { label: "Completion", value: overallCompletion, suffix: "%" }
    ].map((stat, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: i * 0.07 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Card,
          {
            className: `border ${stat.highlight ? "border-primary/30 bg-primary/5" : "border-border"}`,
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "p-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground uppercase tracking-wider mb-1", children: stat.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-0.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: `font-display text-2xl font-bold leading-none ${stat.highlight ? "text-primary glow-red" : "text-foreground"}`,
                    children: stat.value
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground mb-0.5", children: stat.suffix })
              ] })
            ] })
          }
        )
      },
      stat.label
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, x: -12 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: 0.2 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16, className: "text-primary" }),
              "Add Mock Score"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddScore, className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Label,
                    {
                      htmlFor: "score-input",
                      className: "text-xs text-muted-foreground uppercase tracking-wider",
                      children: "Score (0 – 200)"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Input,
                    {
                      id: "score-input",
                      type: "number",
                      min: 0,
                      max: 200,
                      placeholder: "e.g. 145",
                      value: scoreInput,
                      onChange: (e) => setScoreInput(e.target.value),
                      className: "bg-muted/40 border-input focus:border-primary/50 font-mono"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    type: "submit",
                    disabled: addScore.isPending || !scoreInput,
                    className: "w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold",
                    children: addScore.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" }),
                      "Adding..."
                    ] }) : "Add Score"
                  }
                )
              ] }),
              rawScores.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 p-3 rounded-lg bg-muted/40 border border-border", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-2", children: "Score Breakdown" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-xs", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Mock average" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: avgScore })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: "Consistency bonus" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-primary", children: [
                      "+",
                      Math.round(overallCompletion / 10)
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-t border-border pt-1 mt-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-foreground font-medium", children: "Predicted" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-primary", children: predictedScore })
                  ] })
                ] })
              ] })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, x: 12 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: 0.25 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border h-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base font-semibold flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChartColumn, { size: 16, className: "text-primary" }),
              "Score History"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: [1, 2, 3].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-6 rounded bg-muted animate-pulse"
              },
              i
            )) }) : rawScores.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-8 text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Target, { size: 24, className: "text-muted-foreground mb-2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No scores yet" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Add your first mock test score" })
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: scores.map(({ value, uid }, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, x: 10 },
                animate: { opacity: 1, x: 0 },
                transition: { delay: i * 0.05 },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground w-12", children: [
                      "Test ",
                      i + 1
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: `text-[10px] px-1.5 py-0.5 rounded font-semibold ${value >= 150 ? "bg-primary/15 text-primary" : value >= 120 ? "bg-yellow-500/15 text-yellow-500" : "bg-muted text-muted-foreground"}`,
                        children: value >= 150 ? "STRONG" : value >= 120 ? "GOOD" : "WEAK"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ScoreBar, { score: value })
                ]
              },
              uid
            )) }) })
          ] })
        }
      )
    ] }),
    rawScores.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.35 },
        className: "mt-6",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Card, { className: "border-primary/20 bg-primary/5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "p-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { size: 18, className: "text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-foreground", children: "SSC CGL Score Prediction" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              "Your predicted score is",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsxs("strong", { className: "text-primary", children: [
                predictedScore,
                "/200"
              ] }),
              ".",
              " ",
              predictedScore >= 150 ? "Excellent! Keep maintaining this consistency." : predictedScore >= 120 ? "Good progress! Focus on weak subjects to improve." : "More consistent practice needed. Target weaker areas."
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Progress,
            {
              value: predictedScore / 200 * 100,
              className: "w-20 h-1.5 bg-muted"
            }
          ) })
        ] }) }) })
      }
    )
  ] });
}
export {
  AnalyticsTab as default
};
