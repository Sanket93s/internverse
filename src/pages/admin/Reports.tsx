import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { api, mockInterns } from "@/services/api";
import { TrendingUp, Users, Award, BarChart2 } from "lucide-react";

export default function Reports() {
  const [interns, setInterns] = useState<typeof mockInterns>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.fetchInterns().then((d) => { setInterns(d); setLoading(false); }); }, []);

  const avgScore = interns.length
    ? Math.round(interns.reduce((a, b) => a + b.score, 0) / interns.length)
    : 0;

  const domainGroups = interns.reduce<Record<string, number>>((acc, i) => {
    acc[i.domain] = (acc[i.domain] || 0) + 1;
    return acc;
  }, {});

  return (
    <DashboardLayout title="Reports">
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="page-title">Internship Reports</h2>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            Overview of internship program performance and statistics.
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Total Interns", value: interns.length, icon: Users, color: "hsl(var(--primary))", bg: "hsl(var(--primary-light))" },
            { label: "Active", value: interns.filter(i => i.status === "Active").length, icon: TrendingUp, color: "hsl(var(--success))", bg: "hsl(var(--success-light))" },
            { label: "Completed", value: interns.filter(i => i.status === "Completed").length, icon: Award, color: "hsl(262 83% 58%)", bg: "hsl(262 83% 95%)" },
            { label: "Avg. Score", value: `${avgScore}%`, icon: BarChart2, color: "hsl(var(--warning))", bg: "hsl(var(--warning-light))" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="section-card flex items-center gap-4">
                <div className="p-3 rounded-xl" style={{ background: s.bg }}>
                  <Icon size={20} style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: "hsl(var(--foreground))" }}>{loading ? "—" : s.value}</p>
                  <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Domain breakdown */}
          <div className="section-card">
            <h3 className="font-semibold text-base mb-5" style={{ color: "hsl(var(--foreground))" }}>Interns by Domain</h3>
            <div className="space-y-3">
              {Object.entries(domainGroups).map(([domain, count]) => {
                const pct = Math.round((count / interns.length) * 100);
                return (
                  <div key={domain}>
                    <div className="flex justify-between text-sm mb-1">
                      <span style={{ color: "hsl(var(--foreground))" }}>{domain}</span>
                      <span style={{ color: "hsl(var(--muted-foreground))" }}>{count} intern{count > 1 ? "s" : ""}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "hsl(var(--primary))" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Score Table */}
          <div className="section-card overflow-x-auto p-0">
            <div className="px-6 py-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
              <h3 className="font-semibold text-base" style={{ color: "hsl(var(--foreground))" }}>Individual Scores</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "hsl(var(--border))" }}>
                  {["Intern", "Domain", "Status", "Score"].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide" style={{ color: "hsl(var(--muted-foreground))" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  [1,2,3].map(i => <tr key={i}><td colSpan={4} className="px-4 py-3"><div className="h-6 rounded bg-muted animate-pulse" /></td></tr>)
                ) : [...interns].sort((a, b) => b.score - a.score).map((intern) => (
                  <tr key={intern.id} className="border-b hover:bg-muted/40 transition-colors" style={{ borderColor: "hsl(var(--border))" }}>
                    <td className="px-4 py-2.5 font-medium" style={{ color: "hsl(var(--foreground))" }}>{intern.name}</td>
                    <td className="px-4 py-2.5 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{intern.domain}</td>
                    <td className="px-4 py-2.5">
                      <span className={intern.status === "Active" ? "badge-active" : intern.status === "Completed" ? "badge-evaluated" : "badge-inactive"}>
                        {intern.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-bold" style={{ color: intern.score >= 80 ? "hsl(var(--success))" : intern.score >= 60 ? "hsl(var(--warning))" : "hsl(var(--destructive))" }}>
                      {intern.score}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
