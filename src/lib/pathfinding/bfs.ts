import type { PathRunner, PathStep } from "./types";
import { getNeighbors, reconstructPath } from "./grid";

export const bfs: PathRunner = (grid, start, target) => {
  const steps: PathStep[] = [];
  const startNode = grid[start.row][start.col];
  const targetNode = grid[target.row][target.col];
  startNode.distance = 0;
  const queue = [startNode];
  startNode.isVisited = true;

  while (queue.length) {
    const current = queue.shift()!;
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
