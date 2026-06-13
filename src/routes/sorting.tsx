import { createFileRoute } from "@tanstack/react-router";
import { VisualizerShell } from "@/components/layout/VisualizerShell";
import { ControlBar } from "@/components/layout/ControlBar";
import { InfoPanel } from "@/components/layout/InfoPanel";
import { SortingCanvas } from "@/components/sorting/SortingCanvas";
import { useSortingVisualizer } from "@/hooks/useSortingVisualizer";
import { sortingList } from "@/lib/sorting";
import { Shuffle, ArrowDownUp, ListChecks } from "lucide-react";
import { CodeViewer } from "@/components/CodeViewer";
import { sortingCode } from "@/lib/algoCode";

export const Route = createFileRoute("/sorting")({
  head: () => ({
    meta: [
      { title: "Sorting Visualizer — Algo Visualizer Hub" },
      {
        name: "description",
        content:
          "Visualize Bubble, Quick, and Merge sort with bar-chart animation, step controls, and adjustable speed.",
      },
      { property: "og:title", content: "Sorting Visualizer — Algo Visualizer Hub" },
      {
        property: "og:description",
        content: "Watch sorting algorithms execute step by step on randomized arrays.",
      },
    ],
  }),
  component: SortingPage,
});

function SortingPage() {
  const v = useSortingVisualizer();
  const { player } = v;

  return (
    <VisualizerShell>
      <div className="flex-1 flex flex-col min-h-0">
        <ControlBar
          status={player.status}
          cursor={player.cursor}
          total={player.total}
          speed={player.speed}
          onPlay={player.play}
          onPause={player.pause}
          onStep={player.stepForward}
          onReset={v.reset}
          onSpeedChange={player.setSpeed}
        >
          <div className="flex items-center gap-2">
            <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-mono">
              Size
            </label>
            <input
              type="range"
              min={10}
              max={120}
              step={1}
              value={v.size}
              onChange={(e) => v.setSize(Number(e.target.value))}
              className="w-32 accent-primary"
            />
            <span className="text-xs font-mono tabular-nums w-8 text-right">{v.size}</span>
          </div>
        </ControlBar>

        <div className="border-b border-border bg-background px-4 sm:px-6 py-2.5 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 mr-2">
            {sortingList.map((a) => (
              <button
                key={a.id}
                onClick={() => v.setAlgo(a.id)}
                className={[
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                  v.algo === a.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent",
                ].join(" ")}
              >
                {a.name}
              </button>
            ))}
          </div>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-1">
            <button
              onClick={() => v.setPreset("random")}
              className={presetCls(v.preset === "random")}
            >
              <Shuffle className="size-3.5" /> Random
            </button>
            <button
              onClick={() => v.setPreset("reversed")}
              className={presetCls(v.preset === "reversed")}
            >
              <ArrowDownUp className="size-3.5" /> Reversed
            </button>
            <button
              onClick={() => v.setPreset("nearlySorted")}
              className={presetCls(v.preset === "nearlySorted")}
            >
              <ListChecks className="size-3.5" /> Nearly Sorted
            </button>
            <button
              onClick={() => v.regenerate()}
              className="ml-1 px-3 py-1.5 rounded-md text-xs font-medium border border-border bg-background hover:bg-accent transition"
            >
              New Array
            </button>
          </div>
          <div className="ml-auto">
            <CodeViewer algoName={v.meta.name} code={sortingCode[v.algo]} />
          </div>
        </div>

        <div className="flex-1 flex min-h-0 flex-col lg:flex-row">
          <SortingCanvas values={v.values} states={v.states} />
          <InfoPanel
            name={v.meta.name}
            description={v.meta.description}
            rows={[
              { label: "Best", value: v.meta.timeBest },
              { label: "Average", value: v.meta.timeAvg },
              { label: "Worst", value: v.meta.timeWorst },
              { label: "Space", value: v.meta.space },
            ]}
            legend={[
              { label: "Unsorted", className: "bg-viz-default" },
              { label: "Comparing", className: "bg-viz-compare" },
              { label: "Swapping", className: "bg-viz-swap" },
              { label: "Sorted", className: "bg-viz-sorted" },
            ]}
          />
        </div>
      </div>
    </VisualizerShell>
  );
}

function presetCls(active: boolean) {
  return [
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
    active
      ? "bg-accent text-accent-foreground"
      : "bg-transparent text-muted-foreground hover:bg-accent/60 hover:text-foreground",
  ].join(" ");
}
