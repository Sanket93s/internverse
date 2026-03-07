import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { api, mockInterns } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Download, Award, CheckCircle, Lock } from "lucide-react";

export default function Certificate() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [intern, setIntern] = useState<typeof mockInterns[0] | null>(null);

  useEffect(() => {
    setTimeout(() => {
      const found = mockInterns.find((i) => i.id === (user?.id || "intern-1")) || mockInterns[0];
      setIntern(found);
      setLoading(false);
    }, 600);
  }, [user]);

  const isCompleted = intern?.status === "Completed";

  const handleDownload = async () => {
    if (!user) return;
    setDownloading(true);
    try {
      const result = await api.downloadCertificate(user.id);
      console.log("Certificate URL:", result.url);
      // In production, this would open/download the PDF
      window.alert(`Certificate download initiated!\nURL: ${result.url}`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <DashboardLayout title="Certificate">
      <div className="max-w-2xl animate-fade-in">
        <div className="mb-6">
          <h2 className="page-title">Certificate of Completion</h2>
          <p className="text-sm mt-1" style={{ color: "hsl(var(--muted-foreground))" }}>
            Download your internship completion certificate upon finishing the program.
          </p>
        </div>

        {loading ? (
          <div className="h-64 rounded-2xl bg-muted animate-pulse" />
        ) : isCompleted ? (
          <div className="section-card">
            {/* Certificate Preview */}
            <div
              className="rounded-xl p-10 text-center mb-6 relative overflow-hidden border-2"
              style={{
                background: "linear-gradient(135deg, hsl(221 83% 53% / 0.06), hsl(262 83% 58% / 0.08))",
                borderColor: "hsl(var(--primary) / 0.3)",
              }}
            >
              <div className="absolute top-4 left-4 w-12 h-12 rounded-full opacity-10" style={{ background: "hsl(var(--primary))" }} />
              <div className="absolute bottom-4 right-4 w-16 h-16 rounded-full opacity-10" style={{ background: "hsl(262 83% 58%)" }} />

              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ background: "hsl(var(--primary))" }}>
                <Award size={28} className="text-white" />
              </div>

              <p className="text-sm font-medium mb-2" style={{ color: "hsl(var(--muted-foreground))" }}>CERTIFICATE OF COMPLETION</p>
              <h3 className="text-2xl font-bold mb-1" style={{ color: "hsl(var(--foreground))" }}>{user?.name}</h3>
              <p className="text-sm mb-3" style={{ color: "hsl(var(--muted-foreground))" }}>
                has successfully completed the internship program in
              </p>
              <p className="text-lg font-semibold mb-3" style={{ color: "hsl(var(--primary))" }}>{intern?.domain}</p>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
                  {intern?.startDate} — {intern?.endDate}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-center gap-1.5 px-4 py-2 rounded-full inline-flex mx-auto" style={{ background: "hsl(var(--success-light))" }}>
                <CheckCircle size={14} style={{ color: "hsl(var(--success))" }} />
                <span className="text-xs font-semibold" style={{ color: "hsl(var(--success))" }}>Performance Score: {intern?.score}%</span>
              </div>
            </div>

            <button onClick={handleDownload} disabled={downloading} className="btn-primary w-full py-3">
              {downloading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                  Preparing Certificate…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Download size={16} />
                  Download Certificate (PDF)
                </span>
              )}
            </button>
          </div>
        ) : (
          <div className="section-card text-center py-14">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "hsl(var(--muted))" }}>
              <Lock size={24} style={{ color: "hsl(var(--muted-foreground))" }} />
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: "hsl(var(--foreground))" }}>Certificate Not Available</h3>
            <p className="text-sm mb-4 max-w-sm mx-auto" style={{ color: "hsl(var(--muted-foreground))" }}>
              Your certificate will be available once you complete your internship program and all evaluations are finalized.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: "hsl(var(--warning-light))" }}>
              <span className="text-xs font-semibold" style={{ color: "hsl(var(--warning))" }}>
                Status: {intern?.status}
              </span>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
