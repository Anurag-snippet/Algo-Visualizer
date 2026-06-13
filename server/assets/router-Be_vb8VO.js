import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, useRouter, Link, Outlet, HeadContent, Scripts, createFileRoute, lazyRouteComponent, redirect, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
const appCss = "/Algo-Visualizer/assets/styles-Cv3xXGx6.css";
function NotFoundComponent() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router = useRouter();
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            router.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$3 = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Algorithm Visualizer Hub" },
      {
        name: "description",
        content: "Interactive visualizer for sorting and pathfinding algorithms with light & dark mode."
      },
      { property: "og:title", content: "Algorithm Visualizer Hub" },
      {
        property: "og:description",
        content: "Visualize sorting and pathfinding algorithms step by step."
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Algorithm Visualizer Hub" },
      { name: "description", content: "Algorithm Explorer visualizes sorting and pathfinding algorithms with interactive controls and clear explanations." },
      { property: "og:description", content: "Algorithm Explorer visualizes sorting and pathfinding algorithms with interactive controls and clear explanations." },
      { name: "twitter:description", content: "Algorithm Explorer visualizes sorting and pathfinding algorithms with interactive controls and clear explanations." }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
const themeBootstrap = `(function(){try{var s=localStorage.getItem('viz-theme');var m=window.matchMedia('(prefers-color-scheme: light)').matches;var t=s==='light'||s==='dark'?s:(m?'light':'dark');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){document.documentElement.classList.add('dark');}})();`;
function RootShell({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: themeBootstrap } }),
      /* @__PURE__ */ jsx(HeadContent, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$3.useRouteContext();
  return /* @__PURE__ */ jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsx(Outlet, {}) });
}
const $$splitComponentImporter$1 = () => import("./sorting-CZW0qmKs.js");
const Route$2 = createFileRoute("/sorting")({
  head: () => ({
    meta: [{
      title: "Sorting Visualizer — Algo Visualizer Hub"
    }, {
      name: "description",
      content: "Visualize Bubble, Quick, and Merge sort with bar-chart animation, step controls, and adjustable speed."
    }, {
      property: "og:title",
      content: "Sorting Visualizer — Algo Visualizer Hub"
    }, {
      property: "og:description",
      content: "Watch sorting algorithms execute step by step on randomized arrays."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./pathfinding-D4u7Xpq6.js");
const Route$1 = createFileRoute("/pathfinding")({
  head: () => ({
    meta: [{
      title: "Pathfinding Visualizer — Algo Visualizer Hub"
    }, {
      name: "description",
      content: "Visualize Dijkstra, Floyd–Warshall, and BFS on an interactive grid. Draw walls, drag start/target, and generate mazes."
    }, {
      property: "og:title",
      content: "Pathfinding Visualizer — Algo Visualizer Hub"
    }, {
      property: "og:description",
      content: "Interactive grid pathfinding with Dijkstra, Floyd–Warshall, and BFS."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ to: "/sorting" });
  }
});
const SortingRoute = Route$2.update({
  id: "/sorting",
  path: "/sorting",
  getParentRoute: () => Route$3
});
const PathfindingRoute = Route$1.update({
  id: "/pathfinding",
  path: "/pathfinding",
  getParentRoute: () => Route$3
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$3
});
const rootRouteChildren = {
  IndexRoute,
  PathfindingRoute,
  SortingRoute
};
const routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router;
};
export {
  getRouter
};
