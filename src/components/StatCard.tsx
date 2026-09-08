import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "green" | "blue" | "amber" | "neutral";

interface StatCardProps {
  label: string;
  value: string;
  sublabel?: string | undefined;
  icon: ComponentType<{ className?: string }>;
  tone?: Tone;
  badge?: string | undefined;
  /** Optional 0–100 progress bar (e.g. battery level). */
  progress?: number | undefined;
  children?: ReactNode;
}

const toneClasses: Record<Tone, string> = {
  green: "bg-primary/12 text-primary",
  blue: "bg-electric/15 text-electric",
  amber: "bg-warning/15 text-warning",
  neutral: "bg-muted text-muted-foreground",
};

export function StatCard({ label, value, sublabel, icon: Icon, tone = "green", badge, progress, children }: StatCardProps) {
  return (
    <div className="glass-card glass-card-hover p-5">
      <div className="flex items-start justify-between">
        <span className={cn("flex size-11 items-center justify-center rounded-xl", toneClasses[tone])}>
          <Icon className="size-5" />
        </span>
        {badge && (
          <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", toneClasses[tone])}>{badge}</span>
        )}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold tracking-tight">{value}</p>
      {sublabel && <p className="mt-1 text-xs text-muted-foreground">{sublabel}</p>}
      {typeof progress === "number" && (
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-electric animate-grow-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {children}
    </div>
  );
}
