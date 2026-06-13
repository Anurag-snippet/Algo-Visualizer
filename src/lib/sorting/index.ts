import { bubbleSort } from "./bubbleSort";
import { quickSort } from "./quickSort";
import { mergeSort } from "./mergeSort";
import type { SortAlgoId, SortAlgoMeta, SortRunner } from "./types";

export const sortingAlgos: Record<
  SortAlgoId,
  SortAlgoMeta & { run: SortRunner }
> = {
  bubble: {
    id: "bubble",
    name: "Bubble Sort",
    description:
      "Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Simple but slow on large inputs.",
    timeBest: "O(n)",
    timeAvg: "O(n²)",
    timeWorst: "O(n²)",
    space: "O(1)",
    run: bubbleSort,
  },
  quick: {
    id: "quick",
    name: "Quick Sort",
    description:
      "Divide-and-conquer sort that picks a pivot, partitions the array around it, then recursively sorts the partitions. Fast in practice with O(n log n) average.",
    timeBest: "O(n log n)",
    timeAvg: "O(n log n)",
    timeWorst: "O(n²)",
    space: "O(log n)",
    run: quickSort,
  },
  merge: {
    id: "merge",
    name: "Merge Sort",
    description:
      "Splits the array in half, recursively sorts each half, then merges them using an auxiliary array. Stable and guaranteed O(n log n).",
    timeBest: "O(n log n)",
    timeAvg: "O(n log n)",
    timeWorst: "O(n log n)",
    space: "O(n)",
    run: mergeSort,
  },
};

export const sortingList: SortAlgoMeta[] = Object.values(sortingAlgos);
export type { SortStep, SortAlgoId, SortAlgoMeta } from "./types";
