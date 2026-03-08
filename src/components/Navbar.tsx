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
      className="h-20 flex items-center justify-between px-7 border-b sticky top-0 z-10"
      style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
    >
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors">
          <Menu size={18} />
        </button>
        {title && (
          <h1 className="text-2xl font-semibold" style={{ color: "hsl(var(--foreground))" }}>
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-lg border text-base" style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--muted-foreground))", background: "hsl(var(--muted))" }}>
          <Search size={16} />
          <span>Search...</span>
          <kbd className="ml-2 text-sm opacity-60 font-mono">Ctrl+K</kbd>
        </div>

        <button className="relative p-2.5 rounded-lg hover:bg-muted transition-colors">
          <Bell size={20} style={{ color: "hsl(var(--muted-foreground))" }} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: "hsl(var(--primary))" }} />
        </button>

        {user && (
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow"
              style={{ background: "hsl(var(--primary))" }}
            >
              {user.avatar}
            </div>
            <div className="hidden sm:block">
              <p className="text-base font-medium leading-none" style={{ color: "hsl(var(--foreground))" }}>
                {user.name}
              </p>
              <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                {ROLE_LABEL[user.role]}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

