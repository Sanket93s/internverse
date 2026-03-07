import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { api, mockInterns } from "@/services/api";
import { Star, TrendingUp } from "lucide-react";

export default function PerformanceReports() {
  const [interns, setInterns] = useState<typeof mockInterns>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.fetchInterns()
      .then((d) => {
        setInterns(Array.isArray(d) && d.length ? d : mockInterns);
      })
      .catch(() => {
        setInterns(mockInterns);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const sorted = [...interns].sort((a, b) => b.score - a.score);
  const avgScore = interns.length ? Math.round(interns.reduce((a, b) => a + b.score, 0) / interns.length) : 0;

  const getScoreColor = (score: number) =>
    score >= 90 ? "hsl(var(--success))" : score >= 75 ? "hsl(var(--primary))" : score >= 60 ? "hsl(var(--warning))" : "hsl(var(--destructive))";

  const getScoreLabel = (score: number) =>
    score >= 90 ? "Excellent" : score >= 75 ? "Good" : score >= 60 ? "Average" : "Needs Improvement";

  return (
    <DashboardLayout title="Performance Reports">
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="page-title">Performance Reports</h2>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            Detailed performance analysis for all interns.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: "Program Average", value: `${avgScore}%`, color: "hsl(var(--primary))", bg: "hsl(var(--primary-light))" },
            { label: "Top Performer", value: sorted[0]?.score ? `${sorted[0].score}%` : "-", color: "hsl(var(--success))", bg: "hsl(var(--success-light))" },
            { label: "Needs Attention", value: `${interns.filter((i) => i.score < 70).length}`, color: "hsl(var(--destructive))", bg: "hsl(0 84% 97%)" },
          ].map((s) => (
            <div key={s.label} className="section-card flex items-center gap-4">
              <div className="p-3 rounded-xl" style={{ background: s.bg }}>
                <TrendingUp size={18} style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: s.color }}>{loading ? "-" : s.value}</p>
                <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="section-card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-base" style={{ color: "hsl(var(--foreground))" }}>Performance Leaderboard</h3>
            <Star size={16} style={{ color: "hsl(var(--warning))" }} />
          </div>
          <div className="space-y-3">
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />)
            ) : sorted.map((intern, idx) => (
              <div key={intern.id} className="flex items-center gap-4 p-3.5 rounded-xl border" style={{ borderColor: "hsl(var(--border))" }}>
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: idx === 0 ? "hsl(38 92% 50%)" : idx === 1 ? "hsl(220 15% 60%)" : idx === 2 ? "hsl(25 80% 55%)" : "hsl(var(--muted-foreground))" }}
                >
                  {idx + 1}
                </span>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: "hsl(var(--primary))" }}>
                  {intern.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm" style={{ color: "hsl(var(--foreground))" }}>{intern.name}</p>
                  <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{intern.domain}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 rounded-full bg-muted overflow-hidden hidden sm:block">
                    <div className="h-full rounded-full transition-all" style={{ width: `${intern.score}%`, background: getScoreColor(intern.score) }} />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: getScoreColor(intern.score) }}>{intern.score}%</p>
                    <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{getScoreLabel(intern.score)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}