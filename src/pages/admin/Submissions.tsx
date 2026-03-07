import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { api, mockTasks, mockInterns } from "@/services/api";
import { ExternalLink, Search } from "lucide-react";

export default function Submissions() {
  const [submissions, setSubmissions] = useState<typeof mockTasks>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { api.fetchSubmissions().then((d) => { setSubmissions(d); setLoading(false); }); }, []);

  const getInternName = (id: string) => mockInterns.find((i) => i.id === id)?.name || id;

  const filtered = submissions.filter((s) =>
    getInternName(s.assignedTo).toLowerCase().includes(search.toLowerCase()) ||
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Submissions">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="page-title">Submissions</h2>
            <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{filtered.length} total submissions</p>
          </div>
          <div className="relative max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
            <input className="form-input pl-9 text-sm" placeholder="Search submissions…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="section-card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "hsl(var(--border))" }}>
                {["Intern", "Task", "Submission Link", "Deadline", "Status"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "hsl(var(--muted-foreground))" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3].map(i => <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-8 rounded bg-muted animate-pulse" /></td></tr>)
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center" style={{ color: "hsl(var(--muted-foreground))" }}>No submissions found.</td></tr>
              ) : filtered.map((sub) => (
                <tr key={sub.id} className="border-b hover:bg-muted/40 transition-colors" style={{ borderColor: "hsl(var(--border))" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "hsl(var(--primary))" }}>
                        {getInternName(sub.assignedTo).split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="font-medium" style={{ color: "hsl(var(--foreground))" }}>{getInternName(sub.assignedTo)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="font-medium truncate" style={{ color: "hsl(var(--foreground))" }}>{sub.title}</p>
                    {sub.comments && <p className="text-xs truncate mt-0.5" style={{ color: "hsl(var(--muted-foreground))" }}>{sub.comments}</p>}
                  </td>
                  <td className="px-4 py-3">
                    {sub.submissionLink ? (
                      <a href={sub.submissionLink} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-medium" style={{ color: "hsl(var(--primary))" }}>
                        <ExternalLink size={12} /> View Submission
                      </a>
                    ) : <span className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {new Date(sub.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={sub.status === "Submitted" ? "badge-submitted" : "badge-evaluated"}>
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
