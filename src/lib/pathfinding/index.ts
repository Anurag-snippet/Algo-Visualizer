import { dijkstra } from "./dijkstra";
import { floydWarshall } from "./floydWarshall";
import { bfs } from "./bfs";
import type { PathAlgoId, PathAlgoMeta, PathRunner } from "./types";

export const pathAlgos: Record<PathAlgoId, PathAlgoMeta & { run: PathRunner }> = {
  dijkstra: {
    id: "dijkstra",
    name: "Dijkstra's Algorithm",
    description:
      "Explores nodes in order of distance from the start, guaranteeing the shortest path on weighted graphs with non-negative edges.",
    timeComplexity: "O((V + E) log V)",
    space: "O(V)",
    weighted: true,
    guaranteesShortest: true,
    run: dijkstra,
  },
  floydWarshall: {
    id: "floydWarshall",
    name: "Floyd–Warshall Algorithm",
    description:
      "Computes shortest paths between all pairs of nodes, then reconstructs the shortest route from start to target.",
    timeComplexity: "O(V^3)",
    space: "O(V^2)",
    weighted: true,
    guaranteesShortest: true,
    run: floydWarshall,
  },
  bfs: {
    id: "bfs",
    name: "Breadth-First Search",
    description:
      "Explores neighbors level by level using a FIFO queue. Finds the shortest path in terms of number of edges on unweighted graphs.",
    timeComplexity: "O(V + E)",
    space: "O(V)",
    weighted: false,
    guaranteesShortest: true,
    run: bfs,
  },
};

export const pathList: PathAlgoMeta[] = Object.values(pathAlgos);
export type { PathStep, PathAlgoId, PathAlgoMeta, GridNode } from "./types";
