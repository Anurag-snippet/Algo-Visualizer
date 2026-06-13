import { useCallback, useMemo, useRef, useState } from "react";
import {
  pathAlgos,
  type PathAlgoId,
  type PathStep,
} from "@/lib/pathfinding";
import {
  GRID_ROWS,
  GRID_COLS,
  DEFAULT_START,
  DEFAULT_TARGET,
  createGrid,
  cloneGridForRun,
  generateMaze,
} from "@/lib/pathfinding/grid";
import { useAnimationPlayer } from "./useAnimationPlayer";

export type CellVisual = "default" | "visited" | "frontier" | "path";

export interface CellState {
  isWall: boolean;
  visual: CellVisual;
}

const makeWalls = (rows: number, cols: number): boolean[][] =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => false));

const makeVisuals = (rows: number, cols: number): CellVisual[][] =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => "default" as CellVisual));

export function usePathfindingVisualizer() {
  const [algo, setAlgo] = useState<PathAlgoId>("dijkstra");
  const [start, setStart] = useState(DEFAULT_START);
  const [target, setTarget] = useState(DEFAULT_TARGET);
  const [walls, setWalls] = useState<boolean[][]>(() => makeWalls(GRID_ROWS, GRID_COLS));
  const [visuals, setVisuals] = useState<CellVisual[][]>(() => makeVisuals(GRID_ROWS, GRID_COLS));

  const wallsRef = useRef(walls);
  wallsRef.current = walls;
  const visualsRef = useRef(visuals);
  visualsRef.current = visuals;

  // Steps depend only on algo/start/target/walls — NOT on visuals.
  const steps = useMemo(() => {
    const grid = createGrid(GRID_ROWS, GRID_COLS, start, target);
    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        if (walls[r][c]) grid[r][c].isWall = true;
      }
    }
    const cleaned = cloneGridForRun(grid);
    return pathAlgos[algo].run(cleaned, start, target).steps;
  }, [algo, start, target, walls]);

  const applyStep = useCallback((step: PathStep) => {
    const next = visualsRef.current.map((row) => row.slice());
    next[step.row][step.col] =
      step.type === "visit" ? "visited" : step.type === "frontier" ? "frontier" : "path";
    visualsRef.current = next;
    setVisuals(next);
  }, []);

  const player = useAnimationPlayer<PathStep>({
    steps,
    onStep: applyStep,
    baseMs: 18,
  });

  const clearPath = useCallback(() => {
    player.reset();
    const fresh = makeVisuals(GRID_ROWS, GRID_COLS);
    visualsRef.current = fresh;
    setVisuals(fresh);
  }, [player]);

  const clearGrid = useCallback(() => {
    player.reset();
    const w = makeWalls(GRID_ROWS, GRID_COLS);
    const v = makeVisuals(GRID_ROWS, GRID_COLS);
    wallsRef.current = w;
    visualsRef.current = v;
    setWalls(w);
    setVisuals(v);
  }, [player]);

  const toggleWall = useCallback(
    (row: number, col: number, value?: boolean) => {
      if (row === start.row && col === start.col) return;
      if (row === target.row && col === target.col) return;
      const next = wallsRef.current.map((r) => r.slice());
      next[row][col] = value ?? !next[row][col];
      wallsRef.current = next;
      setWalls(next);
    },
    [start, target]
  );

  const moveStart = useCallback(
    (row: number, col: number) => {
      if (row === target.row && col === target.col) return;
      if (wallsRef.current[row][col]) {
        const w = wallsRef.current.map((r) => r.slice());
        w[row][col] = false;
        wallsRef.current = w;
        setWalls(w);
      }
      setStart({ row, col });
    },
    [target]
  );

  const moveTarget = useCallback(
    (row: number, col: number) => {
      if (row === start.row && col === start.col) return;
      if (wallsRef.current[row][col]) {
        const w = wallsRef.current.map((r) => r.slice());
        w[row][col] = false;
        wallsRef.current = w;
        setWalls(w);
      }
      setTarget({ row, col });
    },
    [start]
  );

  const generateRandomMaze = useCallback(() => {
    player.reset();
    const w = makeWalls(GRID_ROWS, GRID_COLS);
    const wallList = generateMaze(GRID_ROWS, GRID_COLS, start, target);
    for (const ww of wallList) w[ww.row][ww.col] = true;
    const v = makeVisuals(GRID_ROWS, GRID_COLS);
    wallsRef.current = w;
    visualsRef.current = v;
    setWalls(w);
    setVisuals(v);
  }, [start, target, player]);

  const handleSetAlgo = useCallback(
    (a: PathAlgoId) => {
      setAlgo(a);
      const fresh = makeVisuals(GRID_ROWS, GRID_COLS);
      visualsRef.current = fresh;
      setVisuals(fresh);
    },
    []
  );

  // Combined cells for rendering
  const cells: CellState[][] = useMemo(
    () =>
      walls.map((row, r) =>
        row.map((isWall, c) => ({ isWall, visual: visuals[r][c] }))
      ),
    [walls, visuals]
  );

  return {
    algo,
    setAlgo: handleSetAlgo,
    start,
    target,
    cells,
    rows: GRID_ROWS,
    cols: GRID_COLS,
    player,
    meta: pathAlgos[algo],
    toggleWall,
    moveStart,
    moveTarget,
    clearGrid,
    clearPath,
    generateRandomMaze,
  };
}
