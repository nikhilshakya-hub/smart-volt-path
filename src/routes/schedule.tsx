import { createFileRoute } from "@tanstack/react-router";
import { Calculator, CalendarCheck, Clock, IndianRupee, PiggyBank, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import type { SlotRecommendation, TimeSlot } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { scheduleService } from "@/services/scheduleService";
import { evService } from "@/services/evService";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title: "Smart Charging Schedule — EV Smart" },
      { name: "description", content: "AI-powered charging windows, time slot comparison and a charging cost calculator." },
      { property: "og:title", content: "Smart Charging Schedule — EV Smart" },
      { property: "og:description", content: "AI-powered recommendations for optimal EV charging." },
    ],
  }),
  loader: async () => {
    const [rec, slots, ev] = await Promise.all([
      scheduleService.getRecommendation(),
      scheduleService.getTimeSlots(),
      evService.getVehicleStatus(),
    ]);
    return { rec, slots, ev };
  },
  component: SchedulePage,
});

const recTone: Record<SlotRecommendation, string> = {
  Recommended: "bg-success/15 text-success border-success/30",
  Alternative: "bg-electric/15 text-electric border-electric/30",
  Moderate: "bg-warning/15 text-warning border-warning/30",
  "Not Recommended": "bg-destructive/15 text-destructive border-destructive/30",
};

const trafficTone = { High: "text-destructive", Medium: "text-warning", Low: "text-success" } as const;

function SchedulePage() {
  const { rec, slots, ev } = Route.useLoaderData();
  const [scheduled, setScheduled] = useState(false);

  return (
    <AppShell title="Smart Charging Schedule" subtitle="AI-powered recommendations for optimal EV charging.">
      {/* Current recommendation */}
      <section className="ai-card p-5 sm:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-wider text-primary uppercase">Recommended Charging Window</p>
            <p className="mt-2 font-display text-3xl font-bold sm:text-4xl">{rec.recommendedTime}</p>
            <div className="mt-5 grid grid-cols-3 gap-4">
              <Stat icon={Zap} label="Electricity Price" value={`₹${rec.electricityPrice}/kWh`} />
              <Stat icon={IndianRupee} label="Estimated Cost" value={`₹${rec.estimatedCost}`} />
              <Stat icon={PiggyBank} label="Estimated Saving" value={`₹${rec.savingsAmount}`} accent />
            </div>
          </div>
          <button
            onClick={() => {
              setScheduled(true);
              toast.success("Charging scheduled", { description: `Your vehicle will charge ${rec.recommendedTime}.` });
            }}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-base font-bold transition-all",
              scheduled
                ? "border border-success/40 bg-success/15 text-success"
                : "bg-primary text-primary-foreground hover:brightness-110 hover:shadow-glow",
            )}
          >
            <CalendarCheck className="size-5" />
            {scheduled ? "Charging Scheduled" : "Schedule Charging"}
          </button>
        </div>
      </section>

      {/* Slot comparison */}
      <section className="glass-card overflow-hidden">
        <div className="border-b border-border p-5">
          <h2 className="font-semibold">Time Slot Comparison</h2>
          <p className="text-xs text-muted-foreground">AI score combines price, traffic and station availability</p>
        </div>
        {/* Desktop table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                {["Time", "Electricity Price", "Traffic", "Station Availability", "AI Score", "Recommendation"].map((h) => (
                  <th key={h} className="px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slots.map((s) => (
                <tr
                  key={s.time}
                  className={cn(
                    "border-t border-border transition-colors hover:bg-muted/40",
                    s.recommendation === "Recommended" && "bg-primary/8 shadow-[inset_3px_0_0_0_var(--color-primary)]",
                  )}
                >
                  <td className="px-5 py-4 font-semibold">{s.time}</td>
                  <td className="px-5 py-4">₹{s.price.toFixed(1)}</td>
                  <td className={cn("px-5 py-4 font-medium", trafficTone[s.traffic])}>{s.traffic}</td>
                  <td className="px-5 py-4">{s.availability}</td>
                  <td className="px-5 py-4"><Score value={s.aiScore} /></td>
                  <td className="px-5 py-4"><RecBadge value={s.recommendation} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile cards */}
        <div className="divide-y divide-border md:hidden">
          {slots.map((s) => <SlotRow key={s.time} slot={s} />)}
        </div>
      </section>

      <CostCalculator defaultCurrent={ev.batteryLevel} defaultCapacity={ev.batteryCapacityKwh} />
    </AppShell>
  );
}

