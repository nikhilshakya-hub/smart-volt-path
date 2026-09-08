import { cn } from "@/lib/utils";

interface LoadingStateProps {
  label?: string;
  className?: string;
}

/** Skeleton shimmer used while charts/data are loading. */
export function LoadingState({ label = "Loading…", className }: LoadingStateProps) {
  return (
    <div className={cn("flex h-full min-h-40 flex-col items-center justify-center gap-3", className)}>
      <div className="relative size-8">
        <span className="absolute inset-0 rounded-full border-2 border-border" />
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary" />
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
