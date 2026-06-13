export interface GridNode {
  row: number;
  col: number;
  isStart: boolean;
  isTarget: boolean;
  isWall: boolean;
  isVisited: boolean;
  distance: number;
  heuristic: number;
  f: number;
  previousNode: GridNode | null;
}

export type PathStep =
  | { type: "visit"; row: number; col: number }
  | { type: "frontier"; row: number; col: number }
  | { type: "path"; row: number; col: number };

export type PathAlgoId = "dijkstra" | "floydWarshall" | "bfs";

export interface PathAlgoMeta {
  id: PathAlgoId;
  name: string;
  description: string;
  timeComplexity: string;
  space: string;
  weighted: boolean;
  guaranteesShortest: boolean;
}

export interface PathResult {
  steps: PathStep[];
  found: boolean;
}

export type PathRunner = (
  grid: GridNode[][],
  start: { row: number; col: number },
  target: { row: number; col: number }
) => PathResult;
