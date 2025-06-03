
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobSeekerDashboard from "./pages/jobseeker/Dashboard";
import JobSeekerApplications from "./pages/jobseeker/Applications";
import JobSeekerProfile from "./pages/jobseeker/Profile";
import HRDashboard from "./pages/hr/Dashboard";
import HRCandidates from "./pages/hr/Candidates";
import HRCreateJob from "./pages/hr/CreateJob";
import HREditJob from "./pages/hr/EditJob";
import CandidateProfile from "./pages/hr/CandidateProfile";
import ResumeMatcherAI from "./pages/hr/ResumeMatcherAI";
import InterviewSummary from "./pages/hr/InterviewSummary";
import ChatSummarizer from "./pages/hr/ChatSummarizer";
import BiasDetector from "./pages/hr/BiasDetector";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error && typeof error === 'object' && 'status' in error) {
          const status = (error as any).status;
          if (status >= 400 && status < 500) {
            return false;
          }
        }
        return failureCount < 3;
      },
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* HR Protected Routes */}
            <Route 
              path="/hr/dashboard" 
              element={
                <ProtectedRoute requiredRole="hr_manager">
                  <HRDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hr/candidates" 
              element={
                <ProtectedRoute requiredRole="hr_manager">
                  <HRCandidates />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hr/jobs/create" 
              element={
                <ProtectedRoute requiredRole="hr_manager">
                  <HRCreateJob />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hr/jobs/edit/:id" 
              element={
                <ProtectedRoute requiredRole="hr_manager">
                  <HREditJob />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hr/candidates/:id" 
              element={
                <ProtectedRoute requiredRole="hr_manager">
                  <CandidateProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hr/resume-matcher" 
              element={
                <ProtectedRoute requiredRole="hr_manager">
                  <ResumeMatcherAI />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hr/interview-summary" 
              element={
                <ProtectedRoute requiredRole="hr_manager">
                  <InterviewSummary />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hr/chat-summarizer" 
              element={
                <ProtectedRoute requiredRole="hr_manager">
                  <ChatSummarizer />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/hr/bias-detector" 
              element={
                <ProtectedRoute requiredRole="hr_manager">
                  <BiasDetector />
                </ProtectedRoute>
              } 
            />
            
            {/* Job Seeker Protected Routes */}
            <Route 
              path="/jobseeker/dashboard" 
              element={
                <ProtectedRoute requiredRole="jobseeker">
                  <JobSeekerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/jobseeker/applications" 
              element={
                <ProtectedRoute requiredRole="jobseeker">
                  <JobSeekerApplications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/jobseeker/profile" 
              element={
                <ProtectedRoute requiredRole="jobseeker">
                  <JobSeekerProfile />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
