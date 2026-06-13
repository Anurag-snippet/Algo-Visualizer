import type { SortRunner, SortStep } from "./types";

export const mergeSort: SortRunner = (input) => {
  const a = [...input];
  const aux = [...input];
  const steps: SortStep[] = [];

  const merge = (lo: number, mid: number, hi: number) => {
    for (let k = lo; k <= hi; k++) aux[k] = a[k];
    let i = lo;
    let j = mid + 1;
    for (let k = lo; k <= hi; k++) {
      if (i > mid) {
        a[k] = aux[j];
        steps.push({ type: "overwrite", i: k, value: aux[j] });
        j++;
      } else if (j > hi) {
        a[k] = aux[i];
        steps.push({ type: "overwrite", i: k, value: aux[i] });
        i++;
      } else {
        steps.push({ type: "compare", i, j });
        if (aux[i] <= aux[j]) {
          a[k] = aux[i];
          steps.push({ type: "overwrite", i: k, value: aux[i] });
          i++;
        } else {
          a[k] = aux[j];
          steps.push({ type: "overwrite", i: k, value: aux[j] });
          j++;
        }
      }
    }
  };

  const ms = (lo: number, hi: number) => {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    ms(lo, mid);
    ms(mid + 1, hi);
    merge(lo, mid, hi);
  };

  ms(0, a.length - 1);
  for (let i = 0; i < a.length; i++) steps.push({ type: "markSorted", i });
  return steps;
};
