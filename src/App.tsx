
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
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
            <Route path="/hr/dashboard" element={<HRDashboard />} />
            <Route path="/hr/candidates" element={<HRCandidates />} />
            <Route path="/hr/jobs/create" element={<HRCreateJob />} />
            <Route path="/hr/jobs/edit/:id" element={<HREditJob />} />
            <Route path="/hr/candidates/:id" element={<CandidateProfile />} />
            <Route path="/hr/resume-matcher" element={<ResumeMatcherAI />} />
            <Route path="/hr/interview-summary" element={<InterviewSummary />} />
            <Route path="/hr/chat-summarizer" element={<ChatSummarizer />} />
            <Route path="/hr/bias-detector" element={<BiasDetector />} />
            <Route path="/jobseeker/dashboard" element={<JobSeekerDashboard />} />
            <Route path="/jobseeker/applications" element={<JobSeekerApplications />} />
            <Route path="/jobseeker/profile" element={<JobSeekerProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
