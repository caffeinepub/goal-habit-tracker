import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  Download,
  File,
  FileImage,
  FileText,
  FileVideo,
  FolderOpen,
  Loader2,
  Palette,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { FileMetadata } from "../backend.d";
import { useActor } from "../hooks/useActor";
import SectionStylePanel, { useSectionStyle } from "./SectionStylePanel";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: bigint): string {
  const n = Number(bytes);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/"))
    return <FileImage size={20} className="text-blue-400" />;
  if (mimeType.startsWith("video/"))
    return <FileVideo size={20} className="text-purple-400" />;
  if (mimeType === "application/pdf")
    return <FileText size={20} className="text-red-400" />;
  if (mimeType.startsWith("text/"))
    return <FileText size={20} className="text-emerald-400" />;
  return <File size={20} className="text-muted-foreground" />;
}

function getFileTypeLabel(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "Image";
  if (mimeType.startsWith("video/")) return "Video";
  if (mimeType === "application/pdf") return "PDF";
  if (mimeType.startsWith("text/")) return "Text";
  if (
    mimeType.includes("spreadsheet") ||
    mimeType.includes("excel") ||
    mimeType.includes("xlsx")
  )
    return "Spreadsheet";
  if (
    mimeType.includes("document") ||
    mimeType.includes("word") ||
    mimeType.includes("docx")
  )
    return "Document";
  return "File";
}

// ─── Upload item state ────────────────────────────────────────────────────────

