import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ALargeSmall, Palette, RotateCcw, Type, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Font options ─────────────────────────────────────────────────────────────

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
  { value: "system-ui", label: "System Default" },
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
  { label: "Charcoal", color: "#1f2937" },
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
  { label: "Rose", color: "#f43f5e" },
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SectionStyle {
  fontFamily: string;
  fontSize: number; // 0 = inherit from global
  textColor: string; // "" = inherit from global
  accentColor: string; // "" = inherit from global
}

const DEFAULT_SECTION_STYLE: SectionStyle = {
  fontFamily: "",
  fontSize: 0,
  textColor: "",
  accentColor: "",
};

function getStorageKey(sectionId: string): string {
  return `ssc_section_style_${sectionId}`;
}

function loadSectionStyle(sectionId: string): SectionStyle {
  try {
    const s = localStorage.getItem(getStorageKey(sectionId));
    return s
      ? { ...DEFAULT_SECTION_STYLE, ...JSON.parse(s) }
      : { ...DEFAULT_SECTION_STYLE };
  } catch {
    return { ...DEFAULT_SECTION_STYLE };
  }
}

function saveSectionStyle(sectionId: string, style: SectionStyle) {
  localStorage.setItem(getStorageKey(sectionId), JSON.stringify(style));
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSectionStyle(sectionId: string): {
  style: React.CSSProperties;
  sectionStyle: SectionStyle;
  refreshStyle: () => void;
} {
  const [sectionStyle, setSectionStyle] = useState<SectionStyle>(() =>
    loadSectionStyle(sectionId),
  );

  const refreshStyle = () => {
    setSectionStyle(loadSectionStyle(sectionId));
  };

  // Listen for storage changes (when panel saves)
  useEffect(() => {
    function handleStorage(e: StorageEvent) {
      if (e.key === getStorageKey(sectionId)) {
        setSectionStyle(loadSectionStyle(sectionId));
      }
    }
    window.addEventListener("storage", handleStorage);
    // Also poll (for same-tab changes since storage event doesn't fire in same tab)
    const interval = setInterval(() => {
      setSectionStyle(loadSectionStyle(sectionId));
    }, 500);
    return () => {
      window.removeEventListener("storage", handleStorage);
      clearInterval(interval);
    };
  }, [sectionId]);

  const style: React.CSSProperties = {};
  if (sectionStyle.fontFamily) style.fontFamily = sectionStyle.fontFamily;
  if (sectionStyle.fontSize > 0) style.fontSize = `${sectionStyle.fontSize}px`;
  if (sectionStyle.textColor) style.color = sectionStyle.textColor;

  return { style, sectionStyle, refreshStyle };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface SectionStylePanelProps {
  sectionId: string;
  sectionLabel: string;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLElement | null>;
}

export default function SectionStylePanel({
  sectionId,
  sectionLabel,
  onClose,
  anchorRef,
}: SectionStylePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [sectionStyle, setSectionStyleState] = useState<SectionStyle>(() =>
    loadSectionStyle(sectionId),
  );

  // Compute position near anchor if provided
  const [pos, setPos] = useState<{
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
  }>({
    top: 80,
    right: 20,
  });

  useEffect(() => {
    if (anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      const panelWidth = 300;
      const spaceRight = window.innerWidth - rect.right;
      const spaceLeft = rect.left;

      let left: number | undefined;
      let right: number | undefined;

      if (spaceRight >= panelWidth + 8) {
        left = rect.right + 8;
      } else if (spaceLeft >= panelWidth + 8) {
        right = window.innerWidth - rect.left + 8;
      } else {
        // Center horizontally near anchor
        left = Math.max(8, rect.left - panelWidth / 2);
      }

      const top = Math.min(rect.bottom + 4, window.innerHeight - 500);

      setPos({ top, left, right });
    }
  }, [anchorRef]);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    // Delay to prevent immediately closing on the button click that opened it
    const timer = setTimeout(() => {
      document.addEventListener("mousedown", handleClick);
    }, 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousedown", handleClick);
    };
  }, [onClose]);

  const update = (partial: Partial<SectionStyle>) => {
    const updated = { ...sectionStyle, ...partial };
    setSectionStyleState(updated);
    saveSectionStyle(sectionId, updated);
  };

  const reset = () => {
    const def = { ...DEFAULT_SECTION_STYLE };
    setSectionStyleState(def);
    saveSectionStyle(sectionId, def);
  };

  const fontSizeLabel =
    sectionStyle.fontSize === 0
      ? "Global"
      : sectionStyle.fontSize <= 13
        ? "XS"
        : sectionStyle.fontSize <= 14
          ? "S"
          : sectionStyle.fontSize <= 16
            ? "M"
            : sectionStyle.fontSize <= 18
              ? "L"
              : sectionStyle.fontSize <= 20
                ? "XL"
                : "XXL";

  const currentTextColor = sectionStyle.textColor || "#e8e0d0";
  const currentFontSize =
    sectionStyle.fontSize > 0 ? sectionStyle.fontSize : 15;

  return (
    <div
      ref={panelRef}
      className="fixed z-50"
      style={{
        width: 300,
        ...pos,
      }}
    >
      <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Palette size={14} className="text-primary" />
            <span className="text-xs font-bold text-foreground">
              Style: {sectionLabel}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={reset}
              title="Reset to global defaults"
              className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            >
              <RotateCcw size={12} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="p-3 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* ── Font Family ──────────────────────────────────────────────────── */}
          <div className="space-y-1.5">
            <Label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide flex items-center gap-1.5">
              <Type size={11} />
              Font Family
            </Label>
            <div className="space-y-0.5 max-h-36 overflow-y-auto pr-1">
              {FONT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update({ fontFamily: opt.value })}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border text-xs transition-all ${
                    sectionStyle.fontFamily === opt.value
                      ? "bg-primary/15 border-primary text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground hover:bg-accent/20"
                  }`}
                  style={{ fontFamily: opt.value }}
                >
                  <span>{opt.label}</span>
                  {sectionStyle.fontFamily === opt.value && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
            {sectionStyle.fontFamily && (
              <button
                type="button"
                onClick={() => update({ fontFamily: "" })}
                className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
              >
                ↩ Use global font
              </button>
            )}
          </div>

          {/* ── Font Size ──────────────────────────────────────────────────── */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide flex items-center gap-1.5">
                <ALargeSmall size={11} />
                Font Size
              </Label>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                  {fontSizeLabel}
                </span>
                {sectionStyle.fontSize > 0 && (
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {sectionStyle.fontSize}px
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-muted-foreground w-3">A</span>
              <Slider
                min={12}
                max={22}
                step={1}
                value={[currentFontSize]}
                onValueChange={([v]) => update({ fontSize: v })}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground w-3">A</span>
            </div>
            <div className="flex gap-1">
              {[
                { label: "↩", size: 0, title: "Use global" },
                { label: "XS", size: 12 },
                { label: "S", size: 13 },
                { label: "M", size: 15 },
                { label: "L", size: 17 },
                { label: "XL", size: 19 },
                { label: "XXL", size: 21 },
              ].map((opt) => (
                <button
                  key={opt.size}
                  type="button"
                  title={opt.title}
                  onClick={() => update({ fontSize: opt.size })}
                  className={`flex-1 py-0.5 rounded text-[9px] font-semibold border transition-all ${
                    sectionStyle.fontSize === opt.size
                      ? "bg-primary/20 border-primary text-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:bg-accent/20"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Text Color ──────────────────────────────────────────────────── */}
          <div className="space-y-1.5">
            <Label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">
              Text Color
            </Label>
            <div className="grid grid-cols-6 gap-1">
              {TEXT_COLOR_PRESETS.map((p) => (
                <button
                  key={p.color}
                  type="button"
                  title={p.label}
                  onClick={() => update({ textColor: p.color })}
                  className={`w-full aspect-square rounded-md border-2 transition-all hover:scale-110 ${
                    sectionStyle.textColor === p.color
                      ? "border-primary/70 scale-110"
                      : "border-transparent hover:border-border"
                  }`}
                  style={{ background: p.color }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentTextColor}
                onChange={(e) => update({ textColor: e.target.value })}
                className="w-7 h-7 rounded-md border border-border cursor-pointer bg-transparent shrink-0"
                style={{ padding: "2px" }}
                title="Custom text color"
              />
              <span className="text-[10px] text-muted-foreground font-mono flex-1">
                {sectionStyle.textColor || "Global"}
              </span>
              {sectionStyle.textColor && (
                <button
                  type="button"
                  onClick={() => update({ textColor: "" })}
                  className="text-[9px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  ↩ Global
                </button>
              )}
            </div>
          </div>

          {/* ── Accent Color ──────────────────────────────────────────────── */}
          <div className="space-y-1.5">
            <Label className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wide">
              Section Accent Color
            </Label>
            <div className="grid grid-cols-6 gap-1">
              {ACCENT_COLOR_PRESETS.map((p) => (
                <button
                  key={p.color}
                  type="button"
                  title={p.label}
                  onClick={() => update({ accentColor: p.color })}
                  className={`w-full aspect-square rounded-md border-2 transition-all hover:scale-110 ${
                    sectionStyle.accentColor === p.color
                      ? "border-white/70 scale-110"
                      : "border-transparent hover:border-border"
                  }`}
                  style={{ background: p.color }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={sectionStyle.accentColor || "#c0392b"}
                onChange={(e) => update({ accentColor: e.target.value })}
                className="w-7 h-7 rounded-md border border-border cursor-pointer bg-transparent shrink-0"
                style={{ padding: "2px" }}
                title="Custom accent color"
              />
              <span className="text-[10px] text-muted-foreground font-mono flex-1">
                {sectionStyle.accentColor || "Global"}
              </span>
              {sectionStyle.accentColor && (
                <button
                  type="button"
                  onClick={() => update({ accentColor: "" })}
                  className="text-[9px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  ↩ Global
                </button>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-xl border border-border bg-muted/10 p-2.5 space-y-1">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wide font-semibold mb-1.5">
              Preview
            </p>
            <p
              className="font-bold"
              style={{
                fontFamily: sectionStyle.fontFamily || undefined,
                fontSize:
                  sectionStyle.fontSize > 0
                    ? `${sectionStyle.fontSize + 2}px`
                    : undefined,
                color: sectionStyle.textColor || undefined,
              }}
            >
              Section Title
            </p>
            <p
              style={{
                fontFamily: sectionStyle.fontFamily || undefined,
                fontSize:
                  sectionStyle.fontSize > 0
                    ? `${sectionStyle.fontSize}px`
                    : undefined,
                color: sectionStyle.textColor || undefined,
                opacity: 0.7,
              }}
            >
              Body text sample — quick brown fox
            </p>
            {sectionStyle.accentColor && (
              <div
                className="h-0.5 rounded-full mt-1.5"
                style={{ background: sectionStyle.accentColor }}
              />
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full text-[10px] border-border text-muted-foreground hover:text-foreground"
            onClick={reset}
          >
            Reset Section to Global Defaults
          </Button>
        </div>
      </div>
    </div>
  );
}
