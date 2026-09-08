import { useState, type ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface AppShellProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

/** Sidebar + main content layout used by every page. */
export function AppShell({ title, subtitle, actions, children }: AppShellProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <main className="min-h-screen px-4 py-5 sm:px-6 lg:ml-[250px] lg:px-8 lg:py-7">
        <Header title={title} subtitle={subtitle} actions={actions} onMenuClick={() => setOpen(true)} />
        <div key={title} className="page-enter space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
