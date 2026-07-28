import { Link } from "@tanstack/react-router";
import { Brain } from "lucide-react";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-soft transition-transform group-hover:scale-105">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </span>
            <span className="text-base font-semibold tracking-tight">
              AI Interview Coach
            </span>
          </Link>
          <nav className="text-sm text-muted-foreground hidden sm:block">
            Practice smarter. Interview stronger.
          </nav>
        </div>
      </header>
      <main className="flex-1 w-full">{children}</main>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} AI Interview Coach
      </footer>
    </div>
  );
}
