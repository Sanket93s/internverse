import React, { createContext, useContext, useState, useEffect } from "react";

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
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: Record<UserRole, AuthUser> = {
  intern: {
    id: "intern-1",
    name: "Alex Johnson",
    email: "alex@internverse.com",
    role: "intern",
    avatar: "AJ",
  },
  admin: {
    id: "admin-1",
    name: "Sarah Mitchell",
    email: "sarah@internverse.com",
    role: "admin",
    avatar: "SM",
  },
  hr: {
    id: "hr-1",
    name: "James Carter",
    email: "james@internverse.com",
    role: "hr",
    avatar: "JC",
  },
};

const ROLES: UserRole[] = ["intern", "admin", "hr"];

function normalizeStoredUser(raw: unknown): AuthUser | null {
  if (!raw || typeof raw !== "object") return null;

  const data = raw as Partial<AuthUser>;
  if (!data.role || !ROLES.includes(data.role as UserRole)) return null;

  const role = data.role as UserRole;
  const seed = MOCK_USERS[role];

  return {
    id: typeof data.id === "string" && data.id.trim() ? data.id : seed.id,
    name: typeof data.name === "string" && data.name.trim() ? data.name : seed.name,
    email: typeof data.email === "string" && data.email.trim() ? data.email : seed.email,
    role,
    avatar: typeof data.avatar === "string" && data.avatar.trim() ? data.avatar : seed.avatar,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("internverse_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const normalized = normalizeStoredUser(parsed);
        if (normalized) {
          setUser(normalized);
          localStorage.setItem("internverse_user", JSON.stringify(normalized));
        } else {
          localStorage.removeItem("internverse_user");
        }
      } catch {
        localStorage.removeItem("internverse_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, _password: string, role: UserRole) => {
    await new Promise((r) => setTimeout(r, 800));
    const mockUser = MOCK_USERS[role];
    const loggedIn = { ...mockUser, email };
    setUser(loggedIn);
    localStorage.setItem("internverse_user", JSON.stringify(loggedIn));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("internverse_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}