import { Play, Pause, SkipForward, RotateCcw } from "lucide-react";
import type { PlayerStatus } from "@/hooks/useAnimationPlayer";

interface ControlBarProps {
  status: PlayerStatus;
  cursor: number;
  total: number;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (v: number) => void;
  children?: React.ReactNode;
}

export function ControlBar({
  status,
  cursor,
  total,
  speed,
  onPlay,
  onPause,
  onStep,
  onReset,
  onSpeedChange,
  children,
}: ControlBarProps) {
  const playing = status === "playing";
  const done = status === "done";

  return (
    <div className="border-b border-border bg-card/40 backdrop-blur px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1.5">
        {!playing ? (
          <button
            onClick={onPlay}
            disabled={done || total === 0}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <Play className="size-3.5 fill-current" />
            Play
          </button>
        ) : (
          <button
            onClick={onPause}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent transition"
          >
            <Pause className="size-3.5 fill-current" />
            Pause
          </button>
        )}
        <button
          onClick={onStep}
          disabled={playing || done}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background text-sm hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition"
          aria-label="Step forward"
          title="Step forward"
        >
          <SkipForward className="size-3.5" />
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background text-sm hover:bg-accent transition"
          aria-label="Reset"
          title="Reset"
        >
          <RotateCcw className="size-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-2 min-w-[180px]">
        <label className="text-[11px] uppercase tracking-widest text-muted-foreground font-mono">
          Speed
        </label>
        <input
          type="range"
          min={0.5}
          max={4}
          step={0.25}
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="flex-1 accent-primary"
        />
        <span className="text-xs font-mono tabular-nums w-9 text-right text-foreground">
          {speed.toFixed(2)}x
        </span>
      </div>

      {children}

      <div className="ml-auto text-[11px] font-mono text-muted-foreground tabular-nums">
        step {cursor.toString().padStart(4, "0")} / {total}
      </div>
    </div>
  );
}