function SlotRow({ slot }: { slot: TimeSlot }) {
  return (
    <div className={cn("space-y-3 p-4", slot.recommendation === "Recommended" && "bg-primary/8")}>
      <div className="flex items-center justify-between">
        <p className="font-semibold">{slot.time}</p>
        <RecBadge value={slot.recommendation} />
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        <div><p className="text-muted-foreground">Price</p><p className="font-medium">₹{slot.price}</p></div>
        <div><p className="text-muted-foreground">Traffic</p><p className={cn("font-medium", trafficTone[slot.traffic])}>{slot.traffic}</p></div>
        <div><p className="text-muted-foreground">Stations</p><p className="font-medium">{slot.availability}</p></div>
      </div>
      <Score value={slot.aiScore} />
    </div>
  );
}

function Score({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full animate-grow-bar", value >= 85 ? "bg-success" : value >= 60 ? "bg-warning" : "bg-destructive")}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-semibold">{value}</span>
    </div>
  );
}

function RecBadge({ value }: { value: SlotRecommendation }) {
  return <span className={cn("rounded-full border px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap", recTone[value])}>{value}</span>;
}

function Stat({ icon: Icon, label, value, accent }: { icon: typeof Zap; label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="flex items-center gap-1 text-[11px] text-muted-foreground"><Icon className="size-3.5" /> {label}</p>
      <p className={cn("mt-1 font-display text-lg font-bold sm:text-xl", accent && "text-primary")}>{value}</p>
    </div>
  );
}

function CostCalculator({ defaultCurrent, defaultCapacity }: { defaultCurrent: number; defaultCapacity: number }) {
  const [current, setCurrent] = useState(defaultCurrent);
  const [target, setTarget] = useState(100);
  const [capacity, setCapacity] = useState(defaultCapacity);
  const result = useMemo(() => scheduleService.estimateCharging(current, target, capacity), [current, target, capacity]);

  return (
    <section className="glass-card p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-electric/15 text-electric"><Calculator className="size-5" /></span>
        <div>
          <h2 className="font-semibold">Charging Cost Calculator</h2>
          <p className="text-xs text-muted-foreground">Estimate energy and cost for your next charge</p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <Field label="Current Battery Percentage" value={current} unit="%" min={0} max={100} onChange={setCurrent} />
          <Field label="Target Battery Percentage" value={target} unit="%" min={0} max={100} onChange={setTarget} />
          <Field label="Battery Capacity" value={capacity} unit="kWh" min={10} max={120} step={0.5} onChange={setCapacity} />
        </div>
        <div className="grid grid-cols-2 gap-3 self-start">
          <Result label="Required Energy" value={`${result.requiredEnergy} kWh`} icon={Zap} />
          <Result label="Estimated Charging Cost" value={`₹${result.estimatedCost}`} icon={IndianRupee} highlight />
          <Result label="Charging Duration" value={`~${result.durationHours} h`} icon={Clock} />
          <Result label="Savings vs Peak" value={`₹${result.savings}`} icon={PiggyBank} />
          <div className="col-span-2 rounded-xl border border-primary/30 bg-primary/10 p-4">
            <p className="text-[11px] text-muted-foreground">Recommended Time</p>
            <p className="mt-1 font-display text-xl font-bold text-primary">{result.recommendedTime}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, unit, min, max, step = 1, onChange }: { label: string; value: number; unit: string; min: number; max: number; step?: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="flex items-center gap-1 rounded-lg border border-border bg-surface px-2 py-1 font-semibold">
          <input
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-14 bg-transparent text-right outline-none"
          />
          <span className="text-xs text-muted-foreground">{unit}</span>
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-primary" />
    </label>
  );
}

function Result({ label, value, icon: Icon, highlight }: { label: string; value: string; icon: typeof Zap; highlight?: boolean }) {
  return (
    <div className={cn("rounded-xl border border-border bg-background/40 p-4", highlight && "border-electric/30")}>
      <p className="flex items-center gap-1 text-[11px] text-muted-foreground"><Icon className="size-3.5" /> {label}</p>
      <p className={cn("mt-1 font-display text-xl font-bold", highlight && "text-electric")}>{value}</p>
    </div>
  );
}
