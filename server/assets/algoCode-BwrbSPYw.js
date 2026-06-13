import { jsx, jsxs } from "react/jsx-runtime";
import { useRouterState, Link } from "@tanstack/react-router";
import { Sun, Moon, BarChart3, Network, Github, Play, Pause, SkipForward, RotateCcw, X, Code2, Check, Copy } from "lucide-react";
import * as React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
const STORAGE_KEY = "viz-theme";
const getInitial = () => {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
};
function useTheme() {
  const [theme, setTheme] = useState(() => getInitial());
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);
  const toggle = useCallback(() => setTheme((t) => t === "dark" ? "light" : "dark"), []);
  return { theme, setTheme, toggle };
}
function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick: toggle,
      "aria-label": theme === "dark" ? "Switch to light mode" : "Switch to dark mode",
      className: "inline-flex items-center justify-center size-8 rounded-md border border-border bg-background hover:bg-accent text-foreground transition-colors",
      children: theme === "dark" ? /* @__PURE__ */ jsx(Sun, { className: "size-4" }) : /* @__PURE__ */ jsx(Moon, { className: "size-4" })
    }
  );
}
function VisualizerShell({ children }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navItems = [
    { to: "/sorting", label: "Sorting", icon: BarChart3 },
    { to: "/pathfinding", label: "Pathfinding", icon: Network }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "flex min-h-screen w-full bg-background text-foreground", children: [
    /* @__PURE__ */ jsxs("aside", { className: "hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-sidebar", children: [
      /* @__PURE__ */ jsx("div", { className: "px-5 py-5 border-b border-sidebar-border", children: /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2 group", children: [
        /* @__PURE__ */ jsx("div", { className: "size-8 rounded-md bg-gradient-to-br from-primary to-primary/60 grid place-items-center text-primary-foreground font-bold font-mono", children: "A" }),
        /* @__PURE__ */ jsxs("div", { className: "leading-tight", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm font-semibold tracking-tight", children: "Algo Visualizer" }),
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground font-mono", children: "Hub" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxs("nav", { className: "flex-1 px-3 py-4 space-y-1", children: [
        /* @__PURE__ */ jsx("div", { className: "px-2 pb-2 text-[10px] uppercase tracking-widest text-muted-foreground font-mono", children: "Modules" }),
        navItems.map(({ to, label, icon: Icon }) => {
          const active = pathname.startsWith(to);
          return /* @__PURE__ */ jsxs(
            Link,
            {
              to,
              className: [
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
              ].join(" "),
              children: [
                /* @__PURE__ */ jsx(Icon, { className: "size-4" }),
                label
              ]
            },
            to
          );
        })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "p-3 border-t border-sidebar-border flex items-center justify-between", children: [
        /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground font-mono", children: "v1.0" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: "https://github.com",
              target: "_blank",
              rel: "noreferrer",
              className: "text-muted-foreground hover:text-foreground transition-colors",
              "aria-label": "GitHub",
              children: /* @__PURE__ */ jsx(Github, { className: "size-4" })
            }
          ),
          /* @__PURE__ */ jsx(ThemeToggle, {})
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 flex flex-col", children: [
      /* @__PURE__ */ jsxs("header", { className: "md:hidden border-b border-border bg-sidebar px-4 py-3 flex items-center justify-between sticky top-0 z-30", children: [
        /* @__PURE__ */ jsxs(Link, { to: "/", className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx("div", { className: "size-7 rounded-md bg-gradient-to-br from-primary to-primary/60 grid place-items-center text-primary-foreground font-bold font-mono text-sm", children: "A" }),
          /* @__PURE__ */ jsx("span", { className: "text-sm font-semibold", children: "Algo Visualizer" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          navItems.map(({ to, label, icon: Icon }) => {
            const active = pathname.startsWith(to);
            return /* @__PURE__ */ jsx(
              Link,
              {
                to,
                className: [
                  "p-2 rounded-md transition-colors",
                  active ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50"
                ].join(" "),
                "aria-label": label,
                children: /* @__PURE__ */ jsx(Icon, { className: "size-4" })
              },
              to
            );
          }),
          /* @__PURE__ */ jsx(ThemeToggle, {})
        ] })
      ] }),
      children
    ] })
  ] });
}
function ControlBar({
  status,
  cursor,
  total,
  speed,
  onPlay,
  onPause,
  onStep,
  onReset,
  onSpeedChange,
  children
}) {
  const playing = status === "playing";
  const done = status === "done";
  return /* @__PURE__ */ jsxs("div", { className: "border-b border-border bg-card/40 backdrop-blur px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1.5", children: [
      !playing ? /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onPlay,
          disabled: done || total === 0,
          className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition",
          children: [
            /* @__PURE__ */ jsx(Play, { className: "size-3.5 fill-current" }),
            "Play"
          ]
        }
      ) : /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: onPause,
          className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-secondary text-secondary-foreground text-sm font-medium hover:bg-accent transition",
          children: [
            /* @__PURE__ */ jsx(Pause, { className: "size-3.5 fill-current" }),
            "Pause"
          ]
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onStep,
          disabled: playing || done,
          className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background text-sm hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition",
          "aria-label": "Step forward",
          title: "Step forward",
          children: /* @__PURE__ */ jsx(SkipForward, { className: "size-3.5" })
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: onReset,
          className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-background text-sm hover:bg-accent transition",
          "aria-label": "Reset",
          title: "Reset",
          children: /* @__PURE__ */ jsx(RotateCcw, { className: "size-3.5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-[180px]", children: [
      /* @__PURE__ */ jsx("label", { className: "text-[11px] uppercase tracking-widest text-muted-foreground font-mono", children: "Speed" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "range",
          min: 0.5,
          max: 4,
          step: 0.25,
          value: speed,
          onChange: (e) => onSpeedChange(Number(e.target.value)),
          className: "flex-1 accent-primary"
        }
      ),
      /* @__PURE__ */ jsxs("span", { className: "text-xs font-mono tabular-nums w-9 text-right text-foreground", children: [
        speed.toFixed(2),
        "x"
      ] })
    ] }),
    children,
    /* @__PURE__ */ jsxs("div", { className: "ml-auto text-[11px] font-mono text-muted-foreground tabular-nums", children: [
      "step ",
      cursor.toString().padStart(4, "0"),
      " / ",
      total
    ] })
  ] });
}
function InfoPanel({ name, description, rows, legend }) {
  return /* @__PURE__ */ jsxs("aside", { className: "w-full lg:w-72 shrink-0 border-l border-border bg-card/30 p-5 space-y-5 overflow-y-auto", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1", children: "Algorithm" }),
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold tracking-tight", children: name }),
      /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground leading-relaxed", children: description })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-2", children: "Complexity" }),
      /* @__PURE__ */ jsx("dl", { className: "space-y-1.5", children: rows.map((r) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between text-sm", children: [
        /* @__PURE__ */ jsx("dt", { className: "text-muted-foreground", children: r.label }),
        /* @__PURE__ */ jsx("dd", { className: "font-mono text-foreground", children: r.value })
      ] }, r.label)) })
    ] }),
    legend && legend.length > 0 && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-2", children: "Legend" }),
      /* @__PURE__ */ jsx("ul", { className: "space-y-1.5", children: legend.map((l) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2.5 text-sm", children: [
        /* @__PURE__ */ jsx("span", { className: `inline-block size-3 rounded-sm ${l.className}` }),
        /* @__PURE__ */ jsx("span", { className: "text-muted-foreground", children: l.label })
      ] }, l.label)) })
    ] })
  ] });
}
function useAnimationPlayer({
  steps,
  onStep,
  onDone,
  baseMs = 40
}) {
  const [status, setStatus] = useState("idle");
  const [speed, setSpeed] = useState(1);
  const [cursor, setCursor] = useState(0);
  const cursorRef = useRef(0);
  const speedRef = useRef(speed);
  const statusRef = useRef("idle");
  const rafRef = useRef(null);
  const lastTickRef = useRef(0);
  const accRef = useRef(0);
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
    (t) => {
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
    reset
  };
}
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Overlay,
  {
    ref,
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props
  }
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;
const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(DialogPortal, { children: [
  /* @__PURE__ */ jsx(DialogOverlay, {}),
  /* @__PURE__ */ jsxs(
    DialogPrimitive.Content,
    {
      ref,
      className: cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground", children: [
          /* @__PURE__ */ jsx(X, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
        ] })
      ]
    }
  )
] }));
DialogContent.displayName = DialogPrimitive.Content.displayName;
const DialogHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", { className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className), ...props });
DialogHeader.displayName = "DialogHeader";
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Title,
  {
    ref,
    className: cn("text-lg font-semibold leading-none tracking-tight", className),
    ...props
  }
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  DialogPrimitive.Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;
function CodeViewer({ algoName, code }) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState("cpp");
  const [copied, setCopied] = useState(false);
  const source = code?.[lang] ?? "// Code not available";
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
    }
  };
  return /* @__PURE__ */ jsxs(Dialog, { open, onOpenChange: setOpen, children: [
    /* @__PURE__ */ jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
      "button",
      {
        className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border bg-background hover:bg-accent transition",
        title: "View source code",
        children: [
          /* @__PURE__ */ jsx(Code2, { className: "size-3.5" }),
          " View Code"
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs(DialogContent, { className: "max-w-3xl p-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxs(DialogHeader, { className: "px-5 pt-5 pb-3 border-b border-border", children: [
        /* @__PURE__ */ jsxs(DialogTitle, { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(Code2, { className: "size-4 text-primary" }),
          algoName,
          " — Source Code"
        ] }),
        /* @__PURE__ */ jsx(DialogDescription, { className: "text-xs", children: "Reference implementation. Pseudocode/standard textbook form." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between px-5 py-2.5 bg-card/40 border-b border-border", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setLang("cpp"),
              className: [
                "px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors",
                lang === "cpp" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
              ].join(" "),
              children: "C++"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setLang("python"),
              className: [
                "px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors",
                lang === "python" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
              ].join(" "),
              children: "Python"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: handleCopy,
            className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border border-border hover:bg-accent transition",
            children: [
              copied ? /* @__PURE__ */ jsx(Check, { className: "size-3.5 text-viz-sorted" }) : /* @__PURE__ */ jsx(Copy, { className: "size-3.5" }),
              copied ? "Copied" : "Copy"
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx("pre", { className: "m-0 p-5 max-h-[60vh] overflow-auto bg-background text-xs leading-relaxed font-mono text-foreground", children: /* @__PURE__ */ jsx("code", { children: source }) })
    ] })
  ] });
}
const sortingCode = {
  bubble: {
    cpp: `#include <vector>
using namespace std;

void bubbleSort(vector<int>& arr) {
    int n = arr.size();
    for (int i = 0; i < n - 1; i++) {
        bool swapped = false;
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                swap(arr[j], arr[j + 1]);
                swapped = true;
            }
        }
        if (!swapped) break; // already sorted
    }
}`,
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        swapped = False
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                swapped = True
        if not swapped:
            break  # already sorted
    return arr`
  },
  quick: {
    cpp: `#include <vector>
using namespace std;

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int p = partition(arr, low, high);
        quickSort(arr, low, p - 1);
        quickSort(arr, p + 1, high);
    }
}`,
    python: `def quick_sort(arr, low=0, high=None):
    if high is None:
        high = len(arr) - 1
    if low < high:
        p = partition(arr, low, high)
        quick_sort(arr, low, p - 1)
        quick_sort(arr, p + 1, high)
    return arr

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i + 1], arr[high] = arr[high], arr[i + 1]
    return i + 1`
  },
  merge: {
    cpp: `#include <vector>
using namespace std;

void merge(vector<int>& arr, int l, int m, int r) {
    vector<int> left(arr.begin() + l, arr.begin() + m + 1);
    vector<int> right(arr.begin() + m + 1, arr.begin() + r + 1);
    int i = 0, j = 0, k = l;
    while (i < (int)left.size() && j < (int)right.size()) {
        if (left[i] <= right[j]) arr[k++] = left[i++];
        else                      arr[k++] = right[j++];
    }
    while (i < (int)left.size())  arr[k++] = left[i++];
    while (j < (int)right.size()) arr[k++] = right[j++];
}

void mergeSort(vector<int>& arr, int l, int r) {
    if (l < r) {
        int m = l + (r - l) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
    python: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i]); i += 1
        else:
            result.append(right[j]); j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`
  }
};
const pathfindingCode = {
  dijkstra: {
    cpp: `#include <vector>
#include <queue>
#include <climits>
using namespace std;

struct Node { int row, col, dist; };
struct Cmp { bool operator()(const Node& a, const Node& b){ return a.dist > b.dist; } };

vector<pair<int,int>> dijkstra(vector<vector<int>>& grid,
                               pair<int,int> start, pair<int,int> target) {
    int R = grid.size(), C = grid[0].size();
    vector<vector<int>> dist(R, vector<int>(C, INT_MAX));
    vector<vector<pair<int,int>>> prev(R, vector<pair<int,int>>(C, {-1,-1}));
    priority_queue<Node, vector<Node>, Cmp> pq;

    dist[start.first][start.second] = 0;
    pq.push({start.first, start.second, 0});
    int dr[] = {-1, 1, 0, 0}, dc[] = {0, 0, -1, 1};

    while (!pq.empty()) {
        Node u = pq.top(); pq.pop();
        if (u.dist > dist[u.row][u.col]) continue;
        if (u.row == target.first && u.col == target.second) break;
        for (int k = 0; k < 4; k++) {
            int nr = u.row + dr[k], nc = u.col + dc[k];
            if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
            if (grid[nr][nc] == 1) continue; // wall
            int nd = u.dist + 1;
            if (nd < dist[nr][nc]) {
                dist[nr][nc] = nd;
                prev[nr][nc] = {u.row, u.col};
                pq.push({nr, nc, nd});
            }
        }
    }
    // reconstruct
    vector<pair<int,int>> path;
    pair<int,int> cur = target;
    while (cur.first != -1) {
        path.push_back(cur);
        cur = prev[cur.first][cur.second];
    }
    reverse(path.begin(), path.end());
    return path;
}`,
    python: `import heapq

def dijkstra(grid, start, target):
    R, C = len(grid), len(grid[0])
    dist = [[float('inf')] * C for _ in range(R)]
    prev = [[None] * C for _ in range(R)]
    dist[start[0]][start[1]] = 0
    pq = [(0, start[0], start[1])]

    while pq:
        d, r, c = heapq.heappop(pq)
        if d > dist[r][c]:
            continue
        if (r, c) == target:
            break
        for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C and grid[nr][nc] != 1:
                nd = d + 1
                if nd < dist[nr][nc]:
                    dist[nr][nc] = nd
                    prev[nr][nc] = (r, c)
                    heapq.heappush(pq, (nd, nr, nc))

    # reconstruct path
    path, cur = [], target
    while cur is not None:
        path.append(cur)
        cur = prev[cur[0]][cur[1]]
    return path[::-1]`
  },
  floydWarshall: {
    cpp: `#include <vector>
#include <climits>
using namespace std;

vector<pair<int,int>> floydWarshall(vector<vector<int>>& grid,
                                   pair<int,int> start, pair<int,int> target) {
    int R = grid.size(), C = grid[0].size();
    int N = R * C;
    const int INF = INT_MAX / 2;
    vector<vector<int>> dist(N, vector<int>(N, INF));
    vector<vector<int>> next(N, vector<int>(N, -1));

    auto idx = [&](int r, int c){ return r * C + c; };
    auto valid = [&](int r, int c){ return r >= 0 && r < R && c >= 0 && c < C; };

    for (int r = 0; r < R; r++) {
        for (int c = 0; c < C; c++) {
            int u = idx(r, c);
            if (grid[r][c] == 1) continue;
            dist[u][u] = 0;
            next[u][u] = u;
            int dr[] = {-1,1,0,0};
            int dc[] = {0,0,-1,1};
            for (int k = 0; k < 4; k++) {
                int nr = r + dr[k], nc = c + dc[k];
                if (!valid(nr, nc) || grid[nr][nc] == 1) continue;
                int v = idx(nr, nc);
                dist[u][v] = 1;
                next[u][v] = v;
            }
        }
    }

    for (int k = 0; k < N; k++) {
        for (int i = 0; i < N; i++) {
            if (dist[i][k] == INF) continue;
            for (int j = 0; j < N; j++) {
                if (dist[k][j] == INF) continue;
                int candidate = dist[i][k] + dist[k][j];
                if (candidate < dist[i][j]) {
                    dist[i][j] = candidate;
                    next[i][j] = next[i][k];
                }
            }
        }
    }

    int s = idx(start.first, start.second);
    int t = idx(target.first, target.second);
    vector<pair<int,int>> path;
    if (next[s][t] == -1) return path;

    int cur = s;
    while (cur != t) {
        int r = cur / C;
        int c = cur % C;
        path.push_back({r, c});
        cur = next[cur][t];
        if (cur == -1) return vector<pair<int,int>>();
    }
    path.push_back({t.first, t.second});
    return path;
}`,
    python: `import math

def floyd_warshall(grid, start, target):
    R, C = len(grid), len(grid[0])
    N = R * C
    INF = math.inf
    dist = [[INF] * N for _ in range(N)]
    nxt = [[-1] * N for _ in range(N)]

    def idx(r, c):
        return r * C + c

    def valid(r, c):
        return 0 <= r < R and 0 <= c < C

    for r in range(R):
        for c in range(C):
            u = idx(r, c)
            if grid[r][c] == 1:
                continue
            dist[u][u] = 0
            nxt[u][u] = u
            for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
                nr, nc = r + dr, c + dc
                if valid(nr, nc) and grid[nr][nc] != 1:
                    v = idx(nr, nc)
                    dist[u][v] = 1
                    nxt[u][v] = v

    for k in range(N):
        for i in range(N):
            if dist[i][k] == INF: continue
            for j in range(N):
                if dist[k][j] == INF: continue
                candidate = dist[i][k] + dist[k][j]
                if candidate < dist[i][j]:
                    dist[i][j] = candidate
                    nxt[i][j] = nxt[i][k]

    s, t = idx(start[0], start[1]), idx(target[0], target[1])
    if nxt[s][t] == -1:
        return []

    path = []
    cur = s
    while cur != t:
        r, c = divmod(cur, C)
        path.append((r, c))
        cur = nxt[cur][t]
        if cur == -1:
            return []
    path.append((target[0], target[1]))
    return path`
  },
  bfs: {
    cpp: `#include <vector>
#include <queue>
using namespace std;

vector<pair<int,int>> bfs(vector<vector<int>>& grid,
                          pair<int,int> start, pair<int,int> target) {
    int R = grid.size(), C = grid[0].size();
    vector<vector<bool>> visited(R, vector<bool>(C, false));
    vector<vector<pair<int,int>>> prev(R, vector<pair<int,int>>(C, {-1,-1}));
    queue<pair<int,int>> q;
    q.push(start);
    visited[start.first][start.second] = true;
    int dr[] = {-1,1,0,0}, dc[] = {0,0,-1,1};

    while (!q.empty()) {
        auto [r, c] = q.front(); q.pop();
        if (make_pair(r, c) == target) break;
        for (int k = 0; k < 4; k++) {
            int nr = r + dr[k], nc = c + dc[k];
            if (nr < 0 || nr >= R || nc < 0 || nc >= C) continue;
            if (visited[nr][nc] || grid[nr][nc] == 1) continue;
            visited[nr][nc] = true;
            prev[nr][nc] = {r, c};
            q.push({nr, nc});
        }
    }
    vector<pair<int,int>> path;
    pair<int,int> cur = target;
    while (cur.first != -1) { path.push_back(cur); cur = prev[cur.first][cur.second]; }
    reverse(path.begin(), path.end());
    return path;
}`,
    python: `from collections import deque

def bfs(grid, start, target):
    R, C = len(grid), len(grid[0])
    visited = [[False] * C for _ in range(R)]
    prev = [[None] * C for _ in range(R)]
    q = deque([start])
    visited[start[0]][start[1]] = True

    while q:
        r, c = q.popleft()
        if (r, c) == target:
            break
        for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nr, nc = r + dr, c + dc
            if 0 <= nr < R and 0 <= nc < C and not visited[nr][nc] and grid[nr][nc] != 1:
                visited[nr][nc] = True
                prev[nr][nc] = (r, c)
                q.append((nr, nc))

    path, cur = [], target
    while cur is not None:
        path.append(cur)
        cur = prev[cur[0]][cur[1]]
    return path[::-1]`
  }
};
export {
  ControlBar as C,
  InfoPanel as I,
  VisualizerShell as V,
  CodeViewer as a,
  pathfindingCode as p,
  sortingCode as s,
  useAnimationPlayer as u
};
