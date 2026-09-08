import { createFileRoute } from "@tanstack/react-router";
import { BatteryCharging, IndianRupee, Route as RouteIcon, Zap } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import { ChartCard, axisProps, chartTooltipStyle } from "@/components/ChartCard";
import { StatCard } from "@/components/StatCard";
import { evService } from "@/services/evService";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "EV Analytics — EV Smart" },
      { name: "description", content: "Analyze battery performance, energy consumption, charging costs and driving efficiency." },
      { property: "og:title", content: "EV Analytics — EV Smart" },
      { property: "og:description", content: "Analyze your battery performance and charging behavior." },
    ],
  }),
  loader: async () => {
    const [summary, weekly, energy, cost, ev, history] = await Promise.all([
      evService.getAnalyticsSummary(),
      evService.getWeeklyBattery(),
      evService.getEnergyConsumption(),
      evService.getCostComparison(),
      evService.getVehicleStatus(),
      evService.getChargingHistory(),
    ]);
    return { summary, weekly, energy, cost, ev, history };
  },
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { summary, weekly, energy, cost, ev, history } = Route.useLoaderData();
  const savings = summary.traditionalCost - summary.optimizedCost;

  return (
    <AppShell title="EV Analytics" subtitle="Analyze your battery performance and charging behavior.">
      <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Distance" value={`${summary.totalDistanceKm.toLocaleString("en-IN")} km`} sublabel="Last 30 days" icon={RouteIcon} tone="blue" />
        <StatCard label="Energy Consumed" value={`${summary.energyConsumedKwh} kWh`} sublabel="Last 30 days" icon={Zap} />
        <StatCard label="Total Charging Cost" value={`₹${summary.totalChargingCost.toLocaleString("en-IN")}`} sublabel="AI optimized" icon={IndianRupee} tone="amber" />
        <StatCard label="Average Efficiency" value={`${summary.averageEfficiency} km/kWh`} sublabel="Above segment average" icon={BatteryCharging} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Battery Usage" description="End-of-day battery level this week">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weekly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" {...axisProps} />
              <YAxis domain={[0, 100]} unit="%" {...axisProps} />
              <Tooltip {...chartTooltipStyle} formatter={(v) => [`${v}%`, "Battery"]} />
              <Line type="monotone" dataKey="level" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4, fill: "var(--primary)", strokeWidth: 0 }} activeDot={{ r: 6 }} animationDuration={1200} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Energy Consumption" description="Daily energy used (kWh)">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={energy} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" {...axisProps} />
              <YAxis unit="" {...axisProps} />
              <Tooltip {...chartTooltipStyle} cursor={{ fill: "var(--muted)" }} formatter={(v) => [`${v} kWh`, "Energy"]} />
              <Bar dataKey="kwh" fill="var(--electric)" radius={[6, 6, 0, 0]} animationDuration={1200} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Charging Cost Analysis"
          description="Peak-hour vs AI optimized charging (₹ / month)"
          action={
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
              Savings: ₹{savings}
            </span>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cost} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barGap={6}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip {...chartTooltipStyle} cursor={{ fill: "var(--muted)" }} formatter={(v, n) => [`₹${v}`, n === "traditional" ? "Traditional Charging" : "AI Optimized Charging"]} />
              <Bar dataKey="traditional" name="traditional" fill="var(--muted-foreground)" fillOpacity={0.5} radius={[6, 6, 0, 0]} animationDuration={1200} />
              <Bar dataKey="optimized" name="optimized" fill="var(--primary)" radius={[6, 6, 0, 0]} animationDuration={1200} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-sm bg-muted-foreground/50" /> Traditional ₹{summary.traditionalCost}</span>
            <span className="flex items-center gap-1.5"><span className="size-2 rounded-sm bg-primary" /> AI Optimized ₹{summary.optimizedCost}</span>
          </div>
        </ChartCard>

        <ChartCard title="Driving Efficiency" description="Efficiency and battery health overview">
          <div className="grid h-full grid-cols-2">
            <Donut value={(summary.averageEfficiency / 8) * 100} label="Average Efficiency" display={`${summary.averageEfficiency}`} unit="km/kWh" color="var(--electric)" />
            <Donut value={ev.batteryHealth} label="Battery Health" display={`${ev.batteryHealth}%`} unit="State of health" color="var(--primary)" />
          </div>
        </ChartCard>
      </div>

      {/* Charging history */}
      <section className="glass-card overflow-hidden">
        <div className="border-b border-border p-5">
          <h2 className="font-semibold">Recent Charging Sessions</h2>
          <p className="text-xs text-muted-foreground">Latest sessions logged by the scheduler</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground">
                {["Date", "Station", "Energy", "Duration", "Cost"].map((h) => <th key={h} className="px-5 py-3 font-medium">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id} className="border-t border-border hover:bg-muted/40">
                  <td className="px-5 py-3 whitespace-nowrap">{h.date}</td>
                  <td className="px-5 py-3 font-medium whitespace-nowrap">{h.station}</td>
                  <td className="px-5 py-3">{h.energyKwh} kWh</td>
                  <td className="px-5 py-3">{h.duration}</td>
                  <td className="px-5 py-3 font-semibold text-primary">₹{h.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}

function Donut({ value, label, display, unit, color }: { value: number; label: string; display: string; unit: string; color: string }) {
  const data = [{ v: value }, { v: 100 - value }];
  return (
    <div className="relative flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie data={data} dataKey="v" innerRadius="72%" outerRadius="90%" startAngle={90} endAngle={-270} stroke="none" animationDuration={1200}>
            <Cell fill={color} />
            <Cell fill="var(--muted)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute top-[40%] -translate-y-1/2 text-center">
        <p className="font-display text-2xl font-bold" style={{ color }}>{display}</p>
        <p className="text-[10px] text-muted-foreground">{unit}</p>
      </div>
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
    </div>
  );
}
