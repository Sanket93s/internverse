import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("internverse_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  }

  const user = localStorage.getItem("internverse_user");
  if (user) {
    const parsed = JSON.parse(user);
    if (parsed?.id) {
      config.headers.Authorization = `Bearer mock-token-${parsed.id}`;
    }
  }
  return config;
});

export type UserRole = "intern" | "admin" | "hr";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
};

export type LoginResponse = {
  success: boolean;
  token: string;
  user: AuthUser;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: "Pending" | "Submitted" | "Evaluated";
  assignedTo: string;
  submissionLink: string;
  comments: string;
};

export type Intern = {
  id: string;
  name: string;
  email: string;
  domain: string;
  status: string;
  startDate: string;
  endDate: string;
  score: number;
};

export type Evaluation = {
  id: string;
  internId: string;
  internName: string;
  taskId: string;
  taskTitle: string;
  submissionLink: string;
  rating: number | null;
  feedback: string;
  date: string;
};

export const mockTasks: Task[] = [
  { id: "t1", title: "Build REST API Documentation", description: "Write comprehensive API docs for the user module using Swagger.", deadline: "2025-07-20", status: "Pending", assignedTo: "intern-1", submissionLink: "", comments: "" },
  { id: "t2", title: "UI Component Library", description: "Create a reusable component library using React and Storybook.", deadline: "2025-07-25", status: "Submitted", assignedTo: "intern-1", submissionLink: "https://github.com/alex/ui-lib", comments: "All components done" },
  { id: "t3", title: "Database Schema Design", description: "Design ER diagram and schema for the analytics module.", deadline: "2025-07-30", status: "Evaluated", assignedTo: "intern-1", submissionLink: "https://drive.google.com/file/xyz", comments: "" },
  { id: "t4", title: "Mobile Responsive Testing", description: "Test all pages for mobile responsiveness and fix issues.", deadline: "2025-08-05", status: "Pending", assignedTo: "intern-2", submissionLink: "", comments: "" },
  { id: "t5", title: "Authentication Module", description: "Implement JWT authentication with refresh tokens.", deadline: "2025-08-10", status: "Submitted", assignedTo: "intern-2", submissionLink: "https://github.com/nina/auth-module", comments: "Using passport.js" },
];

export const mockInterns: Intern[] = [
  { id: "intern-1", name: "Alex Johnson", email: "alex@internverse.com", domain: "Frontend Development", status: "Active", startDate: "2025-06-01", endDate: "2025-08-31", score: 87 },
  { id: "intern-2", name: "Nina Patel", email: "nina@internverse.com", domain: "Backend Development", status: "Active", startDate: "2025-06-01", endDate: "2025-08-31", score: 92 },
  { id: "intern-3", name: "Carlos Rivera", email: "carlos@internverse.com", domain: "Data Science", status: "Completed", startDate: "2025-03-01", endDate: "2025-05-31", score: 95 },
  { id: "intern-4", name: "Priya Singh", email: "priya@internverse.com", domain: "UI/UX Design", status: "Active", startDate: "2025-06-15", endDate: "2025-09-15", score: 78 },
  { id: "intern-5", name: "Leo Zhang", email: "leo@internverse.com", domain: "DevOps", status: "Inactive", startDate: "2025-05-01", endDate: "2025-07-31", score: 65 },
];

export const mockEvaluations: Evaluation[] = [
  { id: "e1", internId: "intern-1", internName: "Alex Johnson", taskId: "t2", taskTitle: "UI Component Library", submissionLink: "https://github.com/alex/ui-lib", rating: 9, feedback: "Excellent work! Clean code and well-documented components.", date: "2025-07-18" },
  { id: "e2", internId: "intern-1", internName: "Alex Johnson", taskId: "t3", taskTitle: "Database Schema Design", submissionLink: "https://drive.google.com/file/xyz", rating: 8, feedback: "Good schema design, could improve normalization.", date: "2025-07-28" },
  { id: "e3", internId: "intern-2", internName: "Nina Patel", taskId: "t5", taskTitle: "Authentication Module", submissionLink: "https://github.com/nina/auth-module", rating: null, feedback: "", date: "" },
];

const fallback = async <T>(fn: () => Promise<T>, mock: T): Promise<T> => {
  try {
    return await fn();
  } catch {
    return mock;
  }
};

export const api = {
  login: async (email: string, password: string, role: UserRole): Promise<LoginResponse> => {
    const { data } = await apiClient.post("/auth/login", { email, password, role });
    return data;
  },

  signup: async (name: string, email: string, password: string, role: UserRole): Promise<LoginResponse> => {
    const { data } = await apiClient.post("/auth/signup", { name, email, password, role });
    return data;
  },

  forgotPassword: async (email: string, role: UserRole, newPassword: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.post("/auth/forgot-password", { email, role, newPassword });
    return data;
  },

  fetchTasks: async (internId?: string): Promise<Task[]> => {
    return fallback(
      async () => {
        const { data } = await apiClient.get("/tasks", { params: internId ? { internId } : undefined });
        return data;
      },
      internId ? mockTasks.filter((t) => t.assignedTo === internId) : mockTasks,
    );
  },

  submitTask: async (data: { taskId: string; submissionLink: string; comments: string }) => {
    const res = await apiClient.post("/tasks/submit", data);
    return res.data;
  },

  fetchInterns: async (): Promise<Intern[]> => {
    return fallback(
      async () => {
        const { data } = await apiClient.get("/interns");
        return data;
      },
      mockInterns,
    );
  },

  addIntern: async (data: Omit<Intern, "id" | "score">): Promise<Intern> => {
    const res = await apiClient.post("/interns", data);
    return res.data;
  },

  assignTask: async (data: { title: string; description: string; deadline: string; internId: string }) => {
    const res = await apiClient.post("/tasks/assign", data);
    return res.data;
  },

  fetchSubmissions: async (): Promise<Task[]> => {
    return fallback(
      async () => {
        const { data } = await apiClient.get("/submissions");
        return data;
      },
      mockTasks.filter((t) => t.status === "Submitted" || t.status === "Evaluated"),
    );
  },

  fetchEvaluations: async (): Promise<Evaluation[]> => {
    return fallback(
      async () => {
        const { data } = await apiClient.get("/evaluations");
        return data;
      },
      mockEvaluations,
    );
  },

  submitEvaluation: async (data: { evaluationId: string; rating: number; feedback: string }) => {
    const res = await apiClient.post("/evaluations/submit", data);
    return res.data;
  },

  downloadCertificate: async (internId: string): Promise<{ url: string }> => {
    return fallback(
      async () => {
        const { data } = await apiClient.get(`/certificates/${internId}`);
        return data;
      },
      { url: `http://localhost:8081/api/certificates/${internId}.pdf` },
    );
  },

  fetchPerformance: async (internId: string) => {
    return fallback(
      async () => {
        const { data } = await apiClient.get(`/performance/${internId}`);
        return data;
      },
      {
        score: mockInterns.find((i) => i.id === internId)?.score || 0,
        totalTasks: mockTasks.filter((t) => t.assignedTo === internId).length,
        completed: mockTasks.filter((t) => t.assignedTo === internId && t.status === "Evaluated").length,
        submitted: mockTasks.filter((t) => t.assignedTo === internId && t.status === "Submitted").length,
        pending: mockTasks.filter((t) => t.assignedTo === internId && t.status === "Pending").length,
        ratings: mockEvaluations
          .filter((e) => e.internId === internId && e.rating !== null)
          .map((e) => ({ task: e.taskTitle, rating: e.rating as number, feedback: e.feedback })),
      },
    );
  },
};

export default apiClient;


