import { createFileRoute } from "@tanstack/react-router";
import { VisualizerShell } from "@/components/layout/VisualizerShell";
import { ControlBar } from "@/components/layout/ControlBar";
import { InfoPanel } from "@/components/layout/InfoPanel";
import { GridCanvas } from "@/components/pathfinding/GridCanvas";
import { usePathfindingVisualizer } from "@/hooks/usePathfindingVisualizer";
import { pathList } from "@/lib/pathfinding";
import { Eraser, Trash2, Sparkles } from "lucide-react";
import { CodeViewer } from "@/components/CodeViewer";
import { pathfindingCode } from "@/lib/algoCode";

export const Route = createFileRoute("/pathfinding")({
  head: () => ({
    meta: [
      { title: "Pathfinding Visualizer — Algo Visualizer Hub" },
      {
        name: "description",
        content:
          "Visualize Dijkstra, Floyd–Warshall, and BFS on an interactive grid. Draw walls, drag start/target, and generate mazes.",
      },
      { property: "og:title", content: "Pathfinding Visualizer — Algo Visualizer Hub" },
      {
        property: "og:description",
        content: "Interactive grid pathfinding with Dijkstra, Floyd–Warshall, and BFS.",
      },
    ],
  }),
  component: PathfindingPage,
});

function PathfindingPage() {
  const v = usePathfindingVisualizer();
  const { player } = v;
  const running = player.status === "playing";

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
          onReset={v.clearPath}
          onSpeedChange={player.setSpeed}
        />

        <div className="border-b border-border bg-background px-4 sm:px-6 py-2.5 flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 mr-2">
            {pathList.map((a) => (
              <button
                key={a.id}
                onClick={() => v.setAlgo(a.id)}
                disabled={running}
                className={[
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-colors disabled:opacity-50",
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
            <button onClick={v.clearPath} disabled={running} className={toolCls}>
              <Eraser className="size-3.5" /> Clear Path
            </button>
            <button onClick={v.clearGrid} disabled={running} className={toolCls}>
              <Trash2 className="size-3.5" /> Clear Grid
            </button>
            <button onClick={v.generateRandomMaze} disabled={running} className={toolCls}>
              <Sparkles className="size-3.5" /> Random Maze
            </button>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-[11px] font-mono text-muted-foreground hidden sm:block">
              Click + drag to draw walls · drag start/target to move
            </span>
            <CodeViewer algoName={v.meta.name} code={pathfindingCode[v.algo]} />
          </div>
        </div>

        <div className="flex-1 flex min-h-0 flex-col lg:flex-row">
          <GridCanvas
            rows={v.rows}
            cols={v.cols}
            cells={v.cells}
            start={v.start}
            target={v.target}
            disabled={running}
            toggleWall={v.toggleWall}
            moveStart={v.moveStart}
            moveTarget={v.moveTarget}
          />
          <InfoPanel
            name={v.meta.name}
            description={v.meta.description}
            rows={[
              { label: "Time", value: v.meta.timeComplexity },
              { label: "Space", value: v.meta.space },
              { label: "Weighted", value: v.meta.weighted ? "Yes" : "No" },
              {
                label: "Shortest",
                value: v.meta.guaranteesShortest ? "Guaranteed" : "No",
              },
            ]}
            legend={[
              { label: "Start", className: "bg-viz-start" },
              { label: "Target", className: "bg-viz-target" },
              { label: "Wall", className: "bg-viz-wall" },
              { label: "Frontier", className: "bg-viz-frontier" },
              { label: "Visited", className: "bg-viz-visited" },
              { label: "Shortest Path", className: "bg-viz-path" },
            ]}
          />
        </div>
      </div>
    </VisualizerShell>
  );
}

const toolCls =
  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border bg-background hover:bg-accent transition disabled:opacity-50 disabled:cursor-not-allowed";
