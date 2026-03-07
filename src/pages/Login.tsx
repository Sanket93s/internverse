import { useState } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Eye, EyeOff, LogIn } from "lucide-react";
import loginHero from "@/assets/login-hero.png";
import { BrandLogo } from "@/components/BrandLogo";

const ROLES: { value: UserRole; label: string; desc: string; color: string }[] = [
  { value: "intern", label: "Intern", desc: "Access your tasks & performance", color: "hsl(221 83% 53%)" },
  { value: "admin", label: "Admin", desc: "Manage interns & assignments", color: "hsl(38 92% 50%)" },
  { value: "hr", label: "HR Manager", desc: "Evaluate & generate reports", color: "hsl(142 71% 45%)" },
];

const ROLE_REDIRECT: Record<UserRole, string> = {
  intern: "/intern",
  admin: "/admin",
  hr: "/hr",
};

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("intern");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await login(email, password, role);
      // Force a clean reload after login to prevent stale route state blank screens.
      window.location.assign(ROLE_REDIRECT[role]);
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "hsl(var(--background))" }}>
      <div
        className="hidden lg:flex flex-col justify-between w-[48%] p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(222 47% 14%) 0%, hsl(221 60% 22%) 100%)" }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <BrandLogo />
            <span className="text-white text-xl font-bold">Internverse</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Manage internships<br />with confidence.
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "hsl(220 20% 70%)" }}>
            A complete platform for intern onboarding, task tracking, evaluations, and performance analytics - all in one place.
          </p>
        </div>

        <img
          src={loginHero}
          alt="Internverse platform"
          className="relative z-10 w-full rounded-2xl object-cover shadow-2xl"
          style={{ maxHeight: 360 }}
        />

        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10" style={{ background: "hsl(var(--primary))" }} />
        <div className="absolute -bottom-20 -left-10 w-48 h-48 rounded-full opacity-10" style={{ background: "hsl(var(--primary))" }} />
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md animate-fade-in">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <BrandLogo size="sm" />
            <span className="font-bold text-lg" style={{ color: "hsl(var(--foreground))" }}>Internverse</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: "hsl(var(--foreground))" }}>Welcome back</h1>
            <p className="text-base" style={{ color: "hsl(var(--muted-foreground))" }}>Sign in to your Internverse account</p>
          </div>

          <div className="mb-6">
            <label className="form-label">Sign in as</label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className="p-3 rounded-xl border-2 text-left transition-all duration-150"
                  style={{
                    borderColor: role === r.value ? r.color : "hsl(var(--border))",
                    background: role === r.value ? `${r.color}15` : "hsl(var(--card))",
                  }}
                >
                  <p className="text-xs font-semibold" style={{ color: role === r.value ? r.color : "hsl(var(--foreground))" }}>
                    {r.label}
                  </p>
                  <p className="text-xs mt-0.5 leading-tight" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {r.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-input"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="form-label !mb-0">Password</label>
                <button type="button" className="text-xs font-medium" style={{ color: "hsl(var(--primary))" }}>
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  className="form-input pr-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{ color: "hsl(var(--muted-foreground))" }}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm px-3 py-2 rounded-lg" style={{ background: "hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive))" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base mt-2"
              style={{ background: loading ? "hsl(var(--muted))" : "hsl(var(--primary))", color: loading ? "hsl(var(--muted-foreground))" : "hsl(var(--primary-foreground))" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn size={17} />
                  Sign In
                </span>
              )}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: "hsl(var(--muted-foreground))" }}>
            Demo: Use any email & password with your selected role.
          </p>
        </div>
      </div>
    </div>
  );
}