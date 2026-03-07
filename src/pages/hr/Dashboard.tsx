import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { api, mockEvaluations, mockInterns } from "@/services/api";
import { Star, Users, CheckCircle, BarChart2 } from "lucide-react";

export default function HRDashboard() {
  const [evals, setEvals] = useState<typeof mockEvaluations>([]);
  const [interns, setInterns] = useState<typeof mockInterns>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    Promise.all([api.fetchEvaluations(), api.fetchInterns()])
      .then(([e, i]) => {
        if (!mounted) return;
        setEvals(Array.isArray(e) && e.length ? e : mockEvaluations);
        setInterns(Array.isArray(i) && i.length ? i : mockInterns);
      })
      .catch(() => {
        if (!mounted) return;
        setEvals(mockEvaluations);
        setInterns(mockInterns);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const completed = evals.filter((e) => e.rating !== null).length;
  const pending = evals.filter((e) => e.rating === null).length;
  const rated = evals.filter((e) => e.rating !== null);
  const avgRating = rated.length
    ? (rated.reduce((a, b) => a + (b.rating as number), 0) / rated.length).toFixed(1)
    : "-";

  return (
    <DashboardLayout title="HR Dashboard">
      <div className="space-y-6 animate-fade-in">
        <div
          className="rounded-2xl p-6 text-white relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(142 71% 40%) 0%, hsl(162 60% 38%) 100%)" }}
        >
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-1">HR Evaluation Panel</h2>
            <p className="text-sm opacity-80">Review submissions and generate performance insights.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Total Interns" value={loading ? "-" : interns.length} icon={Users}
            gradient="linear-gradient(135deg, hsl(221 83% 53%), hsl(221 83% 43%))" />
          <StatCard title="Evaluations Done" value={loading ? "-" : completed} icon={CheckCircle}
            gradient="linear-gradient(135deg, hsl(142 71% 45%), hsl(142 71% 35%))"
            change="Reviewed tasks" changeType="up" />
          <StatCard title="Pending Reviews" value={loading ? "-" : pending} icon={BarChart2}
            gradient="linear-gradient(135deg, hsl(38 92% 50%), hsl(25 95% 50%))"
            change="Need evaluation" changeType="down" />
          <StatCard title="Avg. Rating" value={loading ? "-" : `${avgRating}/10`} icon={Star}
            gradient="linear-gradient(135deg, hsl(262 83% 58%), hsl(262 83% 48%))" />
        </div>

        <div className="section-card">
          <h3 className="font-semibold text-base mb-4" style={{ color: "hsl(var(--foreground))" }}>Recent Evaluations</h3>
          <div className="space-y-3">
            {evals.filter((e) => e.rating !== null).slice(0, 4).map((e) => (
              <div key={e.id} className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: "hsl(var(--border))" }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "hsl(var(--primary))" }}>
                    {e.internName.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "hsl(var(--foreground))" }}>{e.internName}</p>
                    <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{e.taskTitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full" style={{ background: "hsl(var(--warning-light))" }}>
                  <Star size={11} style={{ color: "hsl(var(--warning))" }} fill="hsl(var(--warning))" />
                  <span className="text-xs font-bold" style={{ color: "hsl(var(--warning))" }}>{e.rating}/10</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}