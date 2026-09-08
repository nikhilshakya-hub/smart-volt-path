import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LoadingState } from "./LoadingState";

interface ChartCardProps {
  title: string;
  description?: string | undefined;
  action?: ReactNode;
  className?: string;
  height?: number;
  children: ReactNode;
}

/** Charts are measured in the browser, so render them only after hydration. */
export function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

export function ChartCard({ title, description, action, className, height = 280, children }: ChartCardProps) {
  const hydrated = useHydrated();
  return (
    <section className={cn("glass-card p-5 sm:p-6", className)}>
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>
      <div style={{ height }} className="w-full">
        {hydrated ? children : <LoadingState label="Rendering chart…" />}
      </div>
    </section>
  );
}

/** Shared recharts tooltip styling. */
export const chartTooltipStyle = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    fontSize: 12,
    color: "var(--foreground)",
  },
  labelStyle: { color: "var(--muted-foreground)" },
  itemStyle: { color: "var(--foreground)" },
  cursor: { stroke: "var(--border)" },
};

export const axisProps = {
  tick: { fill: "var(--muted-foreground)", fontSize: 12 },
  axisLine: false,
  tickLine: false,
} as const;
