import { memo } from "react";
import type { CellVisual } from "@/hooks/usePathfindingVisualizer";

interface NodeCellProps {
  row: number;
  col: number;
  isStart: boolean;
  isTarget: boolean;
  isWall: boolean;
  visual: CellVisual;
  onMouseDown: (row: number, col: number, e: React.MouseEvent) => void;
  onMouseEnter: (row: number, col: number, e: React.MouseEvent) => void;
  onMouseUp: () => void;
}

function NodeCellImpl({
  row,
  col,
  isStart,
  isTarget,
  isWall,
  visual,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}: NodeCellProps) {
  let bg = "bg-background hover:bg-accent/40";
  if (isWall) bg = "bg-viz-wall";
  else if (isStart) bg = "bg-viz-start";
  else if (isTarget) bg = "bg-viz-target";
  else if (visual === "path") bg = "bg-viz-path";
  else if (visual === "visited") bg = "bg-viz-visited/70";
  else if (visual === "frontier") bg = "bg-viz-frontier/80";

  return (
    <div
      role="gridcell"
      onMouseDown={(e) => onMouseDown(row, col, e)}
      onMouseEnter={(e) => onMouseEnter(row, col, e)}
      onMouseUp={onMouseUp}
      className={`border border-border/40 ${bg} transition-colors`}
      style={{ aspectRatio: "1 / 1" }}
    />
  );
}

export const NodeCell = memo(NodeCellImpl);
