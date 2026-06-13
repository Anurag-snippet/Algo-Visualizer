import type { SortRunner, SortStep } from "./types";

export const bubbleSort: SortRunner = (input) => {
  const a = [...input];
  const steps: SortStep[] = [];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({ type: "compare", i: j, j: j + 1 });
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        steps.push({ type: "swap", i: j, j: j + 1 });
        swapped = true;
      }
    }
    steps.push({ type: "markSorted", i: n - i - 1 });
    if (!swapped) {
      for (let k = 0; k < n - i - 1; k++) steps.push({ type: "markSorted", i: k });
      break;
    }
  }
  steps.push({ type: "markSorted", i: 0 });
  return steps;
};
