import { memo } from "react";
import type { BarState } from "@/hooks/useSortingVisualizer";

interface BarProps {
  value: number;
  max: number;
  state: BarState;
}

const stateClass: Record<BarState, string> = {
  default: "bg-viz-default",
  compare: "bg-viz-compare",
  swap: "bg-viz-swap",
  sorted: "bg-viz-sorted",
};

function BarImpl({ value, max, state }: BarProps) {
  const heightPct = (value / Math.max(max, 1)) * 100;
  return (
    <div className="flex-1 min-w-[2px] flex items-end h-full">
      <div
        className={`relative w-full rounded-t-sm transition-[height,background-color] duration-150 ${stateClass[state]}`}
        style={{ height: `${heightPct}%` }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 mt-1 pointer-events-none">
          <span className="text-[10px] font-mono font-semibold text-foreground">
            {value}
          </span>
        </div>
      </div>
    </div>
  );
}

export const Bar = memo(BarImpl);
