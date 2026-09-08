import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Battery, Gauge, Plug, Thermometer } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/AppShell";
import { ChartCard, axisProps, chartTooltipStyle } from "@/components/ChartCard";
import { RecommendationCard } from "@/components/RecommendationCard";
import { StatCard } from "@/components/StatCard";
import { StationCard } from "@/components/StationCard";
import { evService } from "@/services/evService";
import { scheduleService } from "@/services/scheduleService";
import { stationService } from "@/services/stationService";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EV Smart — AI EV Charging Dashboard" },
      { name: "description", content: "Monitor battery, range, electricity prices and AI charging recommendations for your electric vehicle." },
      { property: "og:title", content: "EV Smart — AI EV Charging Dashboard" },
      { property: "og:description", content: "AI-based intelligent electric vehicle charging scheduler." },
    ],
  }),
  loader: async () => {
    const [ev, rec, battery, prices, stations] = await Promise.all([
      evService.getVehicleStatus(),
      scheduleService.getRecommendation(),
      evService.getBatteryHistory(),
      scheduleService.getElectricityPrices(),
      stationService.getNearbyStations(3),
    ]);
    return { ev, rec, battery, prices, stations };
  },
  component: Dashboard,
});

function Dashboard() {
  const { ev, rec, battery, prices, stations } = Route.useLoaderData();
  const cheapest = prices.reduce((a, b) => (b.price < a.price ? b : a));

  return (
    <AppShell title="EV Dashboard" subtitle="Monitor your electric vehicle intelligently">
      {/* Quick statistics */}
      <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Battery Level" value={`${ev.batteryLevel}%`} icon={Battery} badge="Healthy" progress={ev.batteryLevel} />
        <StatCard label="Estimated Range" value={`${ev.estimatedRange} km`} sublabel="Available Range" icon={Gauge} tone="blue" />
        <StatCard label="Charging Status" value={ev.chargingStatus} sublabel="Not Currently Charging" icon={Plug} tone="neutral" />
        <StatCard label="Battery Temperature" value={`${ev.batteryTemperature}°C`} icon={Thermometer} tone="amber" badge="Normal" />
      </div>

      <RecommendationCard data={rec} />

      {/* Charts */}
      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Battery Performance" description="Battery percentage over today">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={battery} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="batteryFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="time" {...axisProps} />
              <YAxis domain={[0, 100]} unit="%" {...axisProps} />
              <Tooltip {...chartTooltipStyle} formatter={(v) => [`${v}%`, "Battery"]} />
              <Area type="monotone" dataKey="level" stroke="var(--primary)" strokeWidth={2.5} fill="url(#batteryFill)" animationDuration={1200} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Electricity Price Prediction"
          description="Hourly tariff forecast (₹/kWh)"
          action={
            <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
              Cheapest: {cheapest.time} · ₹{cheapest.price}
            </span>
          }
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={prices} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="time" {...axisProps} interval={0} tick={{ ...axisProps.tick, fontSize: 10 }} />
              <YAxis {...axisProps} />
              <Tooltip {...chartTooltipStyle} cursor={{ fill: "var(--muted)" }} formatter={(v) => [`₹${v}/kWh`, "Price"]} />
              <Bar dataKey="price" radius={[6, 6, 0, 0]} animationDuration={1200}>
                {prices.map((p) => (
                  <Cell key={p.time} fill={p.time === cheapest.time ? "var(--primary)" : "var(--electric)"} fillOpacity={p.time === cheapest.time ? 1 : 0.55} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Nearby stations */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Nearby Charging Stations</h2>
            <p className="text-sm text-muted-foreground">Closest stations to {ev.location}</p>
          </div>
          <Link to="/stations" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
            View All Stations <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="stagger grid gap-4 md:grid-cols-3">
          {stations.map((s) => (
            <StationCard key={s.id} station={s} compact />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
