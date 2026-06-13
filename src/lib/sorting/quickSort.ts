import type { SortRunner, SortStep } from "./types";

export const quickSort: SortRunner = (input) => {
  const a = [...input];
  const steps: SortStep[] = [];

  const partition = (lo: number, hi: number): number => {
    const pivot = a[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      steps.push({ type: "compare", i: j, j: hi });
      if (a[j] < pivot) {
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          steps.push({ type: "swap", i, j });
        }
        i++;
      }
    }
    if (i !== hi) {
      [a[i], a[hi]] = [a[hi], a[i]];
      steps.push({ type: "swap", i, j: hi });
    }
    return i;
  };

  const qs = (lo: number, hi: number) => {
    if (lo >= hi) {
      if (lo === hi) steps.push({ type: "markSorted", i: lo });
      return;
    }
    const p = partition(lo, hi);
    steps.push({ type: "markSorted", i: p });
    qs(lo, p - 1);
    qs(p + 1, hi);
  };

  qs(0, a.length - 1);
  for (let i = 0; i < a.length; i++) steps.push({ type: "markSorted", i });
  return steps;
};
