import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { api, mockEvaluations } from "@/services/api";
import { CheckCircle, ExternalLink, Star } from "lucide-react";

type Eval = typeof mockEvaluations[0];

export default function EvaluateTasks() {
  const [evals, setEvals] = useState<Eval[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<Record<string, { rating: number; feedback: string }>>({});
  const [submitted, setSubmitted] = useState<Set<string>>(new Set());
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    api.fetchEvaluations()
      .then((d) => {
        const safe = Array.isArray(d) && d.length ? d : mockEvaluations;
        setEvals(safe);
        const initial: Record<string, { rating: number; feedback: string }> = {};
        safe.forEach((e) => {
          initial[e.id] = { rating: e.rating || 5, feedback: e.feedback || "" };
        });
        setRatings(initial);
      })
      .catch(() => {
        setEvals(mockEvaluations);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (evalId: string) => {
    const data = ratings[evalId];
    if (!data) return;
    setSubmitting(evalId);
    try {
      await api.submitEvaluation({ evaluationId: evalId, ...data });
      setSubmitted((prev) => new Set([...prev, evalId]));
    } finally {
      setSubmitting(null);
    }
  };

  const setField = (id: string, field: "rating" | "feedback", value: string | number) => {
    setRatings((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };

  return (
    <DashboardLayout title="Evaluate Tasks">
      <div className="space-y-6 animate-fade-in">
        <div>
          <h2 className="page-title">Evaluate Submissions</h2>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            Review intern submissions and provide ratings and feedback.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />)}
          </div>
        ) : evals.length === 0 ? (
          <div className="section-card text-center py-16">
            <p className="font-semibold" style={{ color: "hsl(var(--foreground))" }}>No submissions to evaluate</p>
          </div>
        ) : (
          <div className="space-y-4">
            {evals.map((ev) => {
              const isNew = ev.rating === null;
              return (
                <div key={ev.id} className="section-card">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b" style={{ borderColor: "hsl(var(--border))" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: "hsl(var(--primary))" }}>
                        {ev.internName.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-semibold" style={{ color: "hsl(var(--foreground))" }}>{ev.internName}</p>
                        <p className="text-xs" style={{ color: "hsl(var(--muted-foreground))" }}>{ev.taskTitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {ev.submissionLink && (
                        <a href={ev.submissionLink} target="_blank" rel="noopener noreferrer" className="btn-secondary text-xs py-1.5 flex items-center gap-1">
                          <ExternalLink size={12} /> View Submission
                        </a>
                      )}
                      {isNew ? <span className="badge-pending">Pending Review</span> : <span className="badge-evaluated">Evaluated</span>}
                    </div>
                  </div>

                  {submitted.has(ev.id) ? (
                    <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: "hsl(var(--success-light))" }}>
                      <CheckCircle size={16} style={{ color: "hsl(var(--success))" }} />
                      <span className="text-sm font-medium" style={{ color: "hsl(var(--success))" }}>
                        Evaluation submitted! Rating: {ratings[ev.id]?.rating}/10
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="form-label">Rating (1-10)</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="range"
                            min={1}
                            max={10}
                            step={1}
                            value={ratings[ev.id]?.rating || 5}
                            onChange={(e) => setField(ev.id, "rating", Number(e.target.value))}
                            className="flex-1 accent-primary"
                          />
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg min-w-[60px] justify-center" style={{ background: "hsl(var(--warning-light))" }}>
                            <Star size={13} style={{ color: "hsl(var(--warning))" }} fill="hsl(var(--warning))" />
                            <span className="font-bold text-sm" style={{ color: "hsl(var(--warning))" }}>{ratings[ev.id]?.rating || 5}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="form-label">Feedback</label>
                        <textarea
                          className="form-input resize-none"
                          rows={3}
                          placeholder="Provide constructive feedback for the intern..."
                          value={ratings[ev.id]?.feedback || ""}
                          onChange={(e) => setField(ev.id, "feedback", e.target.value)}
                        />
                      </div>

                      <button onClick={() => handleSubmit(ev.id)} disabled={submitting === ev.id} className="btn-primary">
                        {submitting === ev.id ? (
                          <span className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 border-2 border-current border-r-transparent rounded-full animate-spin" />
                            Submitting...
                          </span>
                        ) : "Submit Evaluation"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}