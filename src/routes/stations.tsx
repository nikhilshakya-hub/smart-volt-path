import { createFileRoute } from "@tanstack/react-router";
import { Crosshair, Search, SlidersHorizontal, Zap } from "lucide-react";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { EmptyState } from "@/components/EmptyState";
import { StationCard, statusClasses } from "@/components/StationCard";
import type { Station } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { stationService } from "@/services/stationService";

export const Route = createFileRoute("/stations")({
  head: () => ({
    meta: [
      { title: "Nearby Charging Stations — EV Smart" },
      { name: "description", content: "Find available EV charging stations near you with live slot availability, speed and price." },
      { property: "og:title", content: "Nearby Charging Stations — EV Smart" },
      { property: "og:description", content: "Find available EV charging stations near your location." },
    ],
  }),
  loader: () => stationService.getStations(),
  component: StationsPage,
});

type SortKey = "distance" | "availability" | "price";
const chargerTypes = ["All", "CCS2", "CHAdeMO", "Type 2", "Bharat DC-001"] as const;

function StationsPage() {
  const stations = Route.useLoaderData();
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState<SortKey>("distance");
  const [type, setType] = useState<(typeof chargerTypes)[number]>("All");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    const rank = { Available: 0, Limited: 1, Full: 2 };
    return stations
      .filter((s) => (type === "All" || s.chargerType === type) && (s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q)))
      .sort((a, b) =>
        sort === "distance" ? a.distanceKm - b.distanceKm : sort === "price" ? a.pricePerKwh - b.pricePerKwh : rank[a.status] - rank[b.status],
      );
  }, [stations, query, sort, type]);

  return (
    <AppShell title="Nearby Charging Stations" subtitle="Find available EV charging stations near your location.">
      {/* Search + filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="glass-card flex flex-1 items-center gap-2 px-4">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by station name or area…"
            className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>
        <button
          onClick={() => setShowFilters((v) => !v)}
          className={cn(
            "inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors",
            showFilters ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-surface/60 hover:text-primary",
          )}
        >
          <SlidersHorizontal className="size-4" /> Filter
        </button>
      </div>

      {showFilters && (
        <div className="glass-card page-enter flex flex-wrap gap-6 p-4">
          <FilterGroup label="Sort by">
            {(["distance", "availability", "price"] as SortKey[]).map((k) => (
              <Chip key={k} active={sort === k} onClick={() => setSort(k)}>
                {k === "distance" ? "Distance" : k === "availability" ? "Availability" : "Charging Price"}
              </Chip>
            ))}
          </FilterGroup>
          <FilterGroup label="Charger type">
            {chargerTypes.map((t) => (
              <Chip key={t} active={type === t} onClick={() => setType(t)}>{t}</Chip>
            ))}
          </FilterGroup>
        </div>
      )}

      {/* Map */}
      <MapPlaceholder stations={filtered} selected={selected} onSelect={setSelected} />

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="glass-card">
          <EmptyState title="No stations found" description="Try a different search term or reset the filters." icon={Search} />
        </div>
      ) : (
        <div className="stagger grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {filtered.map((s) => (
            <div key={s.id} className={cn("rounded-xl transition-shadow", selected === s.id && "ring-2 ring-primary/50")}>
              <StationCard station={s} />
            </div>
          ))}
        </div>
      )}
    </AppShell>
  );
}

function MapPlaceholder({ stations, selected, onSelect }: { stations: Station[]; selected: string | null; onSelect: (id: string) => void }) {
  return (
    <section className="glass-card relative h-[340px] overflow-hidden sm:h-[400px]">
      <div className="grid-bg absolute inset-0" />
      {/* Stylised roads */}
      <svg className="absolute inset-0 size-full opacity-40" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0 45 Q 30 40 50 48 T 100 42" fill="none" stroke="var(--muted-foreground)" strokeWidth="0.6" />
        <path d="M20 0 Q 25 40 18 100" fill="none" stroke="var(--muted-foreground)" strokeWidth="0.5" />
        <path d="M0 70 L 100 78" fill="none" stroke="var(--muted-foreground)" strokeWidth="0.4" />
        <path d="M60 0 Q 66 50 72 100" fill="none" stroke="var(--muted-foreground)" strokeWidth="0.5" />
      </svg>
      {/* User location */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-0 -m-4 animate-ping rounded-full bg-electric/20" />
        <span className="relative flex size-4 items-center justify-center rounded-full border-2 border-background bg-electric shadow-glow-blue" />
      </div>
      {/* Markers */}
      {stations.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          style={{ left: `${s.mapX}%`, top: `${s.mapY}%` }}
          className="group absolute -translate-x-1/2 -translate-y-full"
          aria-label={s.name}
        >
          <span
            className={cn(
              "flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold backdrop-blur transition-transform group-hover:scale-110",
              statusClasses[s.status],
              selected === s.id && "scale-110 ring-2 ring-primary/50",
            )}
          >
            <Zap className="size-3" fill="currentColor" /> {s.name.split(" ").slice(0, 2).join(" ")}
          </span>
          <span className="mx-auto block size-0 border-x-[5px] border-t-[6px] border-x-transparent border-t-current opacity-60" />
        </button>
      ))}
      {/* Overlay controls */}
      <div className="absolute top-4 left-4 rounded-lg border border-border bg-background/70 px-3 py-1.5 text-xs backdrop-blur">
        <span className="font-semibold">Delhi NCR</span> <span className="text-muted-foreground">· {stations.length} stations</span>
      </div>
      <button className="absolute right-4 bottom-4 flex size-9 items-center justify-center rounded-lg border border-border bg-background/70 text-muted-foreground backdrop-blur hover:text-primary" aria-label="Recenter">
        <Crosshair className="size-4" />
      </button>
      <div className="absolute bottom-4 left-4 flex gap-3 rounded-lg border border-border bg-background/70 px-3 py-1.5 text-[11px] backdrop-blur">
        <Legend className="bg-success" label="Available" />
        <Legend className="bg-warning" label="Limited" />
        <Legend className="bg-destructive" label="Full" />
      </div>
    </section>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return <span className="flex items-center gap-1.5 text-muted-foreground"><span className={cn("size-2 rounded-full", className)} /> {label}</span>;
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-xs text-muted-foreground">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active ? "border-primary/40 bg-primary/15 text-primary" : "border-border bg-surface/60 text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
