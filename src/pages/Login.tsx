import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { Eye, EyeOff, LogIn, UserPlus, KeyRound } from "lucide-react";
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

type Mode = "signin" | "signup";

export default function Login() {
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("intern");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetRole, setResetRole] = useState<UserRole>("intern");
  const [newPassword, setNewPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === "signup" && !name.trim())) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        await signup(name.trim(), email.trim(), password, role);
      } else {
        await login(email.trim(), password, role);
      }
      navigate(ROLE_REDIRECT[role], { replace: true });
    } catch (err: any) {
      const message = err?.response?.data?.message;
      setError(typeof message === "string" && message ? message : "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openReset = () => {
    setResetEmail(email.trim());
    setResetRole(role);
    setNewPassword("");
    setResetMessage("");
    setShowReset(true);
  };

  const handleResetPassword = async () => {
    if (!resetEmail || !newPassword) {
      setResetMessage("Please enter email and new password.");
      return;
    }

    setResetLoading(true);
    setResetMessage("");
    try {
      const res = await api.forgotPassword(resetEmail.trim(), resetRole, newPassword);
      setResetMessage(res.message || "Password updated. You can now sign in.");
      setPassword(newPassword);
      setRole(resetRole);
      setEmail(resetEmail.trim());
    } catch (err: any) {
      const message = err?.response?.data?.message;
      setResetMessage(typeof message === "string" && message ? message : "Failed to reset password.");
    } finally {
      setResetLoading(false);
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
            <span className="text-white text-2xl font-bold">Internverse</span>
          </div>
          <h2 className="text-5xl xl:text-6xl font-bold text-white mb-5 leading-tight">
            Manage internships<br />with confidence.
          </h2>
          <p className="text-xl leading-relaxed" style={{ color: "hsl(220 20% 70%)" }}>
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
        <div className="w-full max-w-lg animate-fade-in">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <BrandLogo size="sm" />
            <span className="font-bold text-lg" style={{ color: "hsl(var(--foreground))" }}>Internverse</span>
          </div>

          <div className="mb-7">
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="px-4 py-2 rounded-lg text-base font-medium"
                style={{
                  background: mode === "signin" ? "hsl(var(--primary))" : "hsl(var(--muted))",
                  color: mode === "signin" ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="px-4 py-2 rounded-lg text-base font-medium"
                style={{
                  background: mode === "signup" ? "hsl(var(--primary))" : "hsl(var(--muted))",
                  color: mode === "signup" ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                }}
              >
                Sign Up
              </button>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-3" style={{ color: "hsl(var(--foreground))" }}>
              {mode === "signup" ? "Create account" : "Welcome back"}
            </h1>
            <p className="text-xl" style={{ color: "hsl(var(--muted-foreground))" }}>
              {mode === "signup" ? "Register your Internverse account" : "Sign in to your Internverse account"}
            </p>
          </div>

          <div className="mb-7">
            <label className="form-label !text-lg">Continue as</label>
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
                  <p className="text-lg font-semibold" style={{ color: role === r.value ? r.color : "hsl(var(--foreground))" }}>
                    {r.label}
                  </p>
                  <p className="text-base mt-1 leading-snug" style={{ color: "hsl(var(--muted-foreground))" }}>
                    {r.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="form-label !text-lg">Full name</label>
                <input
                  type="text"
                  className="form-input text-base py-3.5"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            )}

            <div>
              <label className="form-label !text-lg">Email address</label>
              <input
                type="email"
                className="form-input text-base py-3.5"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="form-label !mb-0 !text-base">Password</label>
                {mode === "signin" && (
                  <button type="button" onClick={openReset} className="text-base font-medium" style={{ color: "hsl(var(--primary))" }}>
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  className="form-input pr-10 text-base py-3.5"
                  placeholder={mode === "signup" ? "Minimum 6 characters" : "Enter your password"}
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

            {showReset && (
              <div className="rounded-xl border p-4 space-y-3" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--card))" }}>
                <div className="flex items-center gap-2">
                  <KeyRound size={18} style={{ color: "hsl(var(--primary))" }} />
                  <p className="text-lg font-semibold">Reset Password</p>
                </div>

                <input
                  type="email"
                  className="form-input text-base py-3"
                  placeholder="Account email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />

                <select
                  className="form-input text-base py-3"
                  value={resetRole}
                  onChange={(e) => setResetRole(e.target.value as UserRole)}
                >
                  <option value="intern">Intern</option>
                  <option value="admin">Admin</option>
                  <option value="hr">HR Manager</option>
                </select>

                <input
                  type="password"
                  className="form-input text-base py-3"
                  placeholder="New password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                <div className="flex gap-2">
                  <button type="button" onClick={handleResetPassword} disabled={resetLoading} className="btn-primary text-base px-4 py-2.5">
                    {resetLoading ? "Updating..." : "Update Password"}
                  </button>
                  <button type="button" onClick={() => setShowReset(false)} className="btn-secondary text-base px-4 py-2.5">
                    Close
                  </button>
                </div>

                {resetMessage && (
                  <p className="text-base" style={{ color: resetMessage.toLowerCase().includes("updated") ? "hsl(var(--success))" : "hsl(var(--destructive))" }}>
                    {resetMessage}
                  </p>
                )}
              </div>
            )}

            {error && (
              <div className="text-base px-3 py-2.5 rounded-lg" style={{ background: "hsl(var(--destructive) / 0.1)", color: "hsl(var(--destructive))" }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg mt-2"
              style={{ background: loading ? "hsl(var(--muted))" : "hsl(var(--primary))", color: loading ? "hsl(var(--muted-foreground))" : "hsl(var(--primary-foreground))" }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                  {mode === "signup" ? "Creating account..." : "Signing in..."}
                </span>
              ) : mode === "signup" ? (
                <span className="flex items-center justify-center gap-2">
                  <UserPlus size={17} />
                  Create Account
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <LogIn size={17} />
                  Sign In
                </span>
              )}
            </button>
          </form>

          <p className="text-lg mt-6 text-center" style={{ color: "hsl(var(--muted-foreground))" }}>
            Demo credentials: intern@internverse.com, admin@internverse.com, hr@internverse.com with password123.
          </p>
        </div>
      </div>
    </div>
  );
}
