import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Check,
  ChevronRight,
  Columns,
  PlusCircle,
  Rows,
  Table as TableIcon,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface TableCell {
  text: string;
  ticked: boolean;
}

interface TrackerTable {
  id: number;
  title: string;
  rows: number;
  cols: number;
  cells: TableCell[][];
}

const LS_KEY = "ssc_tables";

function loadTables(): TrackerTable[] {
  try {
    const saved = localStorage.getItem(LS_KEY);
    return saved ? (JSON.parse(saved) as TrackerTable[]) : [];
  } catch {
    return [];
  }
}

function saveTables(tables: TrackerTable[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(tables));
}

function makeEmptyCells(rows: number, cols: number): TableCell[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ text: "", ticked: false })),
  );
}

export default function TableMakerTab() {
  const [tables, setTables] = useState<TrackerTable[]>(loadTables);
  const [selectedId, setSelectedId] = useState<number | null>(
    () => loadTables()[0]?.id ?? null,
  );
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newRows, setNewRows] = useState(5);
  const [newCols, setNewCols] = useState(5);

  // debounce ref for auto-save
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persistTables = useCallback((updated: TrackerTable[]) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => saveTables(updated), 300);
  }, []);

  useEffect(() => {
    persistTables(tables);
  }, [tables, persistTables]);

  const selectedTable = tables.find((t) => t.id === selectedId) ?? null;

  function createTable() {
    if (!newTitle.trim()) return;
    const rows = Math.max(1, Math.min(20, newRows));
    const cols = Math.max(1, Math.min(10, newCols));
    const table: TrackerTable = {
      id: Date.now(),
      title: newTitle.trim(),
      rows,
      cols,
      cells: makeEmptyCells(rows, cols),
    };
    const updated = [table, ...tables];
    setTables(updated);
    setSelectedId(table.id);
    setCreating(false);
    setNewTitle("");
    setNewRows(5);
    setNewCols(5);
  }

  function deleteTable(id: number) {
    const updated = tables.filter((t) => t.id !== id);
    setTables(updated);
    if (selectedId === id) {
      setSelectedId(updated[0]?.id ?? null);
    }
  }

  function updateCell(
    tableId: number,
    row: number,
    col: number,
    patch: Partial<TableCell>,
  ) {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        const newCells = t.cells.map((r, ri) =>
          r.map((c, ci) => (ri === row && ci === col ? { ...c, ...patch } : c)),
        );
        return { ...t, cells: newCells };
      }),
    );
  }

  function addRow(tableId: number) {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        const newRow = Array.from({ length: t.cols }, () => ({
          text: "",
          ticked: false,
        }));
        return {
          ...t,
          rows: t.rows + 1,
          cells: [...t.cells, newRow],
        };
      }),
    );
  }

  function addCol(tableId: number) {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        return {
          ...t,
          cols: t.cols + 1,
          cells: t.cells.map((row) => [...row, { text: "", ticked: false }]),
        };
      }),
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left Panel: Table list */}
      <aside className="w-64 shrink-0 border-r border-border flex flex-col bg-sidebar">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <TableIcon size={16} className="text-primary" />
            <h2 className="text-sm font-bold text-foreground">Table Maker</h2>
          </div>
          <Button
            size="sm"
            onClick={() => setCreating(true)}
            className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground h-8 text-xs"
          >
            <PlusCircle size={13} />
            New Table
          </Button>
        </div>

        {/* Create form */}
        {creating && (
          <div className="p-3 border-b border-border bg-card/60 space-y-2">
            <Input
              placeholder="Table title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createTable()}
              className="h-7 text-xs bg-input border-border"
              autoFocus
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[10px] text-muted-foreground">
                  Rows (1-20)
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={20}
                  value={newRows}
                  onChange={(e) =>
                    setNewRows(
                      Math.max(1, Math.min(20, Number(e.target.value))),
                    )
                  }
                  className="h-7 text-xs bg-input border-border mt-1"
                />
              </div>
              <div>
                <Label className="text-[10px] text-muted-foreground">
                  Cols (1-10)
                </Label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={newCols}
                  onChange={(e) =>
                    setNewCols(
                      Math.max(1, Math.min(10, Number(e.target.value))),
                    )
                  }
                  className="h-7 text-xs bg-input border-border mt-1"
                />
              </div>
            </div>
            <div className="flex gap-1.5">
              <Button
                size="sm"
                onClick={createTable}
                className="flex-1 h-7 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Create
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setCreating(false)}
                className="h-7 text-xs text-muted-foreground"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Table list */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {tables.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-xs">
                <TableIcon size={24} className="mx-auto mb-2 opacity-30" />
                No tables yet.
                <br />
                Click "New Table" to start.
              </div>
            )}
            {tables.map((t) => {
              const isActive = selectedId === t.id;
              return (
                <div
                  key={t.id}
                  className={`group relative flex items-center gap-2 px-2.5 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-primary/15 border border-primary/30"
                      : "hover:bg-accent/40 border border-transparent"
                  }`}
                >
                  {/* Clickable selection area */}
                  <button
                    type="button"
                    onClick={() => setSelectedId(t.id)}
                    className="flex items-center gap-2 flex-1 min-w-0 text-left"
                  >
                    <TableIcon
                      size={13}
                      className={
                        isActive
                          ? "text-primary shrink-0"
                          : "text-muted-foreground shrink-0"
                      }
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium truncate ${
                          isActive ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {t.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {t.rows}×{t.cols}
                      </p>
                    </div>
                    {isActive && (
                      <ChevronRight
                        size={12}
                        className="text-primary shrink-0"
                      />
                    )}
                  </button>
                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => deleteTable(t.id)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </aside>

      {/* Right Panel: Table Editor */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {!selectedTable ? (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <TableIcon size={48} className="mx-auto mb-4 opacity-20" />
              <p className="text-sm font-medium">No table selected</p>
              <p className="text-xs mt-1">
                Create a table or select one from the list
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="px-6 py-4 border-b border-border flex items-center gap-4 bg-card/40">
              <div className="flex-1">
                <h2 className="text-base font-bold text-foreground">
                  {selectedTable.title}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {selectedTable.rows} rows × {selectedTable.cols} columns ·{" "}
                  {selectedTable.cells.flat().filter((c) => c.ticked).length}{" "}
                  ticked
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addRow(selectedTable.id)}
                  className="gap-1.5 h-8 text-xs border-border"
                >
                  <Rows size={13} />
                  Add Row
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addCol(selectedTable.id)}
                  className="gap-1.5 h-8 text-xs border-border"
                >
                  <Columns size={13} />
                  Add Column
                </Button>
              </div>
            </div>

            {/* Table scroll area */}
            <ScrollArea className="flex-1">
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="border-collapse min-w-full">
                    <tbody>
                      {selectedTable.cells.map((row, ri) => {
                        const rowKey = `row-${ri}`;
                        return (
                          <tr key={rowKey}>
                            {/* Row number */}
                            <td className="w-8 text-center text-[10px] text-muted-foreground font-mono pr-2 select-none">
                              {ri + 1}
                            </td>
                            {row.map((cell, ci) => {
                              const cellKey = `${rowKey}-col-${ci}`;
                              return (
                                <TableCell
                                  key={cellKey}
                                  cell={cell}
                                  tableId={selectedTable.id}
                                  row={ri}
                                  col={ci}
                                  colIndex={ci}
                                  onUpdate={updateCell}
                                />
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </ScrollArea>
          </>
        )}
      </main>
    </div>
  );
}

interface TableCellProps {
  cell: TableCell;
  tableId: number;
  row: number;
  col: number;
  colIndex: number;
  onUpdate: (
    tableId: number,
    row: number,
    col: number,
    patch: Partial<TableCell>,
  ) => void;
}

function TableCell({
  cell,
  tableId,
  row,
  col,
  colIndex,
  onUpdate,
}: TableCellProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    const text = e.target.value;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onUpdate(tableId, row, col, { text });
    }, 300);
    // Optimistic update for the input value
    e.target.value = text;
  }

  function toggleTick() {
    onUpdate(tableId, row, col, { ticked: !cell.ticked });
  }

  return (
    <td
      className={`border border-border relative transition-colors min-w-[120px] ${
        cell.ticked
          ? "bg-emerald-500/15 border-emerald-500/30"
          : "bg-card/40 hover:bg-accent/20"
      }`}
    >
      {/* Column header (first row shows col letters) */}
      {row === 0 && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground font-mono select-none">
          {String.fromCharCode(65 + colIndex)}
        </div>
      )}

      <div className="flex items-center gap-1 px-2 py-1.5">
        {/* Tick button */}
        <button
          type="button"
          onClick={toggleTick}
          className={`shrink-0 w-5 h-5 rounded flex items-center justify-center border transition-all ${
            cell.ticked
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "border-border text-transparent hover:border-primary/50 hover:text-primary/30"
          }`}
        >
          <Check size={11} />
        </button>

        {/* Text input */}
        <input
          type="text"
          defaultValue={cell.text}
          onChange={handleTextChange}
          placeholder=""
          className={`flex-1 text-xs bg-transparent outline-none border-none min-w-0 placeholder-muted-foreground/30 ${
            cell.ticked
              ? "line-through text-muted-foreground"
              : "text-foreground"
          }`}
          style={{ fontFamily: "inherit" }}
        />
      </div>
    </td>
  );
}
