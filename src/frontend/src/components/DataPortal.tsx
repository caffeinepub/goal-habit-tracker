import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

export default function DataPortal() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const exportData: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith("ssc_")) {
          const value = localStorage.getItem(key);
          if (value !== null) {
            exportData[key] = value;
          }
        }
      }

      const json = JSON.stringify(exportData, null, 2);
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const date = new Date().toISOString().split("T")[0];
      a.href = url;
      a.download = `ssc_tracker_backup_${date}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Exported ${Object.keys(exportData).length} records`);
    } catch {
      toast.error("Export failed — please try again");
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const data = JSON.parse(text) as Record<string, string>;

        if (typeof data !== "object" || Array.isArray(data)) {
          toast.error("Invalid file format — expected a JSON object");
          return;
        }

        let count = 0;
        for (const [key, value] of Object.entries(data)) {
          if (typeof value === "string") {
            localStorage.setItem(key, value);
            count++;
          }
        }

        toast.success(
          `Data imported successfully (${count} records) — refresh to see all changes`,
        );
      } catch {
        toast.error("Import failed — invalid or malformed JSON file");
      }
    };
    reader.readAsText(file);

    // Reset input so same file can be re-imported
    e.target.value = "";
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleExport}
        className="h-7 px-2 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10"
        title="Export data"
        data-ocid="sidebar.export.button"
      >
        <Download size={12} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleImportClick}
        className="h-7 px-2 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10"
        title="Import data"
        data-ocid="sidebar.import.button"
      >
        <Upload size={12} />
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        className="hidden"
        tabIndex={-1}
        data-ocid="sidebar.import.dropzone"
      />
    </>
  );
}
