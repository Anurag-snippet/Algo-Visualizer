import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { sortingAlgos, type SortAlgoId, type SortStep } from "@/lib/sorting";
import { useAnimationPlayer } from "./useAnimationPlayer";

export type BarState = "default" | "compare" | "swap" | "sorted";

export type Preset = "random" | "reversed" | "nearlySorted";

const generate = (size: number, preset: Preset): number[] => {
  if (preset === "reversed") {
    const arr = Array.from({ length: size }, (_, i) => size - i);
    return arr;
  }
  if (preset === "nearlySorted") {
    const arr = Array.from({ length: size }, (_, i) => i + 1);
    const swaps = Math.max(1, Math.floor(size * 0.08));
    for (let s = 0; s < swaps; s++) {
      const i = Math.floor(Math.random() * size);
      const j = Math.floor(Math.random() * size);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
  return Array.from({ length: size }, () => Math.floor(Math.random() * 99) + 2);
};

export function useSortingVisualizer() {
  const [algo, setAlgo] = useState<SortAlgoId>("bubble");
  const [size, setSize] = useState(40);
  const [preset, setPreset] = useState<Preset>("random");
  // Start with a deterministic ascending array so SSR == initial client render.
  // Randomize on mount (client-only) to avoid hydration mismatches.
  const initial = useMemo(() => Array.from({ length: 40 }, (_, i) => i + 1), []);
  const [baseArray, setBaseArray] = useState<number[]>(initial);
  const [values, setValues] = useState<number[]>(initial);
  const [states, setStates] = useState<BarState[]>(() => Array(40).fill("default"));
  const [activeIdx, setActiveIdx] = useState<{ i?: number; j?: number }>({});

  const valuesRef = useRef<number[]>(values);
  const statesRef = useRef<BarState[]>(states);
  valuesRef.current = values;
  statesRef.current = states;

  const steps = useMemo(() => sortingAlgos[algo].run(baseArray), [algo, baseArray]);

  // Randomize on client mount (after hydration)
  useEffect(() => {
    const arr = generate(40, "random");
    setBaseArray(arr);
    setValues(arr);
    const fresh: BarState[] = Array(arr.length).fill("default");
    statesRef.current = fresh;
    setStates(fresh);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyStep = useCallback((step: SortStep) => {
    if (step.type === "compare") {
      const next = [...statesRef.current];
      // reset transient comparisons -> default unless sorted
      for (let k = 0; k < next.length; k++) if (next[k] === "compare" || next[k] === "swap") next[k] = next[k] === "swap" ? "default" : "default";
      next[step.i] = "compare";
      next[step.j] = "compare";
      statesRef.current = next;
      setStates(next);
      setActiveIdx({ i: step.i, j: step.j });
    } else if (step.type === "swap") {
      const arr = [...valuesRef.current];
      [arr[step.i], arr[step.j]] = [arr[step.j], arr[step.i]];
      valuesRef.current = arr;
      setValues(arr);
      const next = [...statesRef.current];
      next[step.i] = "swap";
      next[step.j] = "swap";
      statesRef.current = next;
      setStates(next);
    } else if (step.type === "overwrite") {
      const arr = [...valuesRef.current];
      arr[step.i] = step.value;
      valuesRef.current = arr;
      setValues(arr);
      const next = [...statesRef.current];
      next[step.i] = "swap";
      statesRef.current = next;
      setStates(next);
    } else if (step.type === "markSorted") {
      const next = [...statesRef.current];
      next[step.i] = "sorted";
      statesRef.current = next;
      setStates(next);
    }
  }, []);

  const player = useAnimationPlayer<SortStep>({
    steps,
    onStep: applyStep,
    baseMs: 120,
  });

  const regenerate = useCallback(
    (newSize = size, newPreset: Preset = preset) => {
      player.reset();
      const arr = generate(newSize, newPreset);
      setBaseArray(arr);
      setValues(arr);
      const fresh: BarState[] = Array(arr.length).fill("default");
      statesRef.current = fresh;
      setStates(fresh);
      setActiveIdx({});
    },
    [size, preset, player]
  );

  const handleSetSize = useCallback(
    (n: number) => {
      setSize(n);
      regenerate(n, preset);
    },
    [preset, regenerate]
  );

  const handleSetPreset = useCallback(
    (p: Preset) => {
      setPreset(p);
      regenerate(size, p);
    },
    [size, regenerate]
  );

  const handleSetAlgo = useCallback(
    (a: SortAlgoId) => {
      setAlgo(a);
      // reset visualization to base array; new steps will be recomputed
      player.reset();
      setValues(baseArray);
      const fresh: BarState[] = Array(baseArray.length).fill("default");
      statesRef.current = fresh;
      setStates(fresh);
    },
    [baseArray, player]
  );

  const handleReset = useCallback(() => {
    player.reset();
    setValues(baseArray);
    const fresh: BarState[] = Array(baseArray.length).fill("default");
    statesRef.current = fresh;
    setStates(fresh);
    setActiveIdx({});
  }, [baseArray, player]);

  return {
    algo,
    setAlgo: handleSetAlgo,
    size,
    setSize: handleSetSize,
    preset,
    setPreset: handleSetPreset,
    values,
    states,
    activeIdx,
    regenerate: () => regenerate(size, preset),
    reset: handleReset,
    player,
    meta: sortingAlgos[algo],
  };
}
