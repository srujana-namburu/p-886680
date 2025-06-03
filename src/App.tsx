
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          <Route path="/jobseeker/dashboard" element={<JobSeekerDashboard />} />
          <Route path="/jobseeker/applications" element={<JobSeekerApplications />} />
          <Route path="/jobseeker/profile" element={<JobSeekerProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
