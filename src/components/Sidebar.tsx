import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, CheckSquare, Upload, BarChart2, Award,
  Users, ClipboardList, FileText, LogOut, Star, ChevronRight,
  BookOpen, ShieldCheck
} from "lucide-react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/BrandLogo";

interface NavItem {
  label: string;
  to: string;
  icon: React.ElementType;
}

const NAV_ITEMS: Record<UserRole, NavItem[]> = {
  intern: [
    { label: "Dashboard", to: "/intern", icon: LayoutDashboard },
    { label: "My Tasks", to: "/intern/tasks", icon: CheckSquare },
    { label: "Submit Task", to: "/intern/submit", icon: Upload },
    { label: "Performance", to: "/intern/performance", icon: BarChart2 },
    { label: "Certificate", to: "/intern/certificate", icon: Award },
  ],
  admin: [
    { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
    { label: "Manage Interns", to: "/admin/interns", icon: Users },
    { label: "Assign Tasks", to: "/admin/assign-task", icon: ClipboardList },
    { label: "Submissions", to: "/admin/submissions", icon: FileText },
    { label: "Reports", to: "/admin/reports", icon: BarChart2 },
  ],
  hr: [
    { label: "Dashboard", to: "/hr", icon: LayoutDashboard },
    { label: "Evaluate Tasks", to: "/hr/evaluate", icon: Star },
    { label: "Performance Reports", to: "/hr/reports", icon: BarChart2 },
  ],
};

const ROLE_META: Record<UserRole, { label: string; color: string; icon: React.ElementType }> = {
  intern: { label: "Intern Portal", color: "hsl(221 83% 70%)", icon: BookOpen },
  admin: { label: "Admin Panel", color: "hsl(38 92% 65%)", icon: ShieldCheck },
  hr: { label: "HR Dashboard", color: "hsl(142 71% 55%)", icon: Users },
};

export function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const safeRole: UserRole = user.role in NAV_ITEMS ? user.role : "intern";
  const items = NAV_ITEMS[safeRole];
  const meta = ROLE_META[safeRole];
  const Icon = meta.icon;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className="flex flex-col w-64 min-h-screen flex-shrink-0"
      style={{ background: "hsl(var(--sidebar-bg))" }}
    >
      <div className="flex items-center gap-3 px-5 py-5 border-b" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
        <BrandLogo size="sm" />
        <div>
          <p className="font-bold text-white text-lg leading-none">Internverse</p>
          <p className="text-sm mt-0.5" style={{ color: "hsl(var(--sidebar-fg))" }}>Management System</p>
        </div>
      </div>

      <div className="px-4 pt-4 pb-2">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ background: "hsl(var(--sidebar-hover-bg))" }}
        >
          <Icon size={16} style={{ color: meta.color }} />
          <span className="text-sm font-semibold" style={{ color: meta.color }}>{meta.label}</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {items.map((item) => {
          const isActive = location.pathname === item.to;
          const ItemIcon = item.icon;
          return (
            <Link key={item.to} to={item.to}>
              <div className={cn("sidebar-item", isActive && "active")}>
                <ItemIcon size={17} />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight size={14} className="opacity-60" />}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4 pt-2 border-t" style={{ borderColor: "hsl(var(--sidebar-border))" }}>
        <div className="flex items-center gap-3 px-3 py-2 mb-2 rounded-lg" style={{ background: "hsl(var(--sidebar-hover-bg))" }}>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
            style={{ background: "hsl(var(--primary))" }}
          >
            {user.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-medium text-white truncate">{user.name}</p>
            <p className="text-sm truncate" style={{ color: "hsl(var(--sidebar-fg))" }}>{user.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="sidebar-item w-full">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
