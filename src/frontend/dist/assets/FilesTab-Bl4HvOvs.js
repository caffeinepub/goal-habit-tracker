import { f as createLucideIcon, a5 as useActor, r as reactExports, b as ue, j as jsxRuntimeExports, a6 as Upload, a7 as FolderOpen, B as Button, P as Palette, V as ScrollArea, e as Progress, Z as X, a8 as Download, S as Trash2 } from "./index-BsN7n755.js";
import { u as useSectionStyle, S as SectionStylePanel } from "./SectionStylePanel-N7W_wvoR.js";
import { L as LoaderCircle } from "./loader-circle-Cv36FyYt.js";
import { C as CircleAlert } from "./circle-alert-BMdIg6GL.js";
import { F as FileText } from "./file-text-DlJAkoCZ.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["circle", { cx: "10", cy: "12", r: "2", key: "737tya" }],
  ["path", { d: "m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22", key: "wt3hpn" }]
];
const FileImage = createLucideIcon("file-image", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "m10 11 5 3-5 3v-6Z", key: "7ntvm4" }]
];
const FileVideo = createLucideIcon("file-video", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }]
];
const File = createLucideIcon("file", __iconNode);
function formatBytes(bytes) {
  const n = Number(bytes);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(1)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}
function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return iso;
  }
}
function getFileIcon(mimeType) {
  if (mimeType.startsWith("image/"))
    return /* @__PURE__ */ jsxRuntimeExports.jsx(FileImage, { size: 20, className: "text-blue-400" });
  if (mimeType.startsWith("video/"))
    return /* @__PURE__ */ jsxRuntimeExports.jsx(FileVideo, { size: 20, className: "text-purple-400" });
  if (mimeType === "application/pdf")
    return /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 20, className: "text-red-400" });
  if (mimeType.startsWith("text/"))
    return /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 20, className: "text-emerald-400" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(File, { size: 20, className: "text-muted-foreground" });
}
function getFileTypeLabel(mimeType) {
  if (mimeType.startsWith("image/")) return "Image";
  if (mimeType.startsWith("video/")) return "Video";
  if (mimeType === "application/pdf") return "PDF";
  if (mimeType.startsWith("text/")) return "Text";
  if (mimeType.includes("spreadsheet") || mimeType.includes("excel") || mimeType.includes("xlsx"))
    return "Spreadsheet";
  if (mimeType.includes("document") || mimeType.includes("word") || mimeType.includes("docx"))
    return "Document";
  return "File";
}
function FilesTab() {
  const { actor } = useActor();
  const [files, setFiles] = reactExports.useState([]);
  const [uploading, setUploading] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [dragging, setDragging] = reactExports.useState(false);
  const [downloadingId, setDownloadingId] = reactExports.useState(null);
  const [deletingId, setDeletingId] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const dragCounterRef = reactExports.useRef(0);
  const [showStylePanel, setShowStylePanel] = reactExports.useState(false);
  const styleBtnRef = reactExports.useRef(null);
  const { style: sectionStyle } = useSectionStyle("files");
  const loadFiles = reactExports.useCallback(async () => {
    if (!actor) return;
    try {
      const result = await actor.getAllFileMetadata();
      setFiles(
        [...result].sort(
          (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        )
      );
    } catch {
      ue.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  }, [actor]);
  reactExports.useEffect(() => {
    if (actor) loadFiles();
  }, [actor, loadFiles]);
  const handleUpload = reactExports.useCallback(
    async (fileList) => {
      if (!actor) {
        ue.error("Not connected. Please wait.");
        return;
      }
      const arr = Array.from(fileList);
      if (!arr.length) return;
      for (const file of arr) {
        const uploadId = `${Date.now()}-${Math.random()}`;
        setUploading((prev) => [
          ...prev,
          { id: uploadId, fileName: file.name, progress: 0 }
        ]);
        try {
          setUploading(
            (prev) => prev.map((u) => u.id === uploadId ? { ...u, progress: 20 } : u)
          );
          const dataUrl = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
          setUploading(
            (prev) => prev.map((u) => u.id === uploadId ? { ...u, progress: 60 } : u)
          );
          const fileKey = `ssc_file_${Date.now()}_${Math.random().toString(36).slice(2)}`;
          try {
            localStorage.setItem(fileKey, dataUrl);
          } catch {
          }
          const uploadedAt = (/* @__PURE__ */ new Date()).toISOString();
          await actor.saveFileMetadata(
            file.name,
            file.type || "application/octet-stream",
            BigInt(file.size),
            fileKey,
            // use the localStorage key as the "blobUrl"
            uploadedAt
          );
          setUploading(
            (prev) => prev.map((u) => u.id === uploadId ? { ...u, progress: 100 } : u)
          );
          setTimeout(() => {
            setUploading((prev) => prev.filter((u) => u.id !== uploadId));
          }, 800);
          ue.success(`"${file.name}" uploaded`);
          await loadFiles();
        } catch (e) {
          console.error(e);
          setUploading(
            (prev) => prev.map(
              (u) => u.id === uploadId ? { ...u, error: "Upload failed", progress: 0 } : u
            )
          );
          ue.error(`Failed to upload "${file.name}"`);
        }
      }
    },
    [actor, loadFiles]
  );
  const handleDownload = reactExports.useCallback(async (file) => {
    setDownloadingId(file.id);
    try {
      const dataUrl = localStorage.getItem(file.blobUrl);
      if (!dataUrl) {
        ue.error(`File data not found locally for "${file.fileName}"`);
        return;
      }
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
      ue.success(`Downloading "${file.fileName}"`);
    } catch {
      ue.error(`Failed to download "${file.fileName}"`);
    } finally {
      setDownloadingId(null);
    }
  }, []);
  const handleDelete = reactExports.useCallback(
    async (file) => {
      if (!actor) return;
      setDeletingId(file.id);
      try {
        await actor.deleteFileMetadata(file.id);
        localStorage.removeItem(file.blobUrl);
        setFiles((prev) => prev.filter((f) => f.id !== file.id));
        ue.success(`"${file.fileName}" deleted`);
      } catch {
        ue.error(`Failed to delete "${file.fileName}"`);
      } finally {
        setDeletingId(null);
      }
    },
    [actor]
  );
  const handleDragEnter = reactExports.useCallback((e) => {
    e.preventDefault();
    dragCounterRef.current++;
    setDragging(true);
  }, []);
  const handleDragLeave = reactExports.useCallback((e) => {
    e.preventDefault();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) setDragging(false);
  }, []);
  const handleDragOver = reactExports.useCallback((e) => {
    e.preventDefault();
  }, []);
  const handleDrop = reactExports.useCallback(
    (e) => {
      e.preventDefault();
      dragCounterRef.current = 0;
      setDragging(false);
      if (e.dataTransfer.files.length) handleUpload(e.dataTransfer.files);
    },
    [handleUpload]
  );
  const handleFileInput = reactExports.useCallback(
    (e) => {
      var _a;
      if ((_a = e.target.files) == null ? void 0 : _a.length) {
        handleUpload(e.target.files);
        e.target.value = "";
      }
    },
    [handleUpload]
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex flex-col h-screen bg-background overflow-hidden",
      style: sectionStyle,
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
      children: [
        showStylePanel && /* @__PURE__ */ jsxRuntimeExports.jsx(
          SectionStylePanel,
          {
            sectionId: "files",
            sectionLabel: "Files",
            onClose: () => setShowStylePanel(false),
            anchorRef: styleBtnRef
          }
        ),
        dragging && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-50 flex flex-col items-center justify-center bg-primary/10 border-4 border-dashed border-primary rounded-xl pointer-events-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 48, className: "text-primary mb-3 animate-bounce" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-primary", children: "Drop files to upload" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "px-6 py-5 border-b border-border bg-card/40 flex items-center gap-4 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { size: 18, className: "text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-bold text-foreground leading-none font-display", children: "My Files" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Upload files from your device and download them anytime" })
          ] }),
          files.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { size: 13, className: "text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold text-primary", children: [
              files.length,
              " file",
              files.length !== 1 ? "s" : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              ref: styleBtnRef,
              size: "sm",
              variant: "outline",
              className: "h-9 w-9 p-0 border-border text-muted-foreground hover:text-primary hover:border-primary/50",
              onClick: () => setShowStylePanel((p) => !p),
              title: "Customize section style",
              "data-ocid": "files.style.button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 14 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: () => {
                var _a;
                return (_a = fileInputRef.current) == null ? void 0 : _a.click();
              },
              size: "sm",
              className: "gap-2 bg-primary hover:bg-primary/90 text-primary-foreground h-9 text-xs font-semibold",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 14 }),
                "Upload File"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: fileInputRef,
              type: "file",
              multiple: true,
              className: "hidden",
              onChange: handleFileInput
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6 max-w-4xl mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                var _a;
                return (_a = fileInputRef.current) == null ? void 0 : _a.click();
              },
              className: `w-full border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer
              ${dragging ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 hover:bg-primary/5"}`,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { size: 26, className: "text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-semibold text-foreground", children: [
                    "Drop files here or",
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-primary underline underline-offset-2", children: "browse" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: "Supports all file types -- PDFs, images, documents, videos" })
                ] })
              ]
            }
          ),
          uploading.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: "Uploading" }),
            uploading.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "bg-card border border-border rounded-xl p-4 flex items-center gap-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 16, className: "text-primary animate-spin" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-foreground truncate", children: u.fileName }),
                    u.error ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        CircleAlert,
                        {
                          size: 12,
                          className: "text-destructive shrink-0"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-destructive", children: u.error })
                    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: u.progress, className: "h-1.5" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                        u.progress,
                        "%"
                      ] })
                    ] })
                  ] }),
                  u.error && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setUploading(
                        (prev) => prev.filter((x) => x.id !== u.id)
                      ),
                      className: "p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
                    }
                  )
                ]
              },
              u.id
            ))
          ] }),
          loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 28, className: "text-primary animate-spin" }) }) : files.length === 0 && uploading.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-16 text-muted-foreground gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { size: 52, className: "opacity-20" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "No files uploaded yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs", children: "Use the upload button or drag files here to get started" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide", children: [
              "Saved Files (",
              files.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border overflow-hidden", children: files.map((file, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: `flex items-center gap-4 px-5 py-4 group transition-colors hover:bg-accent/20 ${idx !== 0 ? "border-t border-border" : ""}`,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0", children: getFileIcon(file.mimeType) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "p",
                      {
                        className: "text-sm font-medium text-foreground truncate",
                        title: file.fileName,
                        children: file.fileName
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mt-0.5 flex-wrap", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: getFileTypeLabel(file.mimeType) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30 text-xs", children: "•" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: formatBytes(file.sizeBytes) }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground/30 text-xs", children: "•" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: formatDate(file.uploadedAt) })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 shrink-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      Button,
                      {
                        size: "sm",
                        variant: "outline",
                        onClick: () => handleDownload(file),
                        disabled: downloadingId === file.id,
                        className: "h-8 px-3 gap-1.5 text-xs border-border hover:border-primary/50 hover:text-primary hover:bg-primary/10",
                        children: [
                          downloadingId === file.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                            LoaderCircle,
                            {
                              size: 13,
                              className: "animate-spin text-primary"
                            }
                          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { size: 13 }),
                          "Download"
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => handleDelete(file),
                        disabled: deletingId === file.id,
                        className: "p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100",
                        title: "Delete file",
                        children: deletingId === file.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 })
                      }
                    )
                  ] })
                ]
              },
              String(file.id)
            )) })
          ] })
        ] }) })
      ]
    }
  );
}
export {
  FilesTab as default
};
