import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { api } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Star } from "lucide-react";

export default function Performance() {
  const { user } = useAuth();
  const [perf, setPerf] = useState<Awaited<ReturnType<typeof api.fetchPerformance>> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.fetchPerformance(user?.id || "intern-1").then((d) => { setPerf(d); setLoading(false); });
  }, [user]);

  const completionRate = perf ? Math.round((perf.completed / (perf.totalTasks || 1)) * 100) : 0;

  return (
    <DashboardLayout title="Performance">
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="page-title">Performance Overview</h2>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            Your internship performance metrics and evaluation history.
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-32 rounded-xl bg-muted animate-pulse" />)}
          </div>
        ) : (
          <>
            {/* Score cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="section-card text-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 shadow-lg"
                  style={{ background: "linear-gradient(135deg, hsl(221 83% 53%), hsl(262 83% 58%))" }}
                >
                  {perf?.score}%
                </div>
                <p className="font-semibold" style={{ color: "hsl(var(--foreground))" }}>Performance Score</p>
                <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>Overall rating</p>
              </div>

              <div className="section-card text-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 shadow-lg"
                  style={{ background: "linear-gradient(135deg, hsl(142 71% 45%), hsl(142 71% 35%))" }}
                >
                  {completionRate}%
                </div>
                <p className="font-semibold" style={{ color: "hsl(var(--foreground))" }}>Completion Rate</p>
                <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{perf?.completed} of {perf?.totalTasks} tasks</p>
              </div>

              <div className="section-card text-center">
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3 shadow-lg"
                  style={{ background: "linear-gradient(135deg, hsl(38 92% 50%), hsl(25 95% 50%))" }}
                >
                  {perf?.ratings.length || 0}
                </div>
                <p className="font-semibold" style={{ color: "hsl(var(--foreground))" }}>Evaluations</p>
                <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>Tasks reviewed</p>
              </div>
            </div>

            {/* Task breakdown */}
            <div className="section-card">
              <h3 className="font-semibold text-base mb-4" style={{ color: "hsl(var(--foreground))" }}>Task Breakdown</h3>
              <div className="space-y-3">
                {[
                  { label: "Evaluated Tasks", count: perf?.completed || 0, color: "hsl(var(--success))", bg: "hsl(var(--success-light))" },
                  { label: "Submitted Tasks", count: perf?.submitted || 0, color: "hsl(var(--primary))", bg: "hsl(var(--primary-light))" },
                  { label: "Pending Tasks", count: perf?.pending || 0, color: "hsl(var(--warning))", bg: "hsl(var(--warning-light))" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-lg" style={{ background: item.bg }}>
                    <span className="text-sm font-medium" style={{ color: item.color }}>{item.label}</span>
                    <span className="text-lg font-bold" style={{ color: item.color }}>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Evaluation ratings */}
            {perf?.ratings && perf.ratings.length > 0 && (
              <div className="section-card">
                <h3 className="font-semibold text-base mb-4" style={{ color: "hsl(var(--foreground))" }}>Evaluation Ratings</h3>
                <div className="space-y-4">
                  {perf.ratings.map((r, i) => (
                    <div key={i} className="p-4 rounded-xl border" style={{ borderColor: "hsl(var(--border))" }}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-sm" style={{ color: "hsl(var(--foreground))" }}>{r.task}</p>
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: "hsl(var(--warning-light))" }}>
                          <Star size={12} style={{ color: "hsl(var(--warning))" }} fill="hsl(var(--warning))" />
                          <span className="text-xs font-bold" style={{ color: "hsl(var(--warning))" }}>{r.rating}/10</span>
                        </div>
                      </div>
                      {r.feedback && (
                        <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>"{r.feedback}"</p>
                      )}
                      <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${r.rating * 10}%`, background: "hsl(var(--warning))" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
