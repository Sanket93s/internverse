import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { api, mockInterns, mockTasks } from "@/services/api";
import { Users, ClipboardList, Clock, CheckCircle, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const [interns, setInterns] = useState<typeof mockInterns>([]);
  const [tasks, setTasks] = useState<typeof mockTasks>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    Promise.all([api.fetchInterns(), api.fetchTasks()])
      .then(([i, t]) => {
        if (!mounted) return;
        setInterns(Array.isArray(i) && i.length ? i : mockInterns);
        setTasks(Array.isArray(t) && t.length ? t : mockTasks);
      })
      .catch(() => {
        if (!mounted) return;
        setInterns(mockInterns);
        setTasks(mockTasks);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const activeInterns = interns.filter((i) => i.status === "Active").length;
  const pendingSubs = tasks.filter((t) => t.status === "Submitted").length;
  const completed = interns.filter((i) => i.status === "Completed").length;

  const recentInterns = interns.slice(0, 4);

  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="space-y-6 animate-fade-in">
        <div
          className="rounded-2xl p-6 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(25 95% 53%) 100%)" }}
        >
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-1">Admin Control Panel</h2>
            <p className="text-sm opacity-80">Manage your internship program efficiently.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Total Interns" value={loading ? "-" : interns.length} icon={Users}
            gradient="linear-gradient(135deg, hsl(221 83% 53%), hsl(221 83% 43%))"
            change={`${activeInterns} active`} changeType="up" />
          <StatCard title="Active Tasks" value={loading ? "-" : tasks.length} icon={ClipboardList}
            gradient="linear-gradient(135deg, hsl(262 83% 58%), hsl(262 83% 48%))" />
          <StatCard title="Pending Reviews" value={loading ? "-" : pendingSubs} icon={Clock}
            gradient="linear-gradient(135deg, hsl(38 92% 50%), hsl(25 95% 50%))"
            change="Awaiting evaluation" changeType="down" />
          <StatCard title="Completed" value={loading ? "-" : completed} icon={CheckCircle}
            gradient="linear-gradient(135deg, hsl(142 71% 45%), hsl(142 71% 35%))"
            change="Internships done" changeType="up" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 section-card">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-base" style={{ color: "hsl(var(--foreground))" }}>Recent Interns</h3>
              <TrendingUp size={16} style={{ color: "hsl(var(--primary))" }} />
            </div>
            <div className="space-y-3">
              {recentInterns.map((intern) => (
                <div key={intern.id} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: "hsl(var(--border))" }}>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: "hsl(var(--primary))" }}
                    >
                      {intern.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>{intern.name}</p>
                      <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{intern.domain}</p>
                    </div>
                  </div>
                  <span className={intern.status === "Active" ? "badge-active" : intern.status === "Completed" ? "badge-evaluated" : "badge-inactive"}>
                    {intern.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="section-card">
            <h3 className="font-semibold text-base mb-5" style={{ color: "hsl(var(--foreground))" }}>Task Status Overview</h3>
            {[
              { label: "Pending", count: tasks.filter(t => t.status === "Pending").length, color: "hsl(var(--warning))" },
              { label: "Submitted", count: tasks.filter(t => t.status === "Submitted").length, color: "hsl(var(--primary))" },
              { label: "Evaluated", count: tasks.filter(t => t.status === "Evaluated").length, color: "hsl(var(--success))" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b last:border-b-0" style={{ borderColor: "hsl(var(--border))" }}>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                  <span className="text-sm" style={{ color: "hsl(var(--foreground))" }}>{item.label}</span>
                </div>
                <span className="text-sm font-bold" style={{ color: item.color }}>{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}