import { jsx, jsxs } from "react/jsx-runtime";
import { u as useAnimationPlayer, V as VisualizerShell, C as ControlBar, a as CodeViewer, p as pathfindingCode, I as InfoPanel } from "./algoCode-BwrbSPYw.js";
import { memo, useState, useRef, useCallback, useMemo } from "react";
import { Eraser, Trash2, Sparkles } from "lucide-react";
import "@tanstack/react-router";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
function NodeCellImpl({
  row,
  col,
  isStart,
  isTarget,
  isWall,
  visual,
  onMouseDown,
  onMouseEnter,
  onMouseUp
}) {
  let bg = "bg-background hover:bg-accent/40";
  if (isWall) bg = "bg-viz-wall";
  else if (isStart) bg = "bg-viz-start";
  else if (isTarget) bg = "bg-viz-target";
  else if (visual === "path") bg = "bg-viz-path";
  else if (visual === "visited") bg = "bg-viz-visited/70";
  else if (visual === "frontier") bg = "bg-viz-frontier/80";
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "gridcell",
      onMouseDown: (e) => onMouseDown(row, col, e),
      onMouseEnter: (e) => onMouseEnter(row, col, e),
      onMouseUp,
      className: `border border-border/40 ${bg} transition-colors`,
      style: { aspectRatio: "1 / 1" }
    }
  );
}
const NodeCell = memo(NodeCellImpl);
function GridCanvas({
  rows,
  cols,
  cells,
  start,
  target,
  disabled,
  toggleWall,
  moveStart,
  moveTarget
}) {
  const [dragMode, setDragMode] = useState(null);
  const draggingRef = useRef(null);
  const setMode = (m) => {
    draggingRef.current = m;
    setDragMode(m);
  };
  const handleMouseDown = useCallback(
    (row, col) => {
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
    (row, col) => {
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
  return /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-0 p-4 sm:p-6 overflow-auto", children: /* @__PURE__ */ jsx(
    "div",
    {
      className: "mx-auto rounded-lg border border-border bg-card/30 p-2 select-none",
      onMouseLeave: handleMouseUp,
      style: { width: "min(100%, 1200px)" },
      children: /* @__PURE__ */ jsx(
        "div",
        {
          role: "grid",
          "aria-label": "Pathfinding grid",
          className: "grid gap-0",
          style: {
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            cursor: dragMode === "start" || dragMode === "target" ? "grabbing" : "crosshair"
          },
          children: cells.map(
            (row, r) => row.map((cell, c) => /* @__PURE__ */ jsx(
              NodeCell,
              {
                row: r,
                col: c,
                isStart: r === start.row && c === start.col,
                isTarget: r === target.row && c === target.col,
                isWall: cell.isWall,
                visual: cell.visual,
                onMouseDown: handleMouseDown,
                onMouseEnter: handleMouseEnter,
                onMouseUp: handleMouseUp
              },
              `${r}-${c}`
            ))
          )
        }
      )
    }
  ) });
}
const GRID_ROWS = 20;
const GRID_COLS = 40;
const DEFAULT_START = { row: 10, col: 6 };
const DEFAULT_TARGET = { row: 10, col: 33 };
const createNode = (row, col, start = DEFAULT_START, target = DEFAULT_TARGET) => ({
  row,
  col,
  isStart: row === start.row && col === start.col,
  isTarget: row === target.row && col === target.col,
  isWall: false,
  isVisited: false,
  distance: Infinity,
  heuristic: 0,
  f: Infinity,
  previousNode: null
});
const createGrid = (rows = GRID_ROWS, cols = GRID_COLS, start = DEFAULT_START, target = DEFAULT_TARGET) => {
  const grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) row.push(createNode(r, c, start, target));
    grid.push(row);
  }
  return grid;
};
const cloneGridForRun = (grid) => {
  const clone = grid.map(
    (row) => row.map((n) => ({
      ...n,
      isVisited: false,
      distance: Infinity,
      heuristic: 0,
      f: Infinity,
      previousNode: null
    }))
  );
  return clone;
};
const getNeighbors = (node, grid) => {
  const { row, col } = node;
  const ns = [];
  if (row > 0) ns.push(grid[row - 1][col]);
  if (row < grid.length - 1) ns.push(grid[row + 1][col]);
  if (col > 0) ns.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) ns.push(grid[row][col + 1]);
  return ns;
};
const reconstructPath = (target) => {
  const path = [];
  let cur = target;
  while (cur) {
    path.unshift(cur);
    cur = cur.previousNode;
  }
  return path;
};
const generateMaze = (rows, cols, start, target) => {
  const walls = [];
  const isProtected = (r, c) => r === start.row && c === start.col || r === target.row && c === target.col;
  for (let c = 0; c < cols; c++) {
    if (!isProtected(0, c)) walls.push({ row: 0, col: c });
    if (!isProtected(rows - 1, c)) walls.push({ row: rows - 1, col: c });
  }
  for (let r = 0; r < rows; r++) {
    if (!isProtected(r, 0)) walls.push({ row: r, col: 0 });
    if (!isProtected(r, cols - 1)) walls.push({ row: r, col: cols - 1 });
  }
  const divide = (r1, r2, c1, c2, orientation) => {
    if (r2 - r1 < 2 || c2 - c1 < 2) return;
    if (orientation === "H") {
      const rowChoices = [];
      for (let r = r1 + 1; r < r2; r += 2) rowChoices.push(r);
      if (!rowChoices.length) return;
      const wallRow = rowChoices[Math.floor(Math.random() * rowChoices.length)];
      const passageChoices = [];
      for (let c = c1; c <= c2; c += 2) passageChoices.push(c);
      const passage = passageChoices[Math.floor(Math.random() * passageChoices.length)];
      for (let c = c1; c <= c2; c++) {
        if (c === passage) continue;
        if (!isProtected(wallRow, c)) walls.push({ row: wallRow, col: c });
      }
      divide(r1, wallRow - 1, c1, c2, chooseOrientation(c2 - c1, wallRow - 1 - r1));
      divide(wallRow + 1, r2, c1, c2, chooseOrientation(c2 - c1, r2 - wallRow - 1));
    } else {
      const colChoices = [];
      for (let c = c1 + 1; c < c2; c += 2) colChoices.push(c);
      if (!colChoices.length) return;
      const wallCol = colChoices[Math.floor(Math.random() * colChoices.length)];
      const passageChoices = [];
      for (let r = r1; r <= r2; r += 2) passageChoices.push(r);
      const passage = passageChoices[Math.floor(Math.random() * passageChoices.length)];
      for (let r = r1; r <= r2; r++) {
        if (r === passage) continue;
        if (!isProtected(r, wallCol)) walls.push({ row: r, col: wallCol });
      }
      divide(r1, r2, c1, wallCol - 1, chooseOrientation(wallCol - 1 - c1, r2 - r1));
      divide(r1, r2, wallCol + 1, c2, chooseOrientation(c2 - wallCol - 1, r2 - r1));
    }
  };
  const chooseOrientation = (width, height) => {
    if (width < height) return "H";
    if (height < width) return "V";
    return Math.random() < 0.5 ? "H" : "V";
  };
  divide(1, rows - 2, 1, cols - 2, chooseOrientation(cols - 2, rows - 2));
  const seen = /* @__PURE__ */ new Set();
  return walls.filter((w) => {
    const k = `${w.row},${w.col}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};
const dijkstra = (grid, start, target) => {
  const steps = [];
  const startNode = grid[start.row][start.col];
  const targetNode = grid[target.row][target.col];
  startNode.distance = 0;
  const unvisited = [];
  for (const row of grid) for (const n of row) unvisited.push(n);
  while (unvisited.length) {
    unvisited.sort((a, b) => a.distance - b.distance);
    const closest = unvisited.shift();
    if (closest.isWall) continue;
    if (closest.distance === Infinity) return { steps, found: false };
    closest.isVisited = true;
    if (!closest.isStart && !closest.isTarget)
      steps.push({ type: "visit", row: closest.row, col: closest.col });
    if (closest === targetNode) {
      const path = reconstructPath(targetNode);
      for (const n of path) {
        if (!n.isStart && !n.isTarget) steps.push({ type: "path", row: n.row, col: n.col });
      }
      return { steps, found: true };
    }
    for (const nb of getNeighbors(closest, grid)) {
      if (nb.isVisited || nb.isWall) continue;
      const d = closest.distance + 1;
      if (d < nb.distance) {
        nb.distance = d;
        nb.previousNode = closest;
        if (!nb.isStart && !nb.isTarget)
          steps.push({ type: "frontier", row: nb.row, col: nb.col });
      }
    }
  }
  return { steps, found: false };
};
const INFINITY = Number.POSITIVE_INFINITY;
const floydWarshall = (grid, start, target) => {
  const steps = [];
  const rows = grid.length;
  const cols = grid[0].length;
  const nodes = [];
  const indexOf = /* @__PURE__ */ new Map();
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const node = grid[row][col];
      if (!node.isWall) {
        indexOf.set(`${row},${col}`, nodes.length);
        nodes.push(node);
      }
    }
  }
  const startKey = `${start.row},${start.col}`;
  const targetKey = `${target.row},${target.col}`;
  const startIndex = indexOf.get(startKey);
  const targetIndex = indexOf.get(targetKey);
  if (startIndex === void 0 || targetIndex === void 0) {
    return { steps, found: false };
  }
  const n = nodes.length;
  const dist = Array.from({ length: n }, () => Array(n).fill(INFINITY));
  const next = Array.from({ length: n }, () => Array(n).fill(-1));
  for (let i = 0; i < n; i++) {
    dist[i][i] = 0;
    next[i][i] = i;
  }
  for (let i = 0; i < n; i++) {
    const node = nodes[i];
    for (const neighbor of getNeighbors(node, grid)) {
      if (neighbor.isWall) continue;
      const neighborIndex = indexOf.get(`${neighbor.row},${neighbor.col}`);
      if (neighborIndex === void 0) continue;
      dist[i][neighborIndex] = 1;
      next[i][neighborIndex] = neighborIndex;
    }
  }
  for (let k = 0; k < n; k++) {
    const mid = nodes[k];
    if (!mid.isStart && !mid.isTarget) {
      steps.push({ type: "visit", row: mid.row, col: mid.col });
    }
    for (let i = 0; i < n; i++) {
      if (dist[i][k] === INFINITY) continue;
      for (let j = 0; j < n; j++) {
        if (dist[k][j] === INFINITY) continue;
        const candidate = dist[i][k] + dist[k][j];
        if (candidate < dist[i][j]) {
          dist[i][j] = candidate;
          next[i][j] = next[i][k];
        }
      }
    }
  }
  const path = [];
  let current = startIndex;
  const visitedPath = /* @__PURE__ */ new Set();
  while (current !== targetIndex) {
    const nextIndex = next[current][targetIndex];
    if (nextIndex === -1 || visitedPath.has(nextIndex)) {
      return { steps, found: false };
    }
    visitedPath.add(nextIndex);
    const nextNode = nodes[nextIndex];
    if (!nextNode.isStart && !nextNode.isTarget) {
      path.push(nextNode);
    }
    current = nextIndex;
  }
  for (const node of path) {
    steps.push({ type: "path", row: node.row, col: node.col });
  }
  return { steps, found: true };
};
const bfs = (grid, start, target) => {
  const steps = [];
  const startNode = grid[start.row][start.col];
  const targetNode = grid[target.row][target.col];
  startNode.distance = 0;
  const queue = [startNode];
  startNode.isVisited = true;
  while (queue.length) {
    const current = queue.shift();
    if (current.isWall) continue;
    if (!current.isStart && !current.isTarget)
      steps.push({ type: "visit", row: current.row, col: current.col });
    if (current === targetNode) {
      const path = reconstructPath(targetNode);
      for (const n of path) {
        if (!n.isStart && !n.isTarget) steps.push({ type: "path", row: n.row, col: n.col });
      }
      return { steps, found: true };
    }
    for (const nb of getNeighbors(current, grid)) {
      if (nb.isVisited || nb.isWall) continue;
      nb.isVisited = true;
      nb.previousNode = current;
      nb.distance = current.distance + 1;
      if (!nb.isStart && !nb.isTarget)
        steps.push({ type: "frontier", row: nb.row, col: nb.col });
      queue.push(nb);
    }
  }
  return { steps, found: false };
};
const pathAlgos = {
  dijkstra: {
    id: "dijkstra",
    name: "Dijkstra's Algorithm",
    description: "Explores nodes in order of distance from the start, guaranteeing the shortest path on weighted graphs with non-negative edges.",
    timeComplexity: "O((V + E) log V)",
    space: "O(V)",
    weighted: true,
    guaranteesShortest: true,
    run: dijkstra
  },
  floydWarshall: {
    id: "floydWarshall",
    name: "Floyd–Warshall Algorithm",
    description: "Computes shortest paths between all pairs of nodes, then reconstructs the shortest route from start to target.",
    timeComplexity: "O(V^3)",
    space: "O(V^2)",
    weighted: true,
    guaranteesShortest: true,
    run: floydWarshall
  },
  bfs: {
    id: "bfs",
    name: "Breadth-First Search",
    description: "Explores neighbors level by level using a FIFO queue. Finds the shortest path in terms of number of edges on unweighted graphs.",
    timeComplexity: "O(V + E)",
    space: "O(V)",
    weighted: false,
    guaranteesShortest: true,
    run: bfs
  }
};
const pathList = Object.values(pathAlgos);
const makeWalls = (rows, cols) => Array.from({ length: rows }, () => Array.from({ length: cols }, () => false));
const makeVisuals = (rows, cols) => Array.from({ length: rows }, () => Array.from({ length: cols }, () => "default"));
function usePathfindingVisualizer() {
  const [algo, setAlgo] = useState("dijkstra");
  const [start, setStart] = useState(DEFAULT_START);
  const [target, setTarget] = useState(DEFAULT_TARGET);
  const [walls, setWalls] = useState(() => makeWalls(GRID_ROWS, GRID_COLS));
  const [visuals, setVisuals] = useState(() => makeVisuals(GRID_ROWS, GRID_COLS));
  const wallsRef = useRef(walls);
  wallsRef.current = walls;
  const visualsRef = useRef(visuals);
  visualsRef.current = visuals;
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
  const applyStep = useCallback((step) => {
    const next = visualsRef.current.map((row) => row.slice());
    next[step.row][step.col] = step.type === "visit" ? "visited" : step.type === "frontier" ? "frontier" : "path";
    visualsRef.current = next;
    setVisuals(next);
  }, []);
  const player = useAnimationPlayer({
    steps,
    onStep: applyStep,
    baseMs: 18
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
    (row, col, value) => {
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
    (row, col) => {
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
    (row, col) => {
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
    (a) => {
      setAlgo(a);
      const fresh = makeVisuals(GRID_ROWS, GRID_COLS);
      visualsRef.current = fresh;
      setVisuals(fresh);
    },
    []
  );
  const cells = useMemo(
    () => walls.map(
      (row, r) => row.map((isWall, c) => ({ isWall, visual: visuals[r][c] }))
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
    generateRandomMaze
  };
}
function PathfindingPage() {
  const v = usePathfindingVisualizer();
  const {
    player
  } = v;
  const running = player.status === "playing";
  return /* @__PURE__ */ jsx(VisualizerShell, { children: /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col min-h-0", children: [
    /* @__PURE__ */ jsx(ControlBar, { status: player.status, cursor: player.cursor, total: player.total, speed: player.speed, onPlay: player.play, onPause: player.pause, onStep: player.stepForward, onReset: v.clearPath, onSpeedChange: player.setSpeed }),
    /* @__PURE__ */ jsxs("div", { className: "border-b border-border bg-background px-4 sm:px-6 py-2.5 flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 mr-2", children: pathList.map((a) => /* @__PURE__ */ jsx("button", { onClick: () => v.setAlgo(a.id), disabled: running, className: ["px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-50", v.algo === a.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"].join(" "), children: a.name }, a.id)) }),
      /* @__PURE__ */ jsx("div", { className: "h-5 w-px bg-border" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxs("button", { onClick: v.clearPath, disabled: running, className: toolCls, children: [
          /* @__PURE__ */ jsx(Eraser, { className: "size-3.5" }),
          " Clear Path"
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: v.clearGrid, disabled: running, className: toolCls, children: [
          /* @__PURE__ */ jsx(Trash2, { className: "size-3.5" }),
          " Clear Grid"
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: v.generateRandomMaze, disabled: running, className: toolCls, children: [
          /* @__PURE__ */ jsx(Sparkles, { className: "size-3.5" }),
          " Random Maze"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "ml-auto flex items-center gap-3", children: [
        /* @__PURE__ */ jsx("span", { className: "text-[11px] font-mono text-muted-foreground hidden sm:block", children: "Click + drag to draw walls · drag start/target to move" }),
        /* @__PURE__ */ jsx(CodeViewer, { algoName: v.meta.name, code: pathfindingCode[v.algo] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex min-h-0 flex-col lg:flex-row", children: [
      /* @__PURE__ */ jsx(GridCanvas, { rows: v.rows, cols: v.cols, cells: v.cells, start: v.start, target: v.target, disabled: running, toggleWall: v.toggleWall, moveStart: v.moveStart, moveTarget: v.moveTarget }),
      /* @__PURE__ */ jsx(InfoPanel, { name: v.meta.name, description: v.meta.description, rows: [{
        label: "Time",
        value: v.meta.timeComplexity
      }, {
        label: "Space",
        value: v.meta.space
      }, {
        label: "Weighted",
        value: v.meta.weighted ? "Yes" : "No"
      }, {
        label: "Shortest",
        value: v.meta.guaranteesShortest ? "Guaranteed" : "No"
      }], legend: [{
        label: "Start",
        className: "bg-viz-start"
      }, {
        label: "Target",
        className: "bg-viz-target"
      }, {
        label: "Wall",
        className: "bg-viz-wall"
      }, {
        label: "Frontier",
        className: "bg-viz-frontier"
      }, {
        label: "Visited",
        className: "bg-viz-visited"
      }, {
        label: "Shortest Path",
        className: "bg-viz-path"
      }] })
    ] })
  ] }) });
}
const toolCls = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border bg-background hover:bg-accent transition disabled:opacity-50 disabled:cursor-not-allowed";
export {
  PathfindingPage as component
};
