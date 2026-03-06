import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  ALargeSmall,
  Clock,
  Moon,
  Palette,
  Sparkles,
  Sun,
  SunMedium,
  Type,
  X,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AppTheme =
  | "dark"
  | "light"
  | "ocean"
  | "forest"
  | "purple"
  | "sunset"
  | "midnight"
  | "rose"
  | "amber"
  | "slate"
  | "crimson"
  | "cyberpunk"
  | "nord"
  | "solarized"
  | "dracula"
  | "tokyo"
  | "monokai"
  | "catppuccin-mocha"
  | "catppuccin-latte"
  | "one-dark"
  | "material-dark"
  | "gruvbox";

export interface AppearanceSettings {
  theme: AppTheme;
  textColor: string;
  font: string;
  fontSize: number; // 12–22 px
  accentColor: string; // custom accent override
  timeFormat: "12h" | "24h"; // time display format
  rainbowText: boolean; // cycle all text through rainbow colors
}

// ─── Time format helper ───────────────────────────────────────────────────────

/** Convert "HH:MM" 24h string to display format */
export function formatTime(timeStr: string, format: "12h" | "24h"): string {
  if (!timeStr) return "";
  if (format === "24h") return timeStr;
  const [hStr, mStr] = timeStr.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

// ─── Theme definitions ────────────────────────────────────────────────────────

interface ThemeDef {
  id: AppTheme;
  label: string;
  icon: React.ReactNode;
  bg: string; // preview bg swatch
  accent: string; // preview accent swatch
  cssClass: string; // applied to <html>
}

export const THEMES: ThemeDef[] = [
  {
    id: "dark",
    label: "Night",
    icon: <Moon size={12} />,
    bg: "#0d0b0b",
    accent: "#c0392b",
    cssClass: "theme-dark",
  },
  {
    id: "light",
    label: "Light",
    icon: <Sun size={12} />,
    bg: "#f8f5f0",
    accent: "#c0392b",
    cssClass: "theme-light",
  },
  {
    id: "midnight",
    label: "Midnight",
    icon: <Moon size={12} />,
    bg: "#0a0e1a",
    accent: "#4f8ef7",
    cssClass: "theme-midnight",
  },
  {
    id: "ocean",
    label: "Ocean",
    icon: <SunMedium size={12} />,
    bg: "#081420",
    accent: "#0ea5e9",
    cssClass: "theme-ocean",
  },
  {
    id: "forest",
    label: "Forest",
    icon: <SunMedium size={12} />,
    bg: "#0a1410",
    accent: "#22c55e",
    cssClass: "theme-forest",
  },
  {
    id: "purple",
    label: "Royal",
    icon: <Palette size={12} />,
    bg: "#0f0a1a",
    accent: "#a855f7",
    cssClass: "theme-purple",
  },
  {
    id: "sunset",
    label: "Sunset",
    icon: <SunMedium size={12} />,
    bg: "#140a05",
    accent: "#f97316",
    cssClass: "theme-sunset",
  },
  {
    id: "rose",
    label: "Rose",
    icon: <Palette size={12} />,
    bg: "#140810",
    accent: "#f43f5e",
    cssClass: "theme-rose",
  },
  {
    id: "amber",
    label: "Amber",
    icon: <SunMedium size={12} />,
    bg: "#130f05",
    accent: "#f59e0b",
    cssClass: "theme-amber",
  },
  {
    id: "slate",
    label: "Slate",
    icon: <Moon size={12} />,
    bg: "#0d1117",
    accent: "#64748b",
    cssClass: "theme-slate",
  },
  {
    id: "crimson",
    label: "Crimson",
    icon: <Palette size={12} />,
    bg: "#1a0505",
    accent: "#dc143c",
    cssClass: "theme-crimson",
  },
  {
    id: "cyberpunk",
    label: "Cyberpunk",
    icon: <Zap size={12} />,
    bg: "#050510",
    accent: "#f0e040",
    cssClass: "theme-cyberpunk",
  },
  {
    id: "nord",
    label: "Nord",
    icon: <Moon size={12} />,
    bg: "#2e3440",
    accent: "#88c0d0",
    cssClass: "theme-nord",
  },
  {
    id: "solarized",
    label: "Solarized",
    icon: <SunMedium size={12} />,
    bg: "#002b36",
    accent: "#268bd2",
    cssClass: "theme-solarized",
  },
  {
    id: "dracula",
    label: "Dracula",
    icon: <Moon size={12} />,
    bg: "#282a36",
    accent: "#bd93f9",
    cssClass: "theme-dracula",
  },
  {
    id: "tokyo",
    label: "Tokyo",
    icon: <Moon size={12} />,
    bg: "#1a1b26",
    accent: "#7aa2f7",
    cssClass: "theme-tokyo",
  },
  {
    id: "monokai",
    label: "Monokai",
    icon: <Palette size={12} />,
    bg: "#272822",
    accent: "#a6e22e",
    cssClass: "theme-monokai",
  },
  {
    id: "catppuccin-mocha",
    label: "Mocha",
    icon: <Moon size={12} />,
    bg: "#1e1e2e",
    accent: "#cba6f7",
    cssClass: "theme-catppuccin-mocha",
  },
  {
    id: "catppuccin-latte",
    label: "Latte",
    icon: <Sun size={12} />,
    bg: "#eff1f5",
    accent: "#8839ef",
    cssClass: "theme-catppuccin-latte",
  },
  {
    id: "one-dark",
    label: "One Dark",
    icon: <Moon size={12} />,
    bg: "#282c34",
    accent: "#61afef",
    cssClass: "theme-one-dark",
  },
  {
    id: "material-dark",
    label: "Material",
    icon: <Moon size={12} />,
    bg: "#212121",
    accent: "#80cbc4",
    cssClass: "theme-material-dark",
  },
  {
    id: "gruvbox",
    label: "Gruvbox",
    icon: <SunMedium size={12} />,
    bg: "#282828",
    accent: "#b8bb26",
    cssClass: "theme-gruvbox",
  },
];

// ─── Accent color presets ─────────────────────────────────────────────────────

const ACCENT_PRESETS = [
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
  { label: "Cyan", color: "#06b6d4" },
  { label: "Violet", color: "#7c3aed" },
  { label: "Fuchsia", color: "#d946ef" },
  { label: "Yellow", color: "#eab308" },
  { label: "Red", color: "#dc2626" },
  { label: "Green", color: "#16a34a" },
  { label: "Lavender", color: "#b57bee" },
  { label: "Coral", color: "#ff6b6b" },
  { label: "Mint", color: "#4ade80" },
  { label: "Gold", color: "#d97706" },
];

// ─── Font options ─────────────────────────────────────────────────────────────

const FONT_OPTIONS = [
  { value: "Satoshi", label: "Satoshi" },
  { value: "Cabinet Grotesk", label: "Cabinet Grotesk" },
  { value: "Geist Mono", label: "Geist Mono" },
  { value: "Georgia", label: "Georgia (Serif)" },
  { value: "Arial", label: "Arial" },
  { value: "Trebuchet MS", label: "Trebuchet" },
  { value: "Verdana", label: "Verdana" },
  { value: "Courier New", label: "Courier New (Mono)" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "system-ui", label: "System Default" },
];

// ─── Text color presets ───────────────────────────────────────────────────────

const TEXT_COLOR_PRESETS = [
  { label: "Warm White", color: "#e8e0d0" },
  { label: "Pure White", color: "#ffffff" },
  { label: "Soft Gray", color: "#c9cdd4" },
  { label: "Cream", color: "#fdf6e3" },
  { label: "Cool White", color: "#e2e8f0" },
  { label: "Pale Yellow", color: "#fefce8" },
];

// ─── Custom theme storage ─────────────────────────────────────────────────────

interface CustomThemeColors {
  bg: string;
  card: string;
  border: string;
  accent: string;
  text: string;
  gradient: boolean;
  gradientColor2: string;
  gradientDir: string;
}

function loadCustomTheme(): CustomThemeColors {
  try {
    const s = localStorage.getItem("ssc_custom_theme");
    return s
      ? JSON.parse(s)
      : {
          bg: "#0d0b0b",
          card: "#1a1614",
          border: "#2d2522",
          accent: "#c0392b",
          text: "#e8e0d0",
          gradient: false,
          gradientColor2: "#1a0a1a",
          gradientDir: "to bottom right",
        };
  } catch {
    return {
      bg: "#0d0b0b",
      card: "#1a1614",
      border: "#2d2522",
      accent: "#c0392b",
      text: "#e8e0d0",
      gradient: false,
      gradientColor2: "#1a0a1a",
      gradientDir: "to bottom right",
    };
  }
}

function applyCustomTheme(ct: CustomThemeColors) {
  const root = document.documentElement;
  const bg = ct.gradient
    ? `linear-gradient(${ct.gradientDir}, ${ct.bg}, ${ct.gradientColor2})`
    : ct.bg;
  root.style.setProperty("--custom-bg", ct.bg);
  root.style.setProperty("--custom-bg-gradient", bg);
  root.style.setProperty("--custom-card", ct.card);
  root.style.setProperty("--custom-border", ct.border);
  root.style.setProperty("--custom-accent", ct.accent);
  root.style.setProperty("--custom-text", ct.text);
  root.style.setProperty("--custom-active", "1");
}

function clearCustomTheme() {
  const root = document.documentElement;
  root.style.removeProperty("--custom-bg");
  root.style.removeProperty("--custom-bg-gradient");
  root.style.removeProperty("--custom-card");
  root.style.removeProperty("--custom-border");
  root.style.removeProperty("--custom-accent");
  root.style.removeProperty("--custom-text");
  root.style.removeProperty("--custom-active");
}

const GRADIENT_DIRS = [
  "to bottom right",
  "to right",
  "to bottom",
  "to top right",
  "135deg",
  "45deg",
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface AppearancePanelProps {
  settings: AppearanceSettings;
  onChange: (updated: Partial<AppearanceSettings>) => void;
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AppearancePanel({
  settings,
  onChange,
  onClose,
}: AppearancePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [customTheme, setCustomTheme] =
    useState<CustomThemeColors>(loadCustomTheme);
  const [customApplied, setCustomApplied] = useState(() => {
    return !!document.documentElement.style.getPropertyValue("--custom-active");
  });

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const fontSizeLabel =
    settings.fontSize <= 13
      ? "XS"
      : settings.fontSize <= 14
        ? "S"
        : settings.fontSize <= 16
          ? "M"
          : settings.fontSize <= 18
            ? "L"
            : settings.fontSize <= 20
              ? "XL"
              : "XXL";

  return (
    <div
      ref={panelRef}
      className="fixed z-50 w-80"
      style={{ left: "268px", bottom: "80px" }}
    >
      <div className="rounded-2xl border border-border bg-card shadow-2xl backdrop-blur-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Palette size={15} className="text-primary" />
            <span className="text-sm font-bold text-foreground">
              Appearance
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
          >
            <X size={14} />
          </Button>
        </div>

        <div className="p-4 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* ── Time Format ─────────────────────────────────────────────── */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wide flex items-center gap-1.5">
              <Clock size={13} />
              Time Format
            </Label>
            <div className="flex gap-2">
              {(["12h", "24h"] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => onChange({ timeFormat: fmt })}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                    (settings.timeFormat ?? "12h") === fmt
                      ? "bg-primary/20 border-primary text-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:bg-accent/30"
                  }`}
                >
                  {fmt === "12h" ? "12h AM/PM" : "24h"}
                </button>
              ))}
            </div>
          </div>

          {/* ── Themes ─────────────────────────────────────────────────────── */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
              Theme
            </Label>
            <div className="grid grid-cols-5 gap-1.5">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  title={t.label}
                  onClick={() => onChange({ theme: t.id })}
                  className={`relative flex flex-col items-center gap-1 p-1.5 rounded-xl border transition-all ${
                    settings.theme === t.id
                      ? "border-primary ring-1 ring-primary/50"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  {/* Swatch */}
                  <div
                    className="w-8 h-6 rounded-md border border-white/10 overflow-hidden flex"
                    style={{ background: t.bg }}
                  >
                    <div
                      className="w-3 h-full"
                      style={{ background: t.accent, opacity: 0.9 }}
                    />
                  </div>
                  <span className="text-[9px] text-muted-foreground leading-none truncate w-full text-center">
                    {t.label}
                  </span>
                  {settings.theme === t.id && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── Accent Color ────────────────────────────────────────────────── */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
              Accent Color
            </Label>
            <div className="grid grid-cols-6 gap-1.5">
              {ACCENT_PRESETS.map((p) => (
                <button
                  key={p.color}
                  type="button"
                  title={p.label}
                  onClick={() => onChange({ accentColor: p.color })}
                  className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                    settings.accentColor === p.color
                      ? "border-white/70 scale-110"
                      : "border-transparent"
                  }`}
                  style={{ background: p.color }}
                />
              ))}
            </div>
            {/* Custom accent picker */}
            <div className="flex items-center gap-2 mt-1">
              <input
                type="color"
                value={settings.accentColor}
                onChange={(e) => onChange({ accentColor: e.target.value })}
                className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent"
                style={{ padding: "2px" }}
                title="Custom accent color"
              />
              <span className="text-xs text-muted-foreground font-mono">
                {settings.accentColor}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange({ accentColor: "#c0392b" })}
                className="text-xs h-6 px-2 text-muted-foreground ml-auto"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* ── Text Color ──────────────────────────────────────────────────── */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">
              Text Color
            </Label>
            <div className="grid grid-cols-6 gap-1.5">
              {TEXT_COLOR_PRESETS.map((p) => (
                <button
                  key={p.color}
                  type="button"
                  title={p.label}
                  onClick={() => onChange({ textColor: p.color })}
                  className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                    settings.textColor === p.color
                      ? "border-primary/70 scale-110"
                      : "border-border"
                  }`}
                  style={{ background: p.color }}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={settings.textColor}
                onChange={(e) => onChange({ textColor: e.target.value })}
                className="w-8 h-8 rounded-lg border border-border cursor-pointer bg-transparent"
                style={{ padding: "2px" }}
              />
              <span className="text-xs text-muted-foreground font-mono">
                {settings.textColor}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onChange({ textColor: "#e8e0d0" })}
                className="text-xs h-6 px-2 text-muted-foreground ml-auto"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* ── Font Size ────────────────────────────────────────────────────── */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wide flex items-center gap-1.5">
                <ALargeSmall size={13} />
                Font Size
              </Label>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                  {fontSizeLabel}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {settings.fontSize}px
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground font-medium w-4 text-center">
                A
              </span>
              <Slider
                min={12}
                max={22}
                step={1}
                value={[settings.fontSize]}
                onValueChange={([v]) => onChange({ fontSize: v })}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground font-medium w-4 text-center">
                A
              </span>
            </div>
            {/* Quick size buttons */}
            <div className="flex gap-1.5">
              {[
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
                  onClick={() => onChange({ fontSize: opt.size })}
                  className={`flex-1 py-1 rounded-md text-[10px] font-semibold border transition-all ${
                    settings.fontSize === opt.size
                      ? "bg-primary/20 border-primary text-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:bg-accent/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Font Family ──────────────────────────────────────────────────── */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wide flex items-center gap-1.5">
              <Type size={13} />
              Font Family
            </Label>
            <div className="space-y-1">
              {FONT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => onChange({ font: opt.value })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-all ${
                    settings.font === opt.value
                      ? "bg-primary/15 border-primary text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground hover:bg-accent/30"
                  }`}
                  style={{ fontFamily: opt.value }}
                >
                  <span>{opt.label}</span>
                  {settings.font === opt.value && (
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-semibold mb-2">
              Preview
            </p>
            <p
              className="font-bold text-foreground"
              style={{
                fontFamily: settings.font,
                fontSize: `${settings.fontSize + 2}px`,
                color: settings.textColor,
              }}
            >
              SSC CGL Tracker
            </p>
            <p
              className="text-muted-foreground"
              style={{
                fontFamily: settings.font,
                fontSize: `${settings.fontSize}px`,
                color: settings.textColor,
                opacity: 0.7,
              }}
            >
              The quick brown fox jumps over the lazy dog
            </p>
          </div>

          {/* ── Build Your Own Theme ────────────────────────────────────── */}
          <div className="space-y-3 border border-border rounded-xl p-3">
            <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wide flex items-center gap-1.5">
              <Palette size={13} />
              Build Your Own Theme
            </Label>

            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { key: "bg", label: "Background" },
                  { key: "card", label: "Card" },
                  { key: "border", label: "Border" },
                  { key: "accent", label: "Accent" },
                  { key: "text", label: "Text" },
                ] as { key: keyof CustomThemeColors; label: string }[]
              ).map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  <input
                    type="color"
                    value={String(customTheme[key])}
                    onChange={(e) =>
                      setCustomTheme((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    className="w-7 h-7 rounded-md border border-border cursor-pointer bg-transparent shrink-0"
                    style={{ padding: "2px" }}
                    title={label}
                  />
                  <span className="text-[10px] text-muted-foreground truncate">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Gradient option */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setCustomTheme((prev) => ({
                      ...prev,
                      gradient: !prev.gradient,
                    }))
                  }
                  className={`w-8 h-4 rounded-full border transition-all relative ${
                    customTheme.gradient
                      ? "bg-primary border-primary"
                      : "bg-muted border-border"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${
                      customTheme.gradient ? "left-4" : "left-0.5"
                    }`}
                  />
                </button>
                <span className="text-xs text-muted-foreground">
                  Gradient Background
                </span>
              </div>
              {customTheme.gradient && (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customTheme.gradientColor2}
                      onChange={(e) =>
                        setCustomTheme((prev) => ({
                          ...prev,
                          gradientColor2: e.target.value,
                        }))
                      }
                      className="w-7 h-7 rounded-md border border-border cursor-pointer bg-transparent shrink-0"
                      style={{ padding: "2px" }}
                      title="Gradient second color"
                    />
                    <span className="text-[10px] text-muted-foreground">
                      Second Color
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {GRADIENT_DIRS.map((dir) => (
                      <button
                        key={dir}
                        type="button"
                        onClick={() =>
                          setCustomTheme((prev) => ({
                            ...prev,
                            gradientDir: dir,
                          }))
                        }
                        className={`px-2 py-0.5 rounded text-[9px] border transition-all ${
                          customTheme.gradientDir === dir
                            ? "bg-primary/20 border-primary text-primary"
                            : "border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {dir}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Preview */}
            <div
              className="rounded-lg p-3 text-sm font-medium transition-all"
              style={{
                background: customTheme.gradient
                  ? `linear-gradient(${customTheme.gradientDir}, ${customTheme.bg}, ${customTheme.gradientColor2})`
                  : customTheme.bg,
                border: `1px solid ${customTheme.border}`,
                color: customTheme.text,
              }}
            >
              <div
                className="rounded p-2 text-xs mb-2"
                style={{
                  background: customTheme.card,
                  borderColor: customTheme.border,
                  border: `1px solid ${customTheme.border}`,
                }}
              >
                Card preview
              </div>
              <span style={{ color: customTheme.accent }}>■</span> Accent color
              preview
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={() => {
                  applyCustomTheme(customTheme);
                  setCustomApplied(true);
                }}
              >
                Apply Theme
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 text-xs border-border text-muted-foreground hover:text-foreground"
                onClick={() => {
                  localStorage.setItem(
                    "ssc_custom_theme",
                    JSON.stringify(customTheme),
                  );
                  applyCustomTheme(customTheme);
                  setCustomApplied(true);
                }}
              >
                Save
              </Button>
              {customApplied && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs text-muted-foreground hover:text-destructive px-2"
                  onClick={() => {
                    clearCustomTheme();
                    setCustomApplied(false);
                  }}
                >
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* ── Rainbow Text ────────────────────────────────────────────── */}
          <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground font-semibold uppercase tracking-wide flex items-center gap-1.5">
                <Sparkles size={13} />
                Rainbow Text
              </Label>
              <Switch
                checked={settings.rainbowText ?? false}
                onCheckedChange={(checked) => {
                  onChange({ rainbowText: checked });
                  if (checked) {
                    document.documentElement.classList.add("rainbow-text");
                  } else {
                    document.documentElement.classList.remove("rainbow-text");
                  }
                }}
                data-ocid="appearance.rainbow_text.toggle"
              />
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              All text cycles through rainbow colours simultaneously
            </p>
            {(settings.rainbowText ?? false) && (
              <p
                className="text-xs font-bold text-center py-1"
                style={{ animation: "rainbow-hue 3s linear infinite" }}
              >
                ✨ Rainbow mode active ✨
              </p>
            )}
          </div>

          {/* Reset All */}
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs border-border text-muted-foreground hover:text-foreground"
            onClick={() => {
              clearCustomTheme();
              setCustomApplied(false);
              document.documentElement.classList.remove("rainbow-text");
              onChange({
                theme: "dark",
                textColor: "#e8e0d0",
                font: "Satoshi",
                fontSize: 15,
                accentColor: "#c0392b",
                timeFormat: "12h",
                rainbowText: false,
              });
            }}
          >
            Reset All to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
}
