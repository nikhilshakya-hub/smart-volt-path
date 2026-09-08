import { MapPin, Menu } from "lucide-react";
import type { ReactNode } from "react";
import { evData, userProfile } from "@/data/mockData";
import { NotificationDropdown } from "./NotificationDropdown";

interface HeaderProps {
  title: string;
  subtitle?: string | undefined;
  onMenuClick: () => void;
  actions?: ReactNode | undefined;
}

/** Page header with title, location chip, notifications and avatar. */
export function Header({ title, subtitle, onMenuClick, actions }: HeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 pb-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="flex size-10 items-center justify-center rounded-xl border border-border bg-surface/60 text-muted-foreground hover:text-foreground lg:hidden"
        >
          <Menu className="size-5" />
        </button>
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {actions}
        <span className="hidden items-center gap-1.5 rounded-xl border border-border bg-surface/60 px-3 py-2 text-sm text-muted-foreground sm:flex">
          <MapPin className="size-4 text-primary" />
          {evData.location}
        </span>
        <NotificationDropdown />
        <button
          aria-label="Profile"
          className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-electric to-primary text-sm font-bold text-primary-foreground shadow-glow-blue transition-transform hover:scale-105"
        >
          {userProfile.initials}
        </button>
      </div>
    </header>
  );
}
