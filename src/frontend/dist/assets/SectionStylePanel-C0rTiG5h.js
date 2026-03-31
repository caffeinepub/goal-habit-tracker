import { f as createLucideIcon, r as reactExports, j as jsxRuntimeExports, P as Palette, _ as X, L as Label, ag as Type, b8 as ALargeSmall, a1 as Slider, B as Button } from "./index-CkkKRQCz.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
];
const RotateCcw = createLucideIcon("rotate-ccw", __iconNode);
const FONT_OPTIONS = [
  { value: "Satoshi", label: "Satoshi" },
  { value: "Cabinet Grotesk", label: "Cabinet Grotesk" },
  { value: "Geist Mono", label: "Geist Mono" },
  { value: "Bricolage Grotesque", label: "Bricolage Grotesque" },
  { value: "Fraunces", label: "Fraunces (Display)" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Instrument Serif", label: "Instrument Serif" },
  { value: "Georgia", label: "Georgia (Serif)" },
  { value: "Arial", label: "Arial" },
  { value: "Trebuchet MS", label: "Trebuchet" },
  { value: "Verdana", label: "Verdana" },
  { value: "Courier New", label: "Courier New (Mono)" },
  { value: "JetBrains Mono", label: "JetBrains Mono" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "system-ui", label: "System Default" }
];
const TEXT_COLOR_PRESETS = [
  { label: "Warm White", color: "#e8e0d0" },
  { label: "Pure White", color: "#ffffff" },
  { label: "Soft Gray", color: "#c9cdd4" },
  { label: "Cream", color: "#fdf6e3" },
  { label: "Cool White", color: "#e2e8f0" },
  { label: "Pale Yellow", color: "#fefce8" },
  { label: "Sky Blue", color: "#bae6fd" },
  { label: "Mint Green", color: "#bbf7d0" },
  { label: "Lavender", color: "#e9d5ff" },
  { label: "Peach", color: "#fed7aa" },
  { label: "Dark Gray", color: "#374151" },
  { label: "Charcoal", color: "#1f2937" }
];
const ACCENT_COLOR_PRESETS = [
  { label: "Crimson", color: "#e53e3e" },
  { label: "Blue", color: "#3b82f6" },
  { label: "Sky", color: "#0ea5e9" },
  { label: "Emerald", color: "#10b981" },
  { label: "Purple", color: "#a855f7" },
  { label: "Orange", color: "#f97316" },
  { label: "Pink", color: "#ec4899" },
  { label: "Amber", color: "#f59e0b" },
  { label: "Teal", color: "#14b8a6" },
  { label: "Indigo", color: "#6366f1" },
  { label: "Lime", color: "#84cc16" },
  { label: "Rose", color: "#f43f5e" }
];
const DEFAULT_SECTION_STYLE = {
  fontFamily: "",
  fontSize: 0,
  textColor: "",
  accentColor: ""
};
const SECTION_STYLE_EVENT = "ssc-section-style-change";
function getStorageKey(sectionId) {
  return `ssc_section_style_${sectionId}`;
}
function loadSectionStyle(sectionId) {
  try {
    const s = localStorage.getItem(getStorageKey(sectionId));
    return s ? { ...DEFAULT_SECTION_STYLE, ...JSON.parse(s) } : { ...DEFAULT_SECTION_STYLE };
  } catch {
    return { ...DEFAULT_SECTION_STYLE };
  }
}
function saveSectionStyle(sectionId, style) {
  localStorage.setItem(getStorageKey(sectionId), JSON.stringify(style));
  window.dispatchEvent(
    new CustomEvent(SECTION_STYLE_EVENT, { detail: { sectionId } })
  );
}
function useSectionStyle(sectionId) {
  const [sectionStyle, setSectionStyle] = reactExports.useState(
    () => loadSectionStyle(sectionId)
  );
  const refreshStyle = () => {
    setSectionStyle(loadSectionStyle(sectionId));
  };
  reactExports.useEffect(() => {
    function handleCustom(e) {
      const detail = e.detail;
      if ((detail == null ? void 0 : detail.sectionId) === sectionId) {
        setSectionStyle(loadSectionStyle(sectionId));
      }
    }
    function handleStorage(e) {
      if (e.key === getStorageKey(sectionId)) {
        setSectionStyle(loadSectionStyle(sectionId));
      }
    }
    window.addEventListener(SECTION_STYLE_EVENT, handleCustom);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener(SECTION_STYLE_EVENT, handleCustom);
      window.removeEventListener("storage", handleStorage);
    };
  }, [sectionId]);
  const style = {};
  if (sectionStyle.fontFamily) style.fontFamily = sectionStyle.fontFamily;
  if (sectionStyle.fontSize > 0) style.fontSize = `${sectionStyle.fontSize}px`;
  if (sectionStyle.textColor) style.color = sectionStyle.textColor;
  return { style, sectionStyle, refreshStyle };
}
function SectionStylePanel({
  sectionId,
  sectionLabel,
  onClose,
  anchorRef
}) {
  const panelRef = reactExports.useRef(null);
  const [sectionStyle, setSectionStyleState] = reactExports.useState(
    () => loadSectionStyle(sectionId)
  );
  const [pos, setPos] = reactExports.useState({
    top: 80,
    right: 20
  });
  reactExports.useEffect(() => {
    if (anchorRef == null ? void 0 : anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const panelWidth = 300;
      const spaceRight = window.innerWidth - rect.right;
      const spaceLeft = rect.left;
      let left;
      let right;
      if (spaceRight >= panelWidth + 8) {
        left = rect.right + 8;
      } else if (spaceLeft >= panelWidth + 8) {
        right = window.innerWidth - rect.left + 8;
      } else {
        left = Math.max(8, rect.left - panelWidth / 2);
      }
      const top = Math.min(rect.bottom + 4, window.innerHeight - 500);
      setPos({ top, left, right });
    }
  }, [anchorRef]);
  reactExports.useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    }
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClick);
    }, 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClose]);
  const update = (partial) => {
    const updated = { ...sectionStyle, ...partial };
    setSectionStyleState(updated);
    saveSectionStyle(sectionId, updated);
  };
  const reset = () => {
    const def = { ...DEFAULT_SECTION_STYLE };
    setSectionStyleState(def);
    saveSectionStyle(sectionId, def);
  };
  const fontSizeLabel = sectionStyle.fontSize === 0 ? "Global" : sectionStyle.fontSize <= 13 ? "XS" : sectionStyle.fontSize <= 14 ? "S" : sectionStyle.fontSize <= 16 ? "M" : sectionStyle.fontSize <= 18 ? "L" : sectionStyle.fontSize <= 20 ? "XL" : "XXL";
  const currentTextColor = sectionStyle.textColor || "#e8e0d0";
  const currentFontSize = sectionStyle.fontSize > 0 ? sectionStyle.fontSize : 15;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      ref: panelRef,
      className: "fixed z-50",
      style: {
        width: 300,
        ...pos
      },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-border bg-card shadow-2xl overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 14, className: "text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-bold text-foreground", children: [
              "Style: ",
              sectionLabel
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: reset,
                title: "Reset to global defaults",
                className: "h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { size: 12 })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: onClose,
                className: "h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 space-y-4 max-h-[75vh] overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-[10px] text-muted-foreground font-semibold uppercase tracking-wide flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Type, { size: 11 }),
              "Font Family"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-0.5 max-h-36 overflow-y-auto pr-1", children: FONT_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => update({ fontFamily: opt.value }),
                className: `w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs transition-all ${sectionStyle.fontFamily === opt.value ? "bg-primary/15 border-primary text-foreground" : "border-border text-muted-foreground hover:text-foreground hover:bg-accent/20"}`,
                style: { fontFamily: opt.value },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: opt.label }),
                  sectionStyle.fontFamily === opt.value && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-primary shrink-0" })
                ]
              },
              opt.value
            )) }),
            sectionStyle.fontFamily && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => update({ fontFamily: "" }),
                className: "text-[10px] text-muted-foreground hover:text-foreground transition-colors",
                children: "↩ Use global font"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { className: "text-[10px] text-muted-foreground font-semibold uppercase tracking-wide flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ALargeSmall, { size: 11 }),
                "Font Size"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded", children: fontSizeLabel }),
                sectionStyle.fontSize > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground font-mono", children: [
                  sectionStyle.fontSize,
                  "px"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] text-muted-foreground w-3", children: "A" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Slider,
                {
                  min: 12,
                  max: 22,
                  step: 1,
                  value: [currentFontSize],
                  onValueChange: ([v]) => update({ fontSize: v }),
                  className: "flex-1"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground w-3", children: "A" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1", children: [
              { label: "↩", size: 0, title: "Use global" },
              { label: "XS", size: 12 },
              { label: "S", size: 13 },
              { label: "M", size: 15 },
              { label: "L", size: 17 },
              { label: "XL", size: 19 },
              { label: "XXL", size: 21 }
            ].map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                title: opt.title,
                onClick: () => update({ fontSize: opt.size }),
                className: `flex-1 py-0.5 rounded text-[9px] font-semibold border transition-all ${sectionStyle.fontSize === opt.size ? "bg-primary/20 border-primary text-primary" : "border-border text-muted-foreground hover:text-foreground hover:bg-accent/20"}`,
                children: opt.label
              },
              opt.size
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-muted-foreground font-semibold uppercase tracking-wide", children: "Text Color" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-6 gap-1", children: TEXT_COLOR_PRESETS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                title: p.label,
                onClick: () => update({ textColor: p.color }),
                className: `w-full aspect-square rounded-md border-2 transition-all hover:scale-110 ${sectionStyle.textColor === p.color ? "border-primary/70 scale-110" : "border-transparent hover:border-border"}`,
                style: { background: p.color }
              },
              p.color
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "color",
                  value: currentTextColor,
                  onChange: (e) => update({ textColor: e.target.value }),
                  className: "w-7 h-7 rounded-md border border-border cursor-pointer bg-transparent shrink-0",
                  style: { padding: "2px" },
                  title: "Custom text color"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-mono flex-1", children: sectionStyle.textColor || "Global" }),
              sectionStyle.textColor && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => update({ textColor: "" }),
                  className: "text-[9px] text-muted-foreground hover:text-foreground transition-colors",
                  children: "↩ Global"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-muted-foreground font-semibold uppercase tracking-wide", children: "Section Accent Color" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-6 gap-1", children: ACCENT_COLOR_PRESETS.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                title: p.label,
                onClick: () => update({ accentColor: p.color }),
                className: `w-full aspect-square rounded-md border-2 transition-all hover:scale-110 ${sectionStyle.accentColor === p.color ? "border-white/70 scale-110" : "border-transparent hover:border-border"}`,
                style: { background: p.color }
              },
              p.color
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "color",
                  value: sectionStyle.accentColor || "#c0392b",
                  onChange: (e) => update({ accentColor: e.target.value }),
                  className: "w-7 h-7 rounded-md border border-border cursor-pointer bg-transparent shrink-0",
                  style: { padding: "2px" },
                  title: "Custom accent color"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-mono flex-1", children: sectionStyle.accentColor || "Global" }),
              sectionStyle.accentColor && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: () => update({ accentColor: "" }),
                  className: "text-[9px] text-muted-foreground hover:text-foreground transition-colors",
                  children: "↩ Global"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/10 p-2.5 space-y-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[9px] text-muted-foreground uppercase tracking-wide font-semibold mb-1.5", children: "Preview" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "font-bold",
                style: {
                  fontFamily: sectionStyle.fontFamily || void 0,
                  fontSize: sectionStyle.fontSize > 0 ? `${sectionStyle.fontSize + 2}px` : void 0,
                  color: sectionStyle.textColor || void 0
                },
                children: "Section Title"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                style: {
                  fontFamily: sectionStyle.fontFamily || void 0,
                  fontSize: sectionStyle.fontSize > 0 ? `${sectionStyle.fontSize}px` : void 0,
                  color: sectionStyle.textColor || void 0,
                  opacity: 0.7
                },
                children: "Body text sample — quick brown fox"
              }
            ),
            sectionStyle.accentColor && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "h-0.5 rounded-full mt-1.5",
                style: { background: sectionStyle.accentColor }
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "outline",
              size: "sm",
              className: "w-full text-[10px] border-border text-muted-foreground hover:text-foreground",
              onClick: reset,
              children: "Reset Section to Global Defaults"
            }
          )
        ] })
      ] })
    }
  );
}
export {
  RotateCcw as R,
  SectionStylePanel as S,
  useSectionStyle as u
};
