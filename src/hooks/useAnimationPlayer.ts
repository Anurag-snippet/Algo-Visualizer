import { useCallback, useEffect, useRef, useState } from "react";

export type PlayerStatus = "idle" | "playing" | "paused" | "done";

interface UseAnimationPlayerOpts<TStep> {
  steps: TStep[];
  onStep: (step: TStep, index: number) => void;
  onDone?: () => void;
  baseMs?: number; // ms per step at 1x
}

export function useAnimationPlayer<TStep>({
  steps,
  onStep,
  onDone,
  baseMs = 40,
}: UseAnimationPlayerOpts<TStep>) {
  const [status, setStatus] = useState<PlayerStatus>("idle");
  const [speed, setSpeed] = useState(1);
  const [cursor, setCursor] = useState(0);

  const cursorRef = useRef(0);
  const speedRef = useRef(speed);
  const statusRef = useRef<PlayerStatus>("idle");
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const accRef = useRef<number>(0);
  const stepsRef = useRef(steps);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);
  useEffect(() => {
    stepsRef.current = steps;
  }, [steps]);

  const cancelLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const tick = useCallback(
    (t: number) => {
      if (statusRef.current !== "playing") {
        rafRef.current = null;
        return;
      }
      const last = lastTickRef.current || t;
      const dt = t - last;
      lastTickRef.current = t;
      accRef.current += dt;
      const interval = Math.max(1, baseMs / speedRef.current);
      while (accRef.current >= interval) {
        accRef.current -= interval;
        const idx = cursorRef.current;
        if (idx >= stepsRef.current.length) {
          statusRef.current = "done";
          setStatus("done");
          onDone?.();
          rafRef.current = null;
          return;
        }
        onStep(stepsRef.current[idx], idx);
        cursorRef.current = idx + 1;
        setCursor(cursorRef.current);
      }
      rafRef.current = requestAnimationFrame(tick);
    },
    [baseMs, onDone, onStep]
  );

  const play = useCallback(() => {
    if (statusRef.current === "playing") return;
    if (cursorRef.current >= stepsRef.current.length) return;
    statusRef.current = "playing";
    setStatus("playing");
    lastTickRef.current = 0;
    accRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const pause = useCallback(() => {
    statusRef.current = "paused";
    setStatus("paused");
    cancelLoop();
  }, [cancelLoop]);

  const stepForward = useCallback(() => {
    if (statusRef.current === "playing") return;
    const idx = cursorRef.current;
    if (idx >= stepsRef.current.length) return;
    onStep(stepsRef.current[idx], idx);
    cursorRef.current = idx + 1;
    setCursor(cursorRef.current);
    if (cursorRef.current >= stepsRef.current.length) {
      statusRef.current = "done";
      setStatus("done");
      onDone?.();
    } else {
      statusRef.current = "paused";
      setStatus("paused");
    }
  }, [onDone, onStep]);

  const reset = useCallback(() => {
    cancelLoop();
    cursorRef.current = 0;
    setCursor(0);
    statusRef.current = "idle";
    setStatus("idle");
  }, [cancelLoop]);

  useEffect(() => {
    // when steps change, reset
    cancelLoop();
    cursorRef.current = 0;
    setCursor(0);
    statusRef.current = "idle";
    setStatus("idle");
  }, [steps, cancelLoop]);

  useEffect(() => () => cancelLoop(), [cancelLoop]);

  return {
    status,
    cursor,
    total: steps.length,
    speed,
    setSpeed,
    play,
    pause,
    stepForward,
    reset,
  };
}
