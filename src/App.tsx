import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Pages
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Intern Pages
import InternDashboard from "./pages/intern/Dashboard";
import InternTasks from "./pages/intern/Tasks";
import InternSubmitTask from "./pages/intern/SubmitTask";
import InternPerformance from "./pages/intern/Performance";
import InternCertificate from "./pages/intern/Certificate";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminManageInterns from "./pages/admin/ManageInterns";
import AdminAssignTask from "./pages/admin/AssignTask";
import AdminSubmissions from "./pages/admin/Submissions";
import AdminReports from "./pages/admin/Reports";

// HR Pages
import HRDashboard from "./pages/hr/Dashboard";
import HREvaluateTasks from "./pages/hr/EvaluateTasks";
import HRPerformanceReports from "./pages/hr/PerformanceReports";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Intern Routes */}
            <Route path="/intern" element={<ProtectedRoute role="intern"><InternDashboard /></ProtectedRoute>} />
            <Route path="/intern/tasks" element={<ProtectedRoute role="intern"><InternTasks /></ProtectedRoute>} />
            <Route path="/intern/submit" element={<ProtectedRoute role="intern"><InternSubmitTask /></ProtectedRoute>} />
            <Route path="/intern/performance" element={<ProtectedRoute role="intern"><InternPerformance /></ProtectedRoute>} />
            <Route path="/intern/certificate" element={<ProtectedRoute role="intern"><InternCertificate /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/interns" element={<ProtectedRoute role="admin"><AdminManageInterns /></ProtectedRoute>} />
            <Route path="/admin/assign-task" element={<ProtectedRoute role="admin"><AdminAssignTask /></ProtectedRoute>} />
            <Route path="/admin/submissions" element={<ProtectedRoute role="admin"><AdminSubmissions /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute role="admin"><AdminReports /></ProtectedRoute>} />

            {/* HR Routes */}
            <Route path="/hr" element={<ProtectedRoute role="hr"><HRDashboard /></ProtectedRoute>} />
            <Route path="/hr/evaluate" element={<ProtectedRoute role="hr"><HREvaluateTasks /></ProtectedRoute>} />
            <Route path="/hr/reports" element={<ProtectedRoute role="hr"><HRPerformanceReports /></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
