import type { PathRunner, PathStep, GridNode } from "./types";
import { getNeighbors, reconstructPath } from "./grid";

export const dijkstra: PathRunner = (grid, start, target) => {
  const steps: PathStep[] = [];
  const startNode = grid[start.row][start.col];
  const targetNode = grid[target.row][target.col];
  startNode.distance = 0;

  const unvisited: GridNode[] = [];
  for (const row of grid) for (const n of row) unvisited.push(n);

  while (unvisited.length) {
    unvisited.sort((a, b) => a.distance - b.distance);
    const closest = unvisited.shift()!;
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
