import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { api, mockInterns } from "@/services/api";
import { CheckCircle, ClipboardList } from "lucide-react";

export default function AssignTask() {
  const [interns, setInterns] = useState<typeof mockInterns>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", deadline: "", internId: "" });

  useEffect(() => { api.fetchInterns().then((d) => { setInterns(d.filter(i => i.status === "Active")); setLoading(false); }); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.internId || !form.deadline) return;
    setSubmitting(true);
    try {
      await api.assignTask(form);
      setSuccess(true);
      setForm({ title: "", description: "", deadline: "", internId: "" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout title="Assign Tasks">
      <div className="max-w-2xl animate-fade-in">
        <div className="mb-6">
          <h2 className="page-title">Assign Task</h2>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            Create and assign a new task to an active intern.
          </p>
        </div>

        {success && (
          <div className="flex items-center gap-3 p-4 rounded-xl mb-5 border" style={{ background: "hsl(var(--success-light))", borderColor: "hsl(var(--success) / 0.2)" }}>
            <CheckCircle size={18} style={{ color: "hsl(var(--success))" }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: "hsl(var(--success))" }}>Task assigned successfully!</p>
              <p className="text-xs" style={{ color: "hsl(var(--success))" }}>The intern has been notified.</p>
            </div>
          </div>
        )}

        <div className="section-card">
          <div className="flex items-center gap-2 mb-5 pb-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
            <div className="p-2 rounded-lg" style={{ background: "hsl(var(--primary-light))" }}>
              <ClipboardList size={16} style={{ color: "hsl(var(--primary))" }} />
            </div>
            <span className="font-semibold" style={{ color: "hsl(var(--foreground))" }}>New Task Details</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="form-label">Task Title *</label>
              <input className="form-input" placeholder="e.g. Build REST API Documentation" required
                value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>

            <div>
              <label className="form-label">Description</label>
              <textarea className="form-input resize-none" rows={4}
                placeholder="Describe what the intern needs to do…"
                value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Deadline *</label>
                <input type="date" className="form-input" required
                  value={form.deadline} onChange={(e) => setForm(p => ({ ...p, deadline: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Assign to Intern *</label>
                {loading ? (
                  <div className="form-input bg-muted animate-pulse h-10" />
                ) : (
                  <select className="form-input" required
                    value={form.internId} onChange={(e) => setForm(p => ({ ...p, internId: e.target.value }))}>
                    <option value="">— Select intern —</option>
                    {interns.map((i) => (
                      <option key={i.id} value={i.id}>{i.name} — {i.domain}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                    Assigning…
                  </span>
                ) : "Assign Task"}
              </button>
              <button type="reset" className="btn-secondary" onClick={() => setForm({ title: "", description: "", deadline: "", internId: "" })}>
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
