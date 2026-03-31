import { f as createLucideIcon, r as reactExports, j as jsxRuntimeExports, b0 as Table, B as Button, P as Palette, C as CirclePlus, I as Input, L as Label, W as ScrollArea, U as Trash2, b as ue } from "./index-CkkKRQCz.js";
import { u as useSectionStyle, S as SectionStylePanel } from "./SectionStylePanel-C0rTiG5h.js";
import { C as ChevronRight } from "./chevron-right-BhQzlmQA.js";
import { B as Bold } from "./bold-RKUbVRX9.js";
import { C as Check } from "./check-BVWYkXo8.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ]
];
const Clipboard = createLucideIcon("clipboard", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M12 3v18", key: "108xh3" }]
];
const Columns2 = createLucideIcon("columns-2", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["line", { x1: "19", x2: "10", y1: "4", y2: "4", key: "15jd3p" }],
  ["line", { x1: "14", x2: "5", y1: "20", y2: "20", key: "bu0au3" }],
  ["line", { x1: "15", x2: "9", y1: "4", y2: "20", key: "uljnxc" }]
];
const Italic = createLucideIcon("italic", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M3 12h18", key: "1i2n21" }]
];
const Rows2 = createLucideIcon("rows-2", __iconNode);
const LS_KEY = "ssc_tables";
function loadTables() {
  try {
    const saved = localStorage.getItem(LS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}
function saveTables(tables) {
  localStorage.setItem(LS_KEY, JSON.stringify(tables));
}
function makeEmptyCells(rows, cols) {
  return Array.from(
    { length: rows },
    () => Array.from({ length: cols }, () => ({ text: "", ticked: false }))
  );
}
function TableMakerTab() {
  const [tables, setTables] = reactExports.useState(loadTables);
  const [selectedId, setSelectedId] = reactExports.useState(
    () => {
      var _a;
      return ((_a = loadTables()[0]) == null ? void 0 : _a.id) ?? null;
    }
  );
  const [creating, setCreating] = reactExports.useState(false);
  const [newTitle, setNewTitle] = reactExports.useState("");
  const [newRows, setNewRows] = reactExports.useState(5);
  const [newCols, setNewCols] = reactExports.useState(5);
  const debounceRef = reactExports.useRef(null);
  const [showStylePanel, setShowStylePanel] = reactExports.useState(false);
  const styleBtnRef = reactExports.useRef(null);
  const { style: sectionStyle } = useSectionStyle("tablemaker");
  const persistTables = reactExports.useCallback((updated) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => saveTables(updated), 300);
  }, []);
  reactExports.useEffect(() => {
    persistTables(tables);
  }, [tables, persistTables]);
  const selectedTable = tables.find((t) => t.id === selectedId) ?? null;
  function createTable() {
    if (!newTitle.trim()) return;
    const rows = Math.max(1, Math.min(20, newRows));
    const cols = Math.max(1, Math.min(10, newCols));
    const table = {
      id: Date.now(),
      title: newTitle.trim(),
      rows,
      cols,
      cells: makeEmptyCells(rows, cols)
    };
    const updated = [table, ...tables];
    setTables(updated);
    setSelectedId(table.id);
    setCreating(false);
    setNewTitle("");
    setNewRows(5);
    setNewCols(5);
  }
  function deleteTable(id) {
    var _a;
    const updated = tables.filter((t) => t.id !== id);
    setTables(updated);
    if (selectedId === id) {
      setSelectedId(((_a = updated[0]) == null ? void 0 : _a.id) ?? null);
    }
  }
  function updateCell(tableId, row, col, patch) {
    setTables(
      (prev) => prev.map((t) => {
        if (t.id !== tableId) return t;
        const newCells = t.cells.map(
          (r, ri) => r.map((c, ci) => ri === row && ci === col ? { ...c, ...patch } : c)
        );
        return { ...t, cells: newCells };
      })
    );
  }
  function addRow(tableId) {
    setTables(
      (prev) => prev.map((t) => {
        if (t.id !== tableId) return t;
        const newRow = Array.from({ length: t.cols }, () => ({
          text: "",
          ticked: false
        }));
        return {
          ...t,
          rows: t.rows + 1,
          cells: [...t.cells, newRow]
        };
      })
    );
  }
  function addCol(tableId) {
    setTables(
      (prev) => prev.map((t) => {
        if (t.id !== tableId) return t;
        return {
          ...t,
          cols: t.cols + 1,
          cells: t.cells.map((row) => [...row, { text: "", ticked: false }])
        };
      })
    );
  }
  function updateBorderColor(tableId, color) {
    setTables(
      (prev) => prev.map((t) => t.id === tableId ? { ...t, borderColor: color } : t)
    );
  }
  function copyAsText(table) {
    const text = table.cells.map((row) => row.map((c) => c.text || "").join("	")).join("\n");
    navigator.clipboard.writeText(text).then(() => ue.success("Table copied to clipboard!")).catch(() => ue.error("Failed to copy"));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex h-screen overflow-hidden bg-background",
      style: sectionStyle,
      children: [
        showStylePanel && /* @__PURE__ */ jsxRuntimeExports.jsx(
          SectionStylePanel,
          {
            sectionId: "tablemaker",
            sectionLabel: "Table Maker",
            onClose: () => setShowStylePanel(false),
            anchorRef: styleBtnRef
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-64 shrink-0 border-r border-border flex flex-col bg-sidebar", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border-b border-border", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Table, { size: 16, className: "text-primary" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-bold text-foreground flex-1", children: "Table Maker" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  ref: styleBtnRef,
                  size: "sm",
                  variant: "ghost",
                  className: "h-6 w-6 p-0 text-muted-foreground hover:text-primary",
                  onClick: () => setShowStylePanel((p) => !p),
                  title: "Customize section style",
                  "data-ocid": "tablemaker.style.button",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Palette, { size: 12 })
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                size: "sm",
                onClick: () => setCreating(true),
                className: "w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground h-8 text-xs",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlus, { size: 13 }),
                  "New Table"
                ]
              }
            )
          ] }),
          creating && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 border-b border-border bg-card/60 space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                placeholder: "Table title...",
                value: newTitle,
                onChange: (e) => setNewTitle(e.target.value),
                onKeyDown: (e) => e.key === "Enter" && createTable(),
                className: "h-7 text-xs bg-input border-border",
                autoFocus: true
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-muted-foreground", children: "Rows (1-20)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    min: 1,
                    max: 20,
                    value: newRows,
                    onChange: (e) => setNewRows(
                      Math.max(1, Math.min(20, Number(e.target.value)))
                    ),
                    className: "h-7 text-xs bg-input border-border mt-1"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-[10px] text-muted-foreground", children: "Cols (1-10)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    type: "number",
                    min: 1,
                    max: 10,
                    value: newCols,
                    onChange: (e) => setNewCols(
                      Math.max(1, Math.min(10, Number(e.target.value)))
                    ),
                    className: "h-7 text-xs bg-input border-border mt-1"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  onClick: createTable,
                  className: "flex-1 h-7 text-xs bg-primary hover:bg-primary/90 text-primary-foreground",
                  children: "Create"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "ghost",
                  onClick: () => setCreating(false),
                  className: "h-7 text-xs text-muted-foreground",
                  children: "Cancel"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-2 space-y-1", children: [
            tables.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8 text-muted-foreground text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Table, { size: 24, className: "mx-auto mb-2 opacity-30" }),
              "No tables yet.",
              /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
              'Click "New Table" to start.'
            ] }),
            tables.map((t) => {
              const isActive = selectedId === t.id;
              return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: `group relative flex items-center gap-2 px-2.5 py-2 rounded-md transition-colors ${isActive ? "bg-primary/15 border border-primary/30" : "hover:bg-accent/40 border border-transparent"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        onClick: () => setSelectedId(t.id),
                        className: "flex items-center gap-2 flex-1 min-w-0 text-left",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Table,
                            {
                              size: 13,
                              className: isActive ? "text-primary shrink-0" : "text-muted-foreground shrink-0"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "p",
                              {
                                className: `text-xs font-medium truncate ${isActive ? "text-foreground" : "text-muted-foreground"}`,
                                children: t.title
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground", children: [
                              t.rows,
                              "×",
                              t.cols
                            ] })
                          ] }),
                          isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
                            ChevronRight,
                            {
                              size: 12,
                              className: "text-primary shrink-0"
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => deleteTable(t.id),
                        className: "opacity-0 group-hover:opacity-100 p-0.5 rounded text-muted-foreground hover:text-destructive transition-all",
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 12 })
                      }
                    )
                  ]
                },
                t.id
              );
            })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-hidden flex flex-col", children: !selectedTable ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 flex items-center justify-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Table, { size: 48, className: "mx-auto mb-4 opacity-20" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "No table selected" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs mt-1", children: "Create a table or select one from the list" })
        ] }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 py-4 border-b border-border flex flex-wrap items-center gap-3 bg-card/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-bold text-foreground", children: selectedTable.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                selectedTable.rows,
                " rows × ",
                selectedTable.cols,
                " columns ·",
                " ",
                selectedTable.cells.flat().filter((c) => c.ticked).length,
                " ",
                "ticked"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground font-medium", children: "Border" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "color",
                    value: selectedTable.borderColor ?? "#3f3f46",
                    onChange: (e) => updateBorderColor(selectedTable.id, e.target.value),
                    className: "w-7 h-7 rounded border border-border cursor-pointer bg-transparent",
                    style: { padding: "2px" },
                    title: "Table border color"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => copyAsText(selectedTable),
                  className: "gap-1.5 h-8 text-xs border-border",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Clipboard, { size: 13 }),
                    "Copy as Text"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => addRow(selectedTable.id),
                  className: "gap-1.5 h-8 text-xs border-border",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Rows2, { size: 13 }),
                    "Add Row"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  onClick: () => addCol(selectedTable.id),
                  className: "gap-1.5 h-8 text-xs border-border",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Columns2, { size: 13 }),
                    "Add Column"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "table",
            {
              className: "border-collapse min-w-full",
              style: selectedTable.borderColor ? {
                "--table-border-color": selectedTable.borderColor
              } : void 0,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: selectedTable.cells.map((row, ri) => {
                const rowKey = `row-${ri}`;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "w-8 text-center text-[10px] text-muted-foreground font-mono pr-2 select-none", children: ri + 1 }),
                  row.map((cell, ci) => {
                    const cellKey = `${rowKey}-col-${ci}`;
                    return /* @__PURE__ */ jsxRuntimeExports.jsx(
                      TableCell,
                      {
                        cell,
                        tableId: selectedTable.id,
                        row: ri,
                        col: ci,
                        colIndex: ci,
                        borderColor: selectedTable.borderColor,
                        onUpdate: updateCell
                      },
                      cellKey
                    );
                  })
                ] }, rowKey);
              }) })
            }
          ) }) }) })
        ] }) })
      ]
    }
  );
}
function TableCell({
  cell,
  tableId,
  row,
  col,
  colIndex,
  borderColor,
  onUpdate
}) {
  const debounceRef = reactExports.useRef(null);
  const [focused, setFocused] = reactExports.useState(false);
  function handleTextChange(e) {
    const text = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onUpdate(tableId, row, col, { text });
    }, 300);
    e.target.value = text;
  }
  function toggleTick() {
    onUpdate(tableId, row, col, { ticked: !cell.ticked });
  }
  const cellStyle = {};
  if (cell.bgColor) cellStyle.backgroundColor = cell.bgColor;
  if (borderColor) cellStyle.borderColor = borderColor;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "td",
    {
      className: `border relative transition-colors min-w-[120px] ${cell.ticked && !cell.bgColor ? "bg-emerald-500/15 border-emerald-500/30" : !cell.bgColor ? "bg-card/40 hover:bg-accent/20 border-border" : "hover:brightness-110"}`,
      style: cellStyle,
      children: [
        row === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground font-mono select-none", children: String.fromCharCode(65 + colIndex) }),
        focused && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute -top-7 left-0 z-10 flex items-center gap-0.5 bg-card border border-border rounded-md shadow-lg px-1 py-0.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onMouseDown: (e) => {
                e.preventDefault();
                onUpdate(tableId, row, col, { bold: !cell.bold });
              },
              title: "Bold",
              className: `p-0.5 rounded text-[11px] font-bold transition-colors ${cell.bold ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bold, { size: 11 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onMouseDown: (e) => {
                e.preventDefault();
                onUpdate(tableId, row, col, { italic: !cell.italic });
              },
              title: "Italic",
              className: `p-0.5 rounded transition-colors ${cell.italic ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Italic, { size: 11 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-px h-3 bg-border mx-0.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "color",
              value: cell.bgColor ?? "#00000000",
              onMouseDown: (e) => e.stopPropagation(),
              onChange: (e) => onUpdate(tableId, row, col, { bgColor: e.target.value }),
              className: "w-5 h-5 rounded cursor-pointer bg-transparent border-none",
              style: { padding: "1px" },
              title: "Cell background color"
            }
          ),
          cell.bgColor && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onMouseDown: (e) => {
                e.preventDefault();
                onUpdate(tableId, row, col, { bgColor: void 0 });
              },
              className: "text-[9px] text-muted-foreground hover:text-foreground px-0.5",
              title: "Clear cell background",
              children: "✕"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 px-2 py-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: toggleTick,
              className: `shrink-0 w-5 h-5 rounded flex items-center justify-center border transition-all ${cell.ticked ? "bg-emerald-500 border-emerald-500 text-white" : "border-border text-transparent hover:border-primary/50 hover:text-primary/30"}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 11 })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              defaultValue: cell.text,
              onChange: handleTextChange,
              onFocus: () => setFocused(true),
              onBlur: () => setFocused(false),
              placeholder: "",
              className: `flex-1 text-xs bg-transparent outline-none border-none min-w-0 placeholder-muted-foreground/30 ${cell.ticked ? "line-through text-muted-foreground" : "text-foreground"} ${cell.bold ? "font-bold" : ""} ${cell.italic ? "italic" : ""}`,
              style: { fontFamily: "inherit" }
            }
          )
        ] })
      ]
    }
  );
}
export {
  TableMakerTab as default
};
