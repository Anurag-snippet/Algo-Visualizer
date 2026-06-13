interface ComplexityRow {
  label: string;
  value: string;
}

interface InfoPanelProps {
  name: string;
  description: string;
  rows: ComplexityRow[];
  legend?: { label: string; className: string }[];
}

export function InfoPanel({ name, description, rows, legend }: InfoPanelProps) {
  return (
    <aside className="w-full lg:w-72 shrink-0 border-l border-border bg-card/30 p-5 space-y-5 overflow-y-auto">
      <div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-1">
          Algorithm
        </div>
        <h2 className="text-lg font-semibold tracking-tight">{name}</h2>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-2">
          Complexity
        </div>
        <dl className="space-y-1.5">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between text-sm">
              <dt className="text-muted-foreground">{r.label}</dt>
              <dd className="font-mono text-foreground">{r.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {legend && legend.length > 0 && (
        <div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono mb-2">
            Legend
          </div>
          <ul className="space-y-1.5">
            {legend.map((l) => (
              <li key={l.label} className="flex items-center gap-2.5 text-sm">
                <span className={`inline-block size-3 rounded-sm ${l.className}`} />
                <span className="text-muted-foreground">{l.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
