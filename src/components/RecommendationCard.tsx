import { Link } from "@tanstack/react-router";
import { ArrowRight, Bot, Clock, IndianRupee, Sparkles, TrendingDown } from "lucide-react";
import type { recommendation as Recommendation } from "@/data/mockData";

interface RecommendationCardProps {
  data: typeof Recommendation;
}

/** Large AI highlight card shown on the dashboard. */
export function RecommendationCard({ data }: RecommendationCardProps) {
  const items = [
    { icon: Clock, label: "Best Charging Time", value: data.bestTime, note: "Cheapest electricity period", tone: "text-primary" },
    { icon: IndianRupee, label: "Estimated Charging Cost", value: `₹${data.estimatedCost}`, note: `For ${data.energyKwh} kWh charging`, tone: "text-electric" },
    { icon: TrendingDown, label: "Potential Saving", value: `${data.savingsPercent}%`, note: "Compared with peak hours", tone: "text-primary" },
  ];

  return (
    <section className="ai-card overflow-hidden p-5 sm:p-6">
      <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-electric text-primary-foreground shadow-glow">
            <Bot className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold">AI Charging Recommendation</h2>
            <p className="mt-0.5 max-w-xl text-sm text-muted-foreground">
              Smart scheduling based on battery condition, electricity price, traffic, and station availability.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          <Sparkles className="size-3.5" /> AI Active
        </span>
      </div>

      <div className="relative mt-6 grid gap-3 sm:grid-cols-3">
        {items.map(({ icon: Icon, label, value, note, tone }) => (
          <div key={label} className="rounded-xl border border-border bg-background/40 p-4 transition-colors hover:border-primary/30">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Icon className={`size-4 ${tone}`} /> {label}
            </div>
            <p className={`mt-2 font-display text-2xl font-bold ${tone}`}>{value}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{note}</p>
          </div>
        ))}
      </div>

      <div className="relative mt-5 flex flex-col gap-4 rounded-xl border border-border bg-background/40 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-foreground/90">
          <span className="mr-2 text-primary">●</span>
          {data.message}
        </p>
        <Link
          to="/schedule"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 hover:shadow-glow"
        >
          View Full Schedule <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
