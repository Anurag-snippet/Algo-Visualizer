import type { GridNode } from "./types";

export const GRID_ROWS = 20;
export const GRID_COLS = 40;

export const DEFAULT_START = { row: 10, col: 6 };
export const DEFAULT_TARGET = { row: 10, col: 33 };

export const createNode = (row: number, col: number, start = DEFAULT_START, target = DEFAULT_TARGET): GridNode => ({
  row,
  col,
  isStart: row === start.row && col === start.col,
  isTarget: row === target.row && col === target.col,
  isWall: false,
  isVisited: false,
  distance: Infinity,
  heuristic: 0,
  f: Infinity,
  previousNode: null,
});

export const createGrid = (
  rows = GRID_ROWS,
  cols = GRID_COLS,
  start = DEFAULT_START,
  target = DEFAULT_TARGET
): GridNode[][] => {
  const grid: GridNode[][] = [];
  for (let r = 0; r < rows; r++) {
    const row: GridNode[] = [];
    for (let c = 0; c < cols; c++) row.push(createNode(r, c, start, target));
    grid.push(row);
  }
  return grid;
};

export const cloneGridForRun = (grid: GridNode[][]): GridNode[][] => {
  const clone: GridNode[][] = grid.map((row) =>
    row.map((n) => ({
      ...n,
      isVisited: false,
      distance: Infinity,
      heuristic: 0,
      f: Infinity,
      previousNode: null,
    }))
  );
  return clone;
};

export const getNeighbors = (node: GridNode, grid: GridNode[][]): GridNode[] => {
  const { row, col } = node;
  const ns: GridNode[] = [];
  if (row > 0) ns.push(grid[row - 1][col]);
  if (row < grid.length - 1) ns.push(grid[row + 1][col]);
  if (col > 0) ns.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) ns.push(grid[row][col + 1]);
  return ns;
};

export const reconstructPath = (target: GridNode): GridNode[] => {
  const path: GridNode[] = [];
  let cur: GridNode | null = target;
  while (cur) {
    path.unshift(cur);
    cur = cur.previousNode;
  }
  return path;
};

// Recursive division maze generator. Returns a list of {row,col} wall cells.
export const generateMaze = (
  rows: number,
  cols: number,
  start: { row: number; col: number },
  target: { row: number; col: number }
): { row: number; col: number }[] => {
  const walls: { row: number; col: number }[] = [];
  const isProtected = (r: number, c: number) =>
    (r === start.row && c === start.col) || (r === target.row && c === target.col);

  // Outer borders
  for (let c = 0; c < cols; c++) {
    if (!isProtected(0, c)) walls.push({ row: 0, col: c });
    if (!isProtected(rows - 1, c)) walls.push({ row: rows - 1, col: c });
  }
  for (let r = 0; r < rows; r++) {
    if (!isProtected(r, 0)) walls.push({ row: r, col: 0 });
    if (!isProtected(r, cols - 1)) walls.push({ row: r, col: cols - 1 });
  }

  const divide = (r1: number, r2: number, c1: number, c2: number, orientation: "H" | "V") => {
    if (r2 - r1 < 2 || c2 - c1 < 2) return;
    if (orientation === "H") {
      const rowChoices: number[] = [];
      for (let r = r1 + 1; r < r2; r += 2) rowChoices.push(r);
      if (!rowChoices.length) return;
      const wallRow = rowChoices[Math.floor(Math.random() * rowChoices.length)];
      const passageChoices: number[] = [];
      for (let c = c1; c <= c2; c += 2) passageChoices.push(c);
      const passage = passageChoices[Math.floor(Math.random() * passageChoices.length)];
      for (let c = c1; c <= c2; c++) {
        if (c === passage) continue;
        if (!isProtected(wallRow, c)) walls.push({ row: wallRow, col: c });
      }
      divide(r1, wallRow - 1, c1, c2, chooseOrientation(c2 - c1, wallRow - 1 - r1));
      divide(wallRow + 1, r2, c1, c2, chooseOrientation(c2 - c1, r2 - wallRow - 1));
    } else {
      const colChoices: number[] = [];
      for (let c = c1 + 1; c < c2; c += 2) colChoices.push(c);
      if (!colChoices.length) return;
      const wallCol = colChoices[Math.floor(Math.random() * colChoices.length)];
      const passageChoices: number[] = [];
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

  const chooseOrientation = (width: number, height: number): "H" | "V" => {
    if (width < height) return "H";
    if (height < width) return "V";
    return Math.random() < 0.5 ? "H" : "V";
  };

  divide(1, rows - 2, 1, cols - 2, chooseOrientation(cols - 2, rows - 2));

  // Dedupe
  const seen = new Set<string>();
  return walls.filter((w) => {
    const k = `${w.row},${w.col}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};
