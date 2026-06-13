import { useState } from "react";
import { Code2, Copy, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import type { CodeBundle } from "@/lib/algoCode";

interface CodeViewerProps {
  algoName: string;
  code: CodeBundle | undefined;
}

type Lang = "cpp" | "python";

export function CodeViewer({ algoName, code }: CodeViewerProps) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<Lang>("cpp");
  const [copied, setCopied] = useState(false);

  const source = code?.[lang] ?? "// Code not available";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* noop */
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border border-border bg-background hover:bg-accent transition"
          title="View source code"
        >
          <Code2 className="size-3.5" /> View Code
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-border">
          <DialogTitle className="flex items-center gap-2">
            <Code2 className="size-4 text-primary" />
            {algoName} — Source Code
          </DialogTitle>
          <DialogDescription className="text-xs">
            Reference implementation. Pseudocode/standard textbook form.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between px-5 py-2.5 bg-card/40 border-b border-border">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setLang("cpp")}
              className={[
                "px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors",
                lang === "cpp"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent",
              ].join(" ")}
            >
              C++
            </button>
            <button
              onClick={() => setLang("python")}
              className={[
                "px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors",
                lang === "python"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent",
              ].join(" ")}
            >
              Python
            </button>
          </div>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border border-border hover:bg-accent transition"
          >
            {copied ? <Check className="size-3.5 text-viz-sorted" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <pre className="m-0 p-5 max-h-[60vh] overflow-auto bg-background text-xs leading-relaxed font-mono text-foreground">
          <code>{source}</code>
        </pre>
      </DialogContent>
    </Dialog>
  );
}
