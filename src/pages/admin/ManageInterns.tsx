import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { api, mockInterns } from "@/services/api";
import { Search, Plus, Pencil, Trash2, X } from "lucide-react";

type Intern = typeof mockInterns[0];

export default function ManageInterns() {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editIntern, setEditIntern] = useState<Intern | null>(null);
  const [form, setForm] = useState({ name: "", email: "", domain: "", status: "Active", startDate: "", endDate: "" });

  useEffect(() => { api.fetchInterns().then((d) => { setInterns(d); setLoading(false); }); }, []);

  const filtered = interns.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.email.toLowerCase().includes(search.toLowerCase()) ||
    i.domain.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditIntern(null); setForm({ name: "", email: "", domain: "", status: "Active", startDate: "", endDate: "" }); setShowModal(true); };
  const openEdit = (intern: Intern) => { setEditIntern(intern); setForm({ name: intern.name, email: intern.email, domain: intern.domain, status: intern.status, startDate: intern.startDate, endDate: intern.endDate }); setShowModal(true); };

  const handleSave = () => {
    if (editIntern) {
      setInterns((prev) => prev.map((i) => i.id === editIntern.id ? { ...i, ...form } : i));
    } else {
      setInterns((prev) => [...prev, { ...form, id: `intern-${Date.now()}`, score: 0 }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Remove this intern?")) setInterns((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <DashboardLayout title="Manage Interns">
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="page-title">Manage Interns</h2>
            <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>{filtered.length} interns found</p>
          </div>
          <button onClick={openAdd} className="btn-primary">
            <Plus size={15} /> Add Intern
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "hsl(var(--muted-foreground))" }} />
          <input
            className="form-input pl-9"
            placeholder="Search by name, email, domain…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="section-card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "hsl(var(--border))" }}>
                {["Intern", "Email", "Domain", "Status", "Period", "Score", "Actions"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: "hsl(var(--muted-foreground))" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3,4].map(i => (
                  <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-8 rounded bg-muted animate-pulse" /></td></tr>
                ))
              ) : filtered.map((intern) => (
                <tr key={intern.id} className="border-b hover:bg-muted/40 transition-colors" style={{ borderColor: "hsl(var(--border))" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ background: "hsl(var(--primary))" }}>
                        {intern.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <span className="font-medium" style={{ color: "hsl(var(--foreground))" }}>{intern.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: "hsl(var(--muted-foreground))" }}>{intern.email}</td>
                  <td className="px-4 py-3" style={{ color: "hsl(var(--foreground))" }}>{intern.domain}</td>
                  <td className="px-4 py-3">
                    <span className={intern.status === "Active" ? "badge-active" : intern.status === "Completed" ? "badge-evaluated" : "badge-inactive"}>
                      {intern.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {intern.startDate} – {intern.endDate}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-semibold" style={{ color: "hsl(var(--primary))" }}>{intern.score}%</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openEdit(intern)} className="p-1.5 rounded-lg hover:bg-muted transition-colors" style={{ color: "hsl(var(--primary))" }}>
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(intern.id)} className="p-1.5 rounded-lg hover:bg-muted transition-colors" style={{ color: "hsl(var(--destructive))" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="section-card w-full max-w-md animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg" style={{ color: "hsl(var(--foreground))" }}>{editIntern ? "Edit Intern" : "Add New Intern"}</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-muted" style={{ color: "hsl(var(--muted-foreground))" }}><X size={16} /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Full Name", key: "name", type: "text", placeholder: "John Doe" },
                { label: "Email", key: "email", type: "email", placeholder: "john@example.com" },
                { label: "Domain", key: "domain", type: "text", placeholder: "Frontend Development" },
                { label: "Start Date", key: "startDate", type: "date", placeholder: "" },
                { label: "End Date", key: "endDate", type: "date", placeholder: "" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="form-label">{f.label}</label>
                  <input type={f.type} className="form-input" placeholder={f.placeholder}
                    value={form[f.key as keyof typeof form]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} />
                </div>
              ))}
              <div>
                <label className="form-label">Status</label>
                <select className="form-input" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                  <option>Active</option><option>Inactive</option><option>Completed</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="btn-primary flex-1">Save</button>
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
