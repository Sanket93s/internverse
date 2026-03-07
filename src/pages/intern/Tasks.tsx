import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { TaskCard } from "@/components/TaskCard";
import { api, mockTasks } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Filter } from "lucide-react";

type Status = "All" | "Pending" | "Submitted" | "Evaluated";

export default function Tasks() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<typeof mockTasks>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status>("All");

  useEffect(() => {
    api.fetchTasks(user?.id).then((t) => { setTasks(t); setLoading(false); });
  }, [user]);

  const filtered = filter === "All" ? tasks : tasks.filter((t) => t.status === filter);

  const STATUS_OPTIONS: Status[] = ["All", "Pending", "Submitted", "Evaluated"];

  return (
    <DashboardLayout title="My Tasks">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="page-title">My Tasks</h2>
            <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
              {tasks.length} tasks assigned · {tasks.filter(t => t.status === "Pending").length} pending
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Filter size={15} style={{ color: "hsl(var(--muted-foreground))" }} />
            <div className="flex gap-1.5">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: filter === s ? "hsl(var(--primary))" : "hsl(var(--muted))",
                    color: filter === s ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3].map(i => <div key={i} className="h-44 rounded-xl bg-muted animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="section-card text-center py-16">
            <p className="text-lg font-semibold mb-2" style={{ color: "hsl(var(--foreground))" }}>No tasks found</p>
            <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>No {filter !== "All" ? filter.toLowerCase() : ""} tasks available.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                description={task.description}
                deadline={task.deadline}
                status={task.status as "Pending" | "Submitted" | "Evaluated"}
                submissionLink={task.submissionLink}
                onSubmit={() => navigate(`/intern/submit?taskId=${task.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
