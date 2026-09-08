import { Link } from "@tanstack/react-router";
import { BarChart3, CalendarClock, LayoutDashboard, MapPin, Settings, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/schedule", label: "Charging Schedule", icon: CalendarClock },
  { to: "/stations", label: "Charging Stations", icon: MapPin },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

/** Fixed 250px sidebar on desktop; slide-in drawer on mobile. */
export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      <div
        onClick={onClose}
        aria-hidden
        className={cn(
          "fixed inset-0 z-40 bg-background/70 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r border-sidebar-border bg-sidebar/95 backdrop-blur-xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-6">
          <Link to="/" onClick={onClose} className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-electric shadow-glow">
              <Zap className="size-5 text-primary-foreground" fill="currentColor" />
            </span>
            <span>
              <span className="block font-display text-base font-bold tracking-wide text-sidebar-foreground">
                EV SMART
              </span>
              <span className="block text-[11px] text-muted-foreground">AI-Powered EV Intelligence</span>
            </span>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground lg:hidden"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              activeOptions={{ exact: to === "/" }}
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-sidebar-accent/60 hover:text-foreground"
              activeProps={{
                className:
                  "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_3px_0_0_0_var(--color-primary)] hover:bg-sidebar-accent",
              }}
            >
              <Icon className="size-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110" />
              {label}
            </Link>
          ))}
        </nav>

        {/* AI status */}
        <div className="m-3 rounded-xl border border-sidebar-border bg-surface/60 px-4 py-3">
          <div className="flex items-center gap-2.5 text-sm">
            <span className="size-2 rounded-full bg-success animate-pulse-dot" />
            <span className="font-medium text-sidebar-foreground">AI System Online</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">Scheduler v2.1 · Last sync 2 min ago</p>
        </div>
      </aside>
    </>
  );
}
