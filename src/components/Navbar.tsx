import { Bell, Search, Menu } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const ROLE_LABEL = {
  intern: "Intern",
  admin: "Administrator",
  hr: "HR Manager",
};

interface NavbarProps {
  title?: string;
}

export function Navbar({ title }: NavbarProps) {
  const { user } = useAuth();

  return (
    <header
      className="h-16 flex items-center justify-between px-6 border-b sticky top-0 z-10"
      style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
    >
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors">
          <Menu size={18} />
        </button>
        {title && (
          <h1 className="text-lg font-semibold" style={{ color: "hsl(var(--foreground))" }}>
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg border text-sm" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))", background: "hsl(var(--muted))" }}>
          <Search size={14} />
          <span>Search…</span>
          <kbd className="ml-2 text-xs opacity-60 font-mono">⌘K</kbd>
        </div>

        <button className="relative p-2.5 rounded-lg hover:bg-muted transition-colors">
          <Bell size={18} style={{ color: "hsl(var(--muted-foreground))" }} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: "hsl(var(--primary))" }} />
        </button>

        {user && (
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow"
              style={{ background: "hsl(var(--primary))" }}
            >
              {user.avatar}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium leading-none" style={{ color: "hsl(var(--foreground))" }}>
                {user.name}
              </p>
              <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                {ROLE_LABEL[user.role]}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