interface UploadingItem {
  id: string;
  fileName: string;
  progress: number;
  error?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function FilesTab() {
  const { actor } = useActor();
  const [files, setFiles] = useState<FileMetadata[]>([]);
  const [uploading, setUploading] = useState<UploadingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragging, setDragging] = useState(false);
  const [downloadingId, setDownloadingId] = useState<bigint | null>(null);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);
  const [showStylePanel, setShowStylePanel] = useState(false);
  const styleBtnRef = useRef<HTMLButtonElement>(null);
  const { style: sectionStyle } = useSectionStyle("files");

  // ── Load files ──────────────────────────────────────────────────────────────
  const loadFiles = useCallback(async () => {
    if (!actor) return;
    try {
      const result = await actor.getAllFileMetadata();
      setFiles(
        [...result].sort(
          (a, b) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
        ),
      );
    } catch {
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    if (actor) loadFiles();
  }, [actor, loadFiles]);

  // ── Upload handler ──────────────────────────────────────────────────────────
  // Files are stored as object URLs in localStorage with base64 data URI as blobUrl
  const handleUpload = useCallback(
    async (fileList: FileList | File[]) => {
      if (!actor) {
        toast.error("Not connected. Please wait.");
        return;
      }
      const arr = Array.from(fileList);
      if (!arr.length) return;

      for (const file of arr) {
        const uploadId = `${Date.now()}-${Math.random()}`;

        setUploading((prev) => [
          ...prev,
          { id: uploadId, fileName: file.name, progress: 0 },
        ]);

        try {
          setUploading((prev) =>
            prev.map((u) => (u.id === uploadId ? { ...u, progress: 20 } : u)),
          );

          // Read file as data URL for local storage/download
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

          setUploading((prev) =>
            prev.map((u) => (u.id === uploadId ? { ...u, progress: 60 } : u)),
          );

          // Store data URL in localStorage keyed by a unique ID
          const fileKey = `ssc_file_${Date.now()}_${Math.random().toString(36).slice(2)}`;
          try {
            localStorage.setItem(fileKey, dataUrl);
          } catch {
            // localStorage quota exceeded - store empty string, download will warn
          }

          const uploadedAt = new Date().toISOString();
          await actor.saveFileMetadata(
            file.name,
            file.type || "application/octet-stream",
            BigInt(file.size),
            fileKey, // use the localStorage key as the "blobUrl"
            uploadedAt,
          );

          setUploading((prev) =>
            prev.map((u) => (u.id === uploadId ? { ...u, progress: 100 } : u)),
          );

          setTimeout(() => {
            setUploading((prev) => prev.filter((u) => u.id !== uploadId));
          }, 800);

          toast.success(`"${file.name}" uploaded`);
          await loadFiles();
        } catch (e) {
          console.error(e);
          setUploading((prev) =>
            prev.map((u) =>
              u.id === uploadId
                ? { ...u, error: "Upload failed", progress: 0 }
                : u,
            ),
          );
          toast.error(`Failed to upload "${file.name}"`);
        }
      }
    },
    [actor, loadFiles],
  );

  // ── Download handler ────────────────────────────────────────────────────────
  const handleDownload = useCallback(async (file: FileMetadata) => {
    setDownloadingId(file.id);
    try {
      // Retrieve data from localStorage using blobUrl as key
      const dataUrl = localStorage.getItem(file.blobUrl);
      if (!dataUrl) {
        toast.error(`File data not found locally for "${file.fileName}"`);
        return;
      }
      // Convert data URL to blob for download
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`Downloading "${file.fileName}"`);
    } catch {
      toast.error(`Failed to download "${file.fileName}"`);
    } finally {
      setDownloadingId(null);
    }
  }, []);

  // ── Delete handler ──────────────────────────────────────────────────────────
  const handleDelete = useCallback(
    async (file: FileMetadata) => {
      if (!actor) return;
      setDeletingId(file.id);
      try {
        await actor.deleteFileMetadata(file.id);
        // Also remove from localStorage
        localStorage.removeItem(file.blobUrl);
        setFiles((prev) => prev.filter((f) => f.id !== file.id));
        toast.success(`"${file.fileName}" deleted`);
      } catch {
        toast.error(`Failed to delete "${file.fileName}"`);
      } finally {
        setDeletingId(null);
      }
    },
    [actor],
  );

  // ── Drag & drop ─────────────────────────────────────────────────────────────
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current++;
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) setDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragCounterRef.current = 0;
      setDragging(false);
      if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files);
    },
    [handleUpload],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.length) {
        handleUpload(e.target.files);
        e.target.value = "";
      }
    },
    [handleUpload],
  );

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="flex flex-col h-screen bg-background overflow-hidden"
      style={sectionStyle}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Section Style Panel */}
      {showStylePanel && (
        <SectionStylePanel
          sectionId="files"
          sectionLabel="Files"
          onClose={() => setShowStylePanel(false)}
          anchorRef={styleBtnRef as React.RefObject<HTMLElement | null>}
        />
      )}
      {/* Drag overlay */}
      {dragging && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary/10 border-4 border-dashed border-primary rounded-xl pointer-events-none">
          <Upload size={48} className="text-primary mb-3 animate-bounce" />
          <p className="text-xl font-bold text-primary">Drop files to upload</p>
        </div>
      )}

      {/* Header */}
      <header className="px-6 py-5 border-b border-border bg-card/40 flex items-center gap-4 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
          <FolderOpen size={18} className="text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-foreground leading-none font-display">
            My Files
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Upload files from your device and download them anytime
          </p>
        </div>

        {files.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <FolderOpen size={13} className="text-primary" />
            <span className="text-xs font-semibold text-primary">
              {files.length} file{files.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}

        <Button
          ref={styleBtnRef}
          size="sm"
          variant="outline"
          className="h-9 w-9 p-0 border-border text-muted-foreground hover:text-primary hover:border-primary/50"
          onClick={() => setShowStylePanel((p) => !p)}
          title="Customize section style"
          data-ocid="files.style.button"
        >
          <Palette size={14} />
        </Button>

        <Button
          onClick={() => fileInputRef.current?.click()}
          size="sm"
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground h-9 text-xs font-semibold"
        >
          <Upload size={14} />
          Upload File
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileInput}
        />
      </header>

      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
          {/* Upload drop zone */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`w-full border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer
              ${dragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 hover:bg-primary/5"}`}
          >
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Upload size={26} className="text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-foreground">
                Drop files here or{" "}
                <span className="text-primary underline underline-offset-2">
                  browse
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports all file types -- PDFs, images, documents, videos
              </p>
            </div>
          </button>

          {/* Active uploads */}
          {uploading.length > 0 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Uploading
              </p>
              {uploading.map((u) => (
                <div
                  key={u.id}
                  className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
                >
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Loader2 size={16} className="text-primary animate-spin" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {u.fileName}
                    </p>
                    {u.error ? (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertCircle
                          size={12}
                          className="text-destructive shrink-0"
                        />
                        <p className="text-xs text-destructive">{u.error}</p>
                      </div>
                    ) : (
                      <div className="mt-2 space-y-1">
                        <Progress value={u.progress} className="h-1.5" />
                        <p className="text-xs text-muted-foreground">
                          {u.progress}%
                        </p>
                      </div>
                    )}
                  </div>
                  {u.error && (
                    <button
                      type="button"
                      onClick={() =>
                        setUploading((prev) =>
                          prev.filter((x) => x.id !== u.id),
                        )
                      }
                      className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* File list */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 size={28} className="text-primary animate-spin" />
            </div>
          ) : files.length === 0 && uploading.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <FolderOpen size={52} className="opacity-20" />
              <p className="text-sm font-medium">No files uploaded yet</p>
              <p className="text-xs">
                Use the upload button or drag files here to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Saved Files ({files.length})
              </p>
              <div className="rounded-xl border border-border overflow-hidden">
                {files.map((file, idx) => (
                  <div
                    key={String(file.id)}
                    className={`flex items-center gap-4 px-5 py-4 group transition-colors hover:bg-accent/20 ${
                      idx !== 0 ? "border-t border-border" : ""
                    }`}
                  >
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
                      {getFileIcon(file.mimeType)}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-medium text-foreground truncate"
                        title={file.fileName}
                      >
                        {file.fileName}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="text-xs text-muted-foreground">
                          {getFileTypeLabel(file.mimeType)}
                        </span>
                        <span className="text-muted-foreground/30 text-xs">
                          •
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatBytes(file.sizeBytes)}
                        </span>
                        <span className="text-muted-foreground/30 text-xs">
                          •
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(file.uploadedAt)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownload(file)}
                        disabled={downloadingId === file.id}
                        className="h-8 px-3 gap-1.5 text-xs border-border hover:border-primary/50 hover:text-primary hover:bg-primary/10"
                      >
                        {downloadingId === file.id ? (
                          <Loader2
                            size={13}
                            className="animate-spin text-primary"
                          />
                        ) : (
                          <Download size={13} />
                        )}
                        Download
                      </Button>
                      <button
                        type="button"
                        onClick={() => handleDelete(file)}
                        disabled={deletingId === file.id}
                        className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete file"
                      >
                        {deletingId === file.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
