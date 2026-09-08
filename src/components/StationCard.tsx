import { Gauge, IndianRupee, MapPin, Navigation, Plug } from "lucide-react";
import { toast } from "sonner";
import type { Station, StationStatus } from "@/data/mockData";
import { cn } from "@/lib/utils";

export const statusClasses: Record<StationStatus, string> = {
  Available: "bg-success/15 text-success border-success/30",
  Limited: "bg-warning/15 text-warning border-warning/30",
  Full: "bg-destructive/15 text-destructive border-destructive/30",
};

export function StatusBadge({ status }: { status: StationStatus }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold", statusClasses[status])}>
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

interface StationCardProps {
  station: Station;
  compact?: boolean;
}

export function StationCard({ station, compact }: StationCardProps) {
  const slotPct = (station.availableSlots / station.totalSlots) * 100;

  return (
    <article className="glass-card glass-card-hover flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-semibold">{station.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0" /> {station.address}
          </p>
        </div>
        <StatusBadge status={station.status} />
      </div>

      <dl className={cn("mt-4 grid gap-3 text-sm", compact ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4")}>
        <Meta icon={Navigation} label="Distance" value={`${station.distanceKm} km`} />
        <Meta icon={Plug} label="Slots" value={`${station.availableSlots}/${station.totalSlots}`} />
        <Meta icon={IndianRupee} label="Price" value={`₹${station.pricePerKwh.toFixed(1)}/kWh`} />
        {!compact && <Meta icon={Gauge} label="Speed" value={station.chargingSpeed} />}
      </dl>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full animate-grow-bar",
            station.status === "Available" && "bg-success",
            station.status === "Limited" && "bg-warning",
            station.status === "Full" && "bg-destructive",
          )}
          style={{ width: `${Math.max(slotPct, 4)}%` }}
        />
      </div>

      {!compact && (
        <div className="mt-5 flex gap-2">
          <button
            onClick={() => toast.info(station.name, { description: `${station.chargerType} · ${station.chargingSpeed} · ${station.address}` })}
            className="flex-1 rounded-xl border border-border bg-surface/60 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary"
          >
            View Details
          </button>
          <button
            onClick={() => toast.success("Navigation started", { description: `Routing to ${station.name} (${station.distanceKm} km)` })}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 hover:shadow-glow"
          >
            <Navigation className="size-4" /> Navigate
          </button>
        </div>
      )}
    </article>
  );
}

function Meta({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div>
      <dt className="flex items-center gap-1 text-[11px] text-muted-foreground">
        <Icon className="size-3" /> {label}
      </dt>
      <dd className="mt-0.5 font-medium">{value}</dd>
    </div>
  );
}
