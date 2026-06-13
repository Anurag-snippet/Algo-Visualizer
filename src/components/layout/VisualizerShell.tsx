import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, Network, Github } from "lucide-react";
import type { ReactNode } from "react";
import { ThemeToggle } from "./ThemeToggle";

export function VisualizerShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const navItems = [
    { to: "/sorting", label: "Sorting", icon: BarChart3 },
    { to: "/pathfinding", label: "Pathfinding", icon: Network },
  ];

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-sidebar">
        <div className="px-5 py-5 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="size-8 rounded-md bg-gradient-to-br from-primary to-primary/60 grid place-items-center text-primary-foreground font-bold font-mono">
              A
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">Algo Visualizer</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">Hub</div>
            </div>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          <div className="px-2 pb-2 text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
            Modules
          </div>
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={[
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                ].join(" ")}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-sidebar-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground font-mono">v1.0</span>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="size-4" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* mobile top bar */}
        <header className="md:hidden border-b border-border bg-sidebar px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-7 rounded-md bg-gradient-to-br from-primary to-primary/60 grid place-items-center text-primary-foreground font-bold font-mono text-sm">
              A
            </div>
            <span className="text-sm font-semibold">Algo Visualizer</span>
          </Link>
          <div className="flex items-center gap-1">
            {navItems.map(({ to, label, icon: Icon }) => {
              const active = pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={[
                    "p-2 rounded-md transition-colors",
                    active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50",
                  ].join(" ")}
                  aria-label={label}
                >
                  <Icon className="size-4" />
                </Link>
              );
            })}
            <ThemeToggle />
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
