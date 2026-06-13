import { Bar } from "./Bar";
import type { BarState } from "@/hooks/useSortingVisualizer";

interface SortingCanvasProps {
  values: number[];
  states: BarState[];
}

export function SortingCanvas({ values, states }: SortingCanvasProps) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex-1 min-h-0 p-6">
      <div className="h-full w-full rounded-lg border border-border bg-card/30 p-4 min-h-[220px]">
        <div className="flex h-full w-full items-end gap-[2px]">
          {values.map((v, i) => (
            <Bar key={i} value={v} max={max} state={states[i] ?? "default"} />
          ))}
        </div>
      </div>
    </div>
  );
}
