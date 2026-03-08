import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/services/api";

export type UserRole = "intern" | "admin" | "hr";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ROLES: UserRole[] = ["intern", "admin", "hr"];
const ROLE_FALLBACK: Record<UserRole, { id: string; name: string; avatar: string }> = {
  intern: { id: "intern-1", name: "Alex Johnson", avatar: "AJ" },
  admin: { id: "admin-1", name: "Sarah Mitchell", avatar: "SM" },
  hr: { id: "hr-1", name: "James Carter", avatar: "JC" },
};

function normalizeStoredUser(raw: unknown): AuthUser | null {
  if (!raw || typeof raw !== "object") return null;

  const data = raw as Partial<AuthUser>;
  if (!data.role || !ROLES.includes(data.role as UserRole)) return null;

  const role = data.role as UserRole;
  const fallback = ROLE_FALLBACK[role];

  return {
    id: typeof data.id === "string" && data.id.trim() ? data.id : fallback.id,
    name: typeof data.name === "string" && data.name.trim() ? data.name : fallback.name,
    email: typeof data.email === "string" && data.email.trim() ? data.email : "",
    role,
    avatar: typeof data.avatar === "string" && data.avatar.trim() ? data.avatar : fallback.avatar,
  };
}

function persistAuth(loggedIn: AuthUser, token: string, setUser: (u: AuthUser) => void) {
  setUser(loggedIn);
  localStorage.setItem("internverse_token", token);
  localStorage.setItem("internverse_user", JSON.stringify(loggedIn));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("internverse_token");
    const stored = localStorage.getItem("internverse_user");

    if (token && stored) {
      try {
        const parsed = JSON.parse(stored);
        const normalized = normalizeStoredUser(parsed);
        if (normalized && normalized.email) {
          setUser(normalized);
          localStorage.setItem("internverse_user", JSON.stringify(normalized));
        } else {
          localStorage.removeItem("internverse_user");
          localStorage.removeItem("internverse_token");
        }
      } catch {
        localStorage.removeItem("internverse_user");
        localStorage.removeItem("internverse_token");
      }
    } else {
      localStorage.removeItem("internverse_user");
      localStorage.removeItem("internverse_token");
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: UserRole) => {
    const response = await api.login(email, password, role);
    const loggedIn = normalizeStoredUser(response.user);
    if (!loggedIn || !loggedIn.email) {
      throw new Error("Invalid login response");
    }

    persistAuth(loggedIn, response.token, setUser);
  };

  const signup = async (name: string, email: string, password: string, role: UserRole) => {
    const response = await api.signup(name, email, password, role);
    const loggedIn = normalizeStoredUser(response.user);
    if (!loggedIn || !loggedIn.email) {
      throw new Error("Invalid signup response");
    }

    persistAuth(loggedIn, response.token, setUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("internverse_user");
    localStorage.removeItem("internverse_token");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
