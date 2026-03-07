import { Calendar, ExternalLink, Clock } from "lucide-react";

interface TaskCardProps {
  title: string;
  description: string;
  deadline: string;
  status: "Pending" | "Submitted" | "Evaluated";
  submissionLink?: string;
  onSubmit?: () => void;
}

const STATUS_STYLES: Record<string, string> = {
  Pending: "badge-pending",
  Submitted: "badge-submitted",
  Evaluated: "badge-evaluated",
};

const STATUS_DOT: Record<string, string> = {
  Pending: "hsl(var(--warning))",
  Submitted: "hsl(var(--primary))",
  Evaluated: "hsl(var(--success))",
};

export function TaskCard({ title, description, deadline, status, submissionLink, onSubmit }: TaskCardProps) {
  const isOverdue = new Date(deadline) < new Date() && status === "Pending";

  return (
    <div className="section-card hover:shadow-card-hover transition-shadow duration-200 animate-fade-in">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="font-semibold text-base leading-snug" style={{ color: "hsl(var(--foreground))" }}>
          {title}
        </h3>
        <span className={STATUS_STYLES[status]}>
          <span
            className="w-1.5 h-1.5 rounded-full mr-1.5 inline-block"
            style={{ background: STATUS_DOT[status] }}
          />
          {status}
        </span>
      </div>

      <p className="text-sm mb-4 line-clamp-2" style={{ color: "hsl(var(--muted-foreground))" }}>
        {description}
      </p>

      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: "hsl(var(--border))" }}>
        <div className="flex items-center gap-1.5 text-xs" style={{ color: isOverdue ? "hsl(var(--destructive))" : "hsl(var(--muted-foreground))" }}>
          {isOverdue ? <Clock size={13} /> : <Calendar size={13} />}
          <span>{isOverdue ? "Overdue · " : "Due · "}{new Date(deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
        </div>

        <div className="flex items-center gap-2">
          {submissionLink && (
            <a
              href={submissionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs font-medium"
              style={{ color: "hsl(var(--primary))" }}
            >
              <ExternalLink size={12} /> View
            </a>
          )}
          {status === "Pending" && onSubmit && (
            <button onClick={onSubmit} className="btn-primary px-3 py-1.5 text-xs">
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
