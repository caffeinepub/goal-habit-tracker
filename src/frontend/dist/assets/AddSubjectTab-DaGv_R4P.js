import { r as reactExports, u as useAddSubject, j as jsxRuntimeExports, B as Button, P as Palette, m as motion, a as BookOpen, L as Label, I as Input, C as CirclePlus, b as ue } from "./index-DLAs_Gc6.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-Dxf4uiUA.js";
import { T as Textarea } from "./textarea-DCHM9Df5.js";
import { u as useSectionStyle, S as SectionStylePanel } from "./SectionStylePanel-0LZveikG.js";
const SUBJECT_TEMPLATES = [
  {
    name: "Quantitative Aptitude",
    desc: "Number system, Algebra, Geometry, Trigonometry, Data Interpretation"
  },
  {
    name: "English Language",
    desc: "Reading comprehension, Grammar, Vocabulary, Cloze test, Error spotting"
  },
  {
    name: "General Intelligence",
    desc: "Reasoning, Analogies, Series, Coding-decoding, Directions"
  },
  {
    name: "General Awareness",
    desc: "Current affairs, History, Geography, Polity, Science & Technology"
  },
  {
    name: "Statistics (Tier II)",
    desc: "Collection of data, Measures of central tendency, Dispersion, Correlation"
  }
];
function AddSubjectTab() {
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const addSubject = useAddSubject();
  const [showStylePanel, setShowStylePanel] = reactExports.useState(false);
  const styleBtnRef = reactExports.useRef(null);
  const { style: sectionStyle } = useSectionStyle("addsubject");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      ue.error("Subject name is required");
      return;
    }
    addSubject.mutate(
      { name: name.trim(), description: description.trim() },
      {
        onSuccess: () => {
          ue.success(`"${name}" added successfully`);
          setName("");
          setDescription("");
        },
        onError: () => ue.error("Failed to add subject")
      }
    );
  };
  const applyTemplate = (template) => {
    setName(template.name);
    setDescription(template.desc);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 max-w-2xl mx-auto", style: sectionStyle, children: [
    showStylePanel && /* @__PURE__ */ jsxRuntimeExports.jsx(
      SectionStylePanel,
      {
        sectionId: "addsubject",
        sectionLabel: "Add Subject",
        onClose: () => setShowStylePanel(false),
        anchorRef: styleBtnRef
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex items-start justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-2xl font-bold text-foreground", children: "Add Subject" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-0.5", children: "Add a new subject to your 30-day tracker" })
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
          "data-ocid": "addsubject.style.button",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 13 })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-border mb-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { className: "pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "font-display text-base font-semibold flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { size: 16, className: "text-primary" }),
            "Subject Details"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "subject-name",
                  className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
                  children: "Subject Name *"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  id: "subject-name",
                  placeholder: "e.g. Quantitative Aptitude",
                  value: name,
                  onChange: (e) => setName(e.target.value),
                  className: "bg-muted/40 border-input focus:border-primary/50",
                  autoComplete: "off"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Label,
                {
                  htmlFor: "subject-desc",
                  className: "text-xs font-medium text-muted-foreground uppercase tracking-wider",
                  children: "Topic Details"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Textarea,
                {
                  id: "subject-desc",
                  placeholder: "Topics covered: Number system, Algebra, Geometry...",
                  value: description,
                  onChange: (e) => setDescription(e.target.value),
                  rows: 3,
                  className: "bg-muted/40 border-input focus:border-primary/50 resize-none"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "submit",
                disabled: addSubject.isPending || !name.trim(),
                className: "w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold",
                children: addSubject.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" }),
                  "Adding..."
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { size: 16 }),
                  "Add Subject"
                ] })
              }
            )
          ] }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground uppercase tracking-wider font-medium mb-3", children: "Quick Templates" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: SUBJECT_TEMPLATES.map((template, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.button,
        {
          initial: { opacity: 0, x: -8 },
          animate: { opacity: 1, x: 0 },
          transition: { delay: i * 0.05 },
          onClick: () => applyTemplate(template),
          className: "w-full text-left p-3 rounded-lg border border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-150 group",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground group-hover:text-primary transition-colors", children: template.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5 line-clamp-1", children: template.desc })
          ]
        },
        template.name
      )) })
    ] })
  ] });
}
export {
  AddSubjectTab as default
};
