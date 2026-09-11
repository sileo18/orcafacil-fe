import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./BottomNav";
import { MobileTopBar } from "./MobileTopBar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <MobileTopBar />
        <main className="flex-1 pb-24 md:pb-0">
          <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
