import { jsx, jsxs } from "react/jsx-runtime";
import { u as useAnimationPlayer, V as VisualizerShell, C as ControlBar, a as CodeViewer, s as sortingCode, I as InfoPanel } from "./algoCode-BwrbSPYw.js";
import { memo, useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Shuffle, ArrowDownUp, ListChecks } from "lucide-react";
import "@tanstack/react-router";
import "@radix-ui/react-dialog";
import "clsx";
import "tailwind-merge";
const stateClass = {
  default: "bg-viz-default",
  compare: "bg-viz-compare",
  swap: "bg-viz-swap",
  sorted: "bg-viz-sorted"
};
function BarImpl({ value, max, state }) {
  const heightPct = value / Math.max(max, 1) * 100;
  return /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-[2px] flex items-end h-full", children: /* @__PURE__ */ jsx(
    "div",
    {
      className: `relative w-full rounded-t-sm transition-[height,background-color] duration-150 ${stateClass[state]}`,
      style: { height: `${heightPct}%` },
      children: /* @__PURE__ */ jsx("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 mt-1 pointer-events-none", children: /* @__PURE__ */ jsx("span", { className: "text-[10px] font-mono font-semibold text-foreground", children: value }) })
    }
  ) });
}
const Bar = memo(BarImpl);
function SortingCanvas({ values, states }) {
  const max = Math.max(...values, 1);
  return /* @__PURE__ */ jsx("div", { className: "flex-1 min-h-0 p-6", children: /* @__PURE__ */ jsx("div", { className: "h-full w-full rounded-lg border border-border bg-card/30 p-4 min-h-[220px]", children: /* @__PURE__ */ jsx("div", { className: "flex h-full w-full items-end gap-[2px]", children: values.map((v, i) => /* @__PURE__ */ jsx(Bar, { value: v, max, state: states[i] ?? "default" }, i)) }) }) });
}
const bubbleSort = (input) => {
  const a = [...input];
  const steps = [];
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
const quickSort = (input) => {
  const a = [...input];
  const steps = [];
  const partition = (lo, hi) => {
    const pivot = a[hi];
    let i = lo;
    for (let j = lo; j < hi; j++) {
      steps.push({ type: "compare", i: j, j: hi });
      if (a[j] < pivot) {
        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          steps.push({ type: "swap", i, j });
        }
        i++;
      }
    }
    if (i !== hi) {
      [a[i], a[hi]] = [a[hi], a[i]];
      steps.push({ type: "swap", i, j: hi });
    }
    return i;
  };
  const qs = (lo, hi) => {
    if (lo >= hi) {
      if (lo === hi) steps.push({ type: "markSorted", i: lo });
      return;
    }
    const p = partition(lo, hi);
    steps.push({ type: "markSorted", i: p });
    qs(lo, p - 1);
    qs(p + 1, hi);
  };
  qs(0, a.length - 1);
  for (let i = 0; i < a.length; i++) steps.push({ type: "markSorted", i });
  return steps;
};
const mergeSort = (input) => {
  const a = [...input];
  const aux = [...input];
  const steps = [];
  const merge = (lo, mid, hi) => {
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
  const ms = (lo, hi) => {
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
const sortingAlgos = {
  bubble: {
    id: "bubble",
    name: "Bubble Sort",
    description: "Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Simple but slow on large inputs.",
    timeBest: "O(n)",
    timeAvg: "O(n²)",
    timeWorst: "O(n²)",
    space: "O(1)",
    run: bubbleSort
  },
  quick: {
    id: "quick",
    name: "Quick Sort",
    description: "Divide-and-conquer sort that picks a pivot, partitions the array around it, then recursively sorts the partitions. Fast in practice with O(n log n) average.",
    timeBest: "O(n log n)",
    timeAvg: "O(n log n)",
    timeWorst: "O(n²)",
    space: "O(log n)",
    run: quickSort
  },
  merge: {
    id: "merge",
    name: "Merge Sort",
    description: "Splits the array in half, recursively sorts each half, then merges them using an auxiliary array. Stable and guaranteed O(n log n).",
    timeBest: "O(n log n)",
    timeAvg: "O(n log n)",
    timeWorst: "O(n log n)",
    space: "O(n)",
    run: mergeSort
  }
};
const sortingList = Object.values(sortingAlgos);
const generate = (size, preset) => {
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
function useSortingVisualizer() {
  const [algo, setAlgo] = useState("bubble");
  const [size, setSize] = useState(40);
  const [preset, setPreset] = useState("random");
  const initial = useMemo(() => Array.from({ length: 40 }, (_, i) => i + 1), []);
  const [baseArray, setBaseArray] = useState(initial);
  const [values, setValues] = useState(initial);
  const [states, setStates] = useState(() => Array(40).fill("default"));
  const [activeIdx, setActiveIdx] = useState({});
  const valuesRef = useRef(values);
  const statesRef = useRef(states);
  valuesRef.current = values;
  statesRef.current = states;
  const steps = useMemo(() => sortingAlgos[algo].run(baseArray), [algo, baseArray]);
  useEffect(() => {
    const arr = generate(40, "random");
    setBaseArray(arr);
    setValues(arr);
    const fresh = Array(arr.length).fill("default");
    statesRef.current = fresh;
    setStates(fresh);
  }, []);
  const applyStep = useCallback((step) => {
    if (step.type === "compare") {
      const next = [...statesRef.current];
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
  const player = useAnimationPlayer({
    steps,
    onStep: applyStep,
    baseMs: 120
  });
  const regenerate = useCallback(
    (newSize = size, newPreset = preset) => {
      player.reset();
      const arr = generate(newSize, newPreset);
      setBaseArray(arr);
      setValues(arr);
      const fresh = Array(arr.length).fill("default");
      statesRef.current = fresh;
      setStates(fresh);
      setActiveIdx({});
    },
    [size, preset, player]
  );
  const handleSetSize = useCallback(
    (n) => {
      setSize(n);
      regenerate(n, preset);
    },
    [preset, regenerate]
  );
  const handleSetPreset = useCallback(
    (p) => {
      setPreset(p);
      regenerate(size, p);
    },
    [size, regenerate]
  );
  const handleSetAlgo = useCallback(
    (a) => {
      setAlgo(a);
      player.reset();
      setValues(baseArray);
      const fresh = Array(baseArray.length).fill("default");
      statesRef.current = fresh;
      setStates(fresh);
    },
    [baseArray, player]
  );
  const handleReset = useCallback(() => {
    player.reset();
    setValues(baseArray);
    const fresh = Array(baseArray.length).fill("default");
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
    meta: sortingAlgos[algo]
  };
}
function SortingPage() {
  const v = useSortingVisualizer();
  const {
    player
  } = v;
  return /* @__PURE__ */ jsx(VisualizerShell, { children: /* @__PURE__ */ jsxs("div", { className: "flex-1 flex flex-col min-h-0", children: [
    /* @__PURE__ */ jsx(ControlBar, { status: player.status, cursor: player.cursor, total: player.total, speed: player.speed, onPlay: player.play, onPause: player.pause, onStep: player.stepForward, onReset: v.reset, onSpeedChange: player.setSpeed, children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("label", { className: "text-[11px] uppercase tracking-widest text-muted-foreground font-mono", children: "Size" }),
      /* @__PURE__ */ jsx("input", { type: "range", min: 10, max: 120, step: 1, value: v.size, onChange: (e) => v.setSize(Number(e.target.value)), className: "w-32 accent-primary" }),
      /* @__PURE__ */ jsx("span", { className: "text-xs font-mono tabular-nums w-8 text-right", children: v.size })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "border-b border-border bg-background px-4 sm:px-6 py-2.5 flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "flex items-center gap-1 mr-2", children: sortingList.map((a) => /* @__PURE__ */ jsx("button", { onClick: () => v.setAlgo(a.id), className: ["px-3 py-1.5 rounded-md text-xs font-medium transition-colors", v.algo === a.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"].join(" "), children: a.name }, a.id)) }),
      /* @__PURE__ */ jsx("div", { className: "h-5 w-px bg-border" }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxs("button", { onClick: () => v.setPreset("random"), className: presetCls(v.preset === "random"), children: [
          /* @__PURE__ */ jsx(Shuffle, { className: "size-3.5" }),
          " Random"
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => v.setPreset("reversed"), className: presetCls(v.preset === "reversed"), children: [
          /* @__PURE__ */ jsx(ArrowDownUp, { className: "size-3.5" }),
          " Reversed"
        ] }),
        /* @__PURE__ */ jsxs("button", { onClick: () => v.setPreset("nearlySorted"), className: presetCls(v.preset === "nearlySorted"), children: [
          /* @__PURE__ */ jsx(ListChecks, { className: "size-3.5" }),
          " Nearly Sorted"
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => v.regenerate(), className: "ml-1 px-3 py-1.5 rounded-md text-xs font-medium border border-border bg-background hover:bg-accent transition", children: "New Array" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "ml-auto", children: /* @__PURE__ */ jsx(CodeViewer, { algoName: v.meta.name, code: sortingCode[v.algo] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 flex min-h-0 flex-col lg:flex-row", children: [
      /* @__PURE__ */ jsx(SortingCanvas, { values: v.values, states: v.states }),
      /* @__PURE__ */ jsx(InfoPanel, { name: v.meta.name, description: v.meta.description, rows: [{
        label: "Best",
        value: v.meta.timeBest
      }, {
        label: "Average",
        value: v.meta.timeAvg
      }, {
        label: "Worst",
        value: v.meta.timeWorst
      }, {
        label: "Space",
        value: v.meta.space
      }], legend: [{
        label: "Unsorted",
        className: "bg-viz-default"
      }, {
        label: "Comparing",
        className: "bg-viz-compare"
      }, {
        label: "Swapping",
        className: "bg-viz-swap"
      }, {
        label: "Sorted",
        className: "bg-viz-sorted"
      }] })
    ] })
  ] }) });
}
function presetCls(active) {
  return ["inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors", active ? "bg-accent text-accent-foreground" : "bg-transparent text-muted-foreground hover:bg-accent/60 hover:text-foreground"].join(" ");
}
export {
  SortingPage as component
};
