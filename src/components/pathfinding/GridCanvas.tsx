import { useCallback, useRef, useState } from "react";
import { NodeCell } from "./NodeCell";
import type { CellState } from "@/hooks/usePathfindingVisualizer";

type DragMode = "wall-add" | "wall-remove" | "start" | "target" | null;

interface GridCanvasProps {
  rows: number;
  cols: number;
  cells: CellState[][];
  start: { row: number; col: number };
  target: { row: number; col: number };
  disabled: boolean;
  toggleWall: (row: number, col: number, value?: boolean) => void;
  moveStart: (row: number, col: number) => void;
  moveTarget: (row: number, col: number) => void;
}

export function GridCanvas({
  rows,
  cols,
  cells,
  start,
  target,
  disabled,
  toggleWall,
  moveStart,
  moveTarget,
}: GridCanvasProps) {
  const [dragMode, setDragMode] = useState<DragMode>(null);
  const draggingRef = useRef<DragMode>(null);

  const setMode = (m: DragMode) => {
    draggingRef.current = m;
    setDragMode(m);
  };

  const handleMouseDown = useCallback(
    (row: number, col: number) => {
      if (disabled) return;
      if (row === start.row && col === start.col) {
        setMode("start");
        return;
      }
      if (row === target.row && col === target.col) {
        setMode("target");
        return;
      }
      const isWall = cells[row][col].isWall;
      setMode(isWall ? "wall-remove" : "wall-add");
      toggleWall(row, col, !isWall);
    },
    [disabled, start, target, cells, toggleWall]
  );

  const handleMouseEnter = useCallback(
    (row: number, col: number) => {
      const mode = draggingRef.current;
      if (!mode || disabled) return;
      if (mode === "wall-add") toggleWall(row, col, true);
      else if (mode === "wall-remove") toggleWall(row, col, false);
      else if (mode === "start") moveStart(row, col);
      else if (mode === "target") moveTarget(row, col);
    },
    [disabled, toggleWall, moveStart, moveTarget]
  );

  const handleMouseUp = useCallback(() => setMode(null), []);

  return (
    <div className="flex-1 min-h-0 p-4 sm:p-6 overflow-auto">
      <div
        className="mx-auto rounded-lg border border-border bg-card/30 p-2 select-none"
        onMouseLeave={handleMouseUp}
        style={{ width: "min(100%, 1200px)" }}
      >
        <div
          role="grid"
          aria-label="Pathfinding grid"
          className="grid gap-0"
          style={{
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            cursor: dragMode === "start" || dragMode === "target" ? "grabbing" : "crosshair",
          }}
        >
          {cells.map((row, r) =>
            row.map((cell, c) => (
              <NodeCell
                key={`${r}-${c}`}
                row={r}
                col={c}
                isStart={r === start.row && c === start.col}
                isTarget={r === target.row && c === target.col}
                isWall={cell.isWall}
                visual={cell.visual}
                onMouseDown={handleMouseDown}
                onMouseEnter={handleMouseEnter}
                onMouseUp={handleMouseUp}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
