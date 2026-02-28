import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Moon, Palette, Sun, X } from "lucide-react";
import { useEffect, useRef } from "react";

export type AppTheme = "dark" | "light";

const FONT_OPTIONS = [
  { value: "Satoshi", label: "Satoshi (Default)" },
  { value: "Cabinet Grotesk", label: "Cabinet Grotesk" },
  { value: "Geist Mono", label: "Geist Mono" },
  { value: "Georgia", label: "Georgia" },
  { value: "Arial", label: "Arial" },
];

interface AppearancePanelProps {
  theme: AppTheme;
  textColor: string;
  font: string;
  onThemeChange: (theme: AppTheme) => void;
  onTextColorChange: (color: string) => void;
  onFontChange: (font: string) => void;
  onClose: () => void;
}

export default function AppearancePanel({
  theme,
  textColor,
  font,
  onThemeChange,
  onTextColorChange,
  onFontChange,
  onClose,
}: AppearancePanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={panelRef}
      className="fixed z-50 w-72"
      style={{ left: "268px", bottom: "80px" }}
    >
      <div className="rounded-xl border border-border bg-card shadow-card backdrop-blur-sm p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette size={15} className="text-primary" />
            <span className="text-sm font-semibold text-foreground">
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

        {/* Theme Toggle */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Theme
          </Label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onThemeChange("dark")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all border ${
                theme === "dark"
                  ? "bg-primary/20 border-primary text-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-accent/40"
              }`}
            >
              <Moon size={13} />
              Night
            </button>
            <button
              type="button"
              onClick={() => onThemeChange("light")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all border ${
                theme === "light"
                  ? "bg-primary/20 border-primary text-primary"
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-accent/40"
              }`}
            >
              <Sun size={13} />
              Light
            </button>
          </div>
        </div>

        {/* Text Color */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Text Color
          </Label>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="color"
                value={textColor}
                onChange={(e) => onTextColorChange(e.target.value)}
                className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent p-0.5"
                style={{ padding: "2px" }}
              />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Pick a text color</p>
              <p className="text-xs font-mono text-foreground mt-0.5">
                {textColor}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTextColorChange("#e8e0d0")}
              className="text-xs h-7 px-2 text-muted-foreground"
            >
              Reset
            </Button>
          </div>
        </div>

        {/* Font Picker */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Font
          </Label>
          <select
            value={font}
            onChange={(e) => onFontChange(e.target.value)}
            className="w-full h-9 px-3 rounded-lg text-sm border border-border bg-input text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 cursor-pointer"
            style={{ fontFamily: font }}
          >
            {FONT_OPTIONS.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                style={{ fontFamily: opt.value }}
              >
                {opt.label}
              </option>
            ))}
          </select>
          <p
            className="text-xs text-muted-foreground"
            style={{ fontFamily: font }}
          >
            Preview: The quick brown fox
          </p>
        </div>
      </div>
    </div>
  );
}
