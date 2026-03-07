import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { api, mockTasks } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, Send } from "lucide-react";

export default function SubmitTask() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const preSelected = searchParams.get("taskId") || "";

  const [tasks, setTasks] = useState<typeof mockTasks>([]);
  const [selectedTask, setSelectedTask] = useState(preSelected);
  const [link, setLink] = useState("");
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.fetchTasks(user?.id).then((t) => {
      setTasks(t.filter((x) => x.status === "Pending"));
    });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !link) return;
    setSubmitting(true);
    try {
      await api.submitTask({ taskId: selectedTask, submissionLink: link, comments });
      setSuccess(true);
      setLink("");
      setComments("");
      setSelectedTask("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedTaskData = tasks.find((t) => t.id === selectedTask);

  return (
    <DashboardLayout title="Submit Task">
      <div className="max-w-2xl animate-fade-in">
        <div className="mb-6">
          <h2 className="page-title">Submit Task</h2>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            Submit your work with a GitHub or Drive link for evaluation.
          </p>
        </div>

        {success ? (
          <div className="section-card flex flex-col items-center py-14 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "hsl(var(--success-light))" }}>
              <CheckCircle size={32} style={{ color: "hsl(var(--success))" }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "hsl(var(--foreground))" }}>Task Submitted!</h3>
            <p className="text-sm mb-6" style={{ color: "hsl(var(--muted-foreground))" }}>Your submission has been received and will be reviewed by HR.</p>
            <button className="btn-primary" onClick={() => setSuccess(false)}>
              Submit Another Task
            </button>
          </div>
        ) : (
          <div className="section-card">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="form-label">Select Task *</label>
                <select
                  className="form-input"
                  value={selectedTask}
                  onChange={(e) => setSelectedTask(e.target.value)}
                  required
                >
                  <option value="">— Choose a task —</option>
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
                {tasks.length === 0 && (
                  <p className="text-xs mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>No pending tasks available.</p>
                )}
              </div>

              {selectedTaskData && (
                <div className="p-4 rounded-lg border" style={{ background: "hsl(var(--accent))", borderColor: "hsl(var(--primary) / 0.2)" }}>
                  <p className="text-sm font-semibold mb-1" style={{ color: "hsl(var(--primary))" }}>{selectedTaskData.title}</p>
                  <p className="text-xs mb-1" style={{ color: "hsl(var(--muted-foreground))" }}>{selectedTaskData.description}</p>
                  <p className="text-xs font-medium" style={{ color: "hsl(var(--foreground))" }}>
                    Deadline: {new Date(selectedTaskData.deadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </p>
                </div>
              )}

              <div>
                <label className="form-label">Submission Link * <span className="font-normal text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>(GitHub / Google Drive)</span></label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://github.com/username/project"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="form-label">Comments <span className="font-normal text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>(optional)</span></label>
                <textarea
                  className="form-input resize-none"
                  rows={4}
                  placeholder="Any notes about your submission…"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                      Submitting…
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={15} />
                      Submit Task
                    </span>
                  )}
                </button>
                <button type="reset" className="btn-secondary" onClick={() => { setSelectedTask(""); setLink(""); setComments(""); }}>
                  Clear
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
