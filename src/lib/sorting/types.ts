// Sorting algorithm step types and types
export type SortStep =
  | { type: "compare"; i: number; j: number }
  | { type: "swap"; i: number; j: number }
  | { type: "overwrite"; i: number; value: number }
  | { type: "markSorted"; i: number };

export type SortAlgoId = "bubble" | "quick" | "merge";

export interface SortAlgoMeta {
  id: SortAlgoId;
  name: string;
  description: string;
  timeBest: string;
  timeAvg: string;
  timeWorst: string;
  space: string;
}

export type SortRunner = (input: number[]) => SortStep[];
