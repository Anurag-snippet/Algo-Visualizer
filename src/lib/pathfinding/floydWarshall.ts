import type { GridNode, PathResult, PathRunner, PathStep } from "./types";
import { getNeighbors } from "./grid";

const INFINITY = Number.POSITIVE_INFINITY;

export const floydWarshall: PathRunner = (grid, start, target) => {
  const steps: PathStep[] = [];
  const rows = grid.length;
  const cols = grid[0].length;
  const nodes: GridNode[] = [];
  const indexOf = new Map<string, number>();

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

  if (startIndex === undefined || targetIndex === undefined) {
    return { steps, found: false };
  }

  const n = nodes.length;
  const dist: number[][] = Array.from({ length: n }, () => Array(n).fill(INFINITY));
  const next: number[][] = Array.from({ length: n }, () => Array(n).fill(-1));

  for (let i = 0; i < n; i++) {
    dist[i][i] = 0;
    next[i][i] = i;
  }

  for (let i = 0; i < n; i++) {
    const node = nodes[i];
    for (const neighbor of getNeighbors(node, grid)) {
      if (neighbor.isWall) continue;
      const neighborIndex = indexOf.get(`${neighbor.row},${neighbor.col}`);
      if (neighborIndex === undefined) continue;
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

  const path: GridNode[] = [];
  let current = startIndex;
  const visitedPath = new Set<number>();

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
