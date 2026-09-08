import { Bell, CheckCheck } from "lucide-react";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { notifications as initial } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { EmptyState } from "./EmptyState";

export function NotificationDropdown() {
  const [items, setItems] = useState(initial);
  const unread = items.filter((n) => n.unread).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          aria-label="Notifications"
          className="relative flex size-10 items-center justify-center rounded-xl border border-border bg-surface/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
        >
          <Bell className="size-[18px]" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
              {unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 border-border bg-popover p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <button
            onClick={() => setItems((n) => n.map((x) => ({ ...x, unread: false })))}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
          >
            <CheckCheck className="size-3.5" /> Mark all read
          </button>
        </div>
        {items.length === 0 ? (
          <EmptyState title="All caught up" description="No new notifications." compact />
        ) : (
          <ul className="max-h-80 divide-y divide-border overflow-y-auto">
            {items.map((n) => (
              <li key={n.id} className={cn("px-4 py-3", n.unread && "bg-primary/5")}>
                <div className="flex items-start gap-2">
                  <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", n.unread ? "bg-primary" : "bg-muted")} />
                  <div>
                    <p className="text-sm font-medium">{n.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground/70">{n.time}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
