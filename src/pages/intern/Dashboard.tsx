import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { CheckSquare, Clock, BarChart2, Award, TrendingUp } from "lucide-react";

export default function InternDashboard() {
  const { user } = useAuth();
  const [perf, setPerf] = useState<Awaited<ReturnType<typeof api.fetchPerformance>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.fetchPerformance(user?.id || "intern-1").then((d) => {
      setPerf(d);
      setLoading(false);
    });
  }, [user]);

  const recentActivity = [
    { text: "Task 'UI Component Library' has been evaluated", time: "2 hours ago", type: "success" },
    { text: "New task 'Mobile Responsive Testing' assigned", time: "1 day ago", type: "info" },
    { text: "Submitted 'Database Schema Design' for review", time: "3 days ago", type: "neutral" },
  ];

  return (
    <DashboardLayout title="My Dashboard">
      <div className="space-y-7 animate-fade-in">
        <div
          className="rounded-2xl p-8 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(221 83% 53%) 0%, hsl(262 83% 58%) 100%)" }}
        >
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute right-20 bottom-0 w-24 h-24 rounded-full bg-white/5" />
          <div className="relative z-10">
            <p className="text-lg font-medium opacity-85 mb-1">Good day,</p>
            <h2 className="text-4xl font-bold mb-2">{user?.name}</h2>
            <p className="text-lg opacity-80">Track your progress and stay on top of your internship goals.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          <StatCard
            title="Total Tasks"
            value={loading ? "-" : perf?.totalTasks ?? 0}
            icon={CheckSquare}
            gradient="linear-gradient(135deg, hsl(221 83% 53%), hsl(221 83% 43%))"
            change="Assigned tasks"
          />
          <StatCard
            title="Completed"
            value={loading ? "-" : perf?.completed ?? 0}
            icon={Award}
            gradient="linear-gradient(135deg, hsl(142 71% 45%), hsl(142 71% 35%))"
            change="Fully evaluated"
            changeType="up"
          />
          <StatCard
            title="Pending"
            value={loading ? "-" : perf?.pending ?? 0}
            icon={Clock}
            gradient="linear-gradient(135deg, hsl(38 92% 50%), hsl(25 95% 50%))"
            change="Awaiting submission"
            changeType="down"
          />
          <StatCard
            title="Performance"
            value={loading ? "-" : `${perf?.score ?? 0}%`}
            icon={BarChart2}
            gradient="linear-gradient(135deg, hsl(262 83% 58%), hsl(262 83% 48%))"
            change="Overall score"
            changeType="up"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 section-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-2xl" style={{ color: "hsl(var(--foreground))" }}>Task Progress</h3>
              <TrendingUp size={18} style={{ color: "hsl(var(--primary))" }} />
            </div>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => <div key={i} className="h-9 rounded-lg bg-muted animate-pulse" />)}
              </div>
            ) : (
              <div className="space-y-5">
                {[
                  { label: "Completed Tasks", value: perf?.completed || 0, total: perf?.totalTasks || 1, color: "hsl(var(--success))" },
                  { label: "Submitted Tasks", value: perf?.submitted || 0, total: perf?.totalTasks || 1, color: "hsl(var(--primary))" },
                  { label: "Pending Tasks", value: perf?.pending || 0, total: perf?.totalTasks || 1, color: "hsl(var(--warning))" },
                ].map((item) => {
                  const pct = Math.round((item.value / item.total) * 100);
                  return (
                    <div key={item.label}>
                      <div className="flex justify-between text-lg mb-2">
                        <span style={{ color: "hsl(var(--foreground))" }}>{item.label}</span>
                        <span style={{ color: "hsl(var(--muted-foreground))" }}>{item.value}/{item.total}</span>
                      </div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: item.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="section-card">
            <h3 className="font-semibold text-2xl mb-6" style={{ color: "hsl(var(--foreground))" }}>Recent Activity</h3>
            <div className="space-y-5">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0"
                    style={{ background: a.type === "success" ? "hsl(var(--success))" : a.type === "info" ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))" }}
                  />
                  <div>
                    <p className="text-lg leading-snug" style={{ color: "hsl(var(--foreground))" }}>{a.text}</p>
                    <p className="text-base mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
