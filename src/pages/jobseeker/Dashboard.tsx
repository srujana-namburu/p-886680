import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import JobSeekerNav from "@/components/JobSeekerNav";
import AIChat from "@/components/AIChat";
import { useJobs, useUserApplications } from "@/hooks/useSupabaseData";
import { applicationService, jobService } from "@/services/supabaseService";
import { useAuth } from "@/hooks/useAuth";
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Building, 
  ChevronDown, 
  ChevronUp, 
  Filter,
  Heart,
  Eye,
  Briefcase,
  Users,
  Star,
  Upload,
  FileText
} from "lucide-react";

const JobSeekerDashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());
  const [applyingToJob, setApplyingToJob] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [currentJob, setCurrentJob] = useState<any>(null);
  
  const [filters, setFilters] = useState({
    jobType: "",
    experience: "",
    location: ""
  });

  // Fetch real data from database
  const { data: jobs = [], isLoading: jobsLoading, error: jobsError, refetch: refetchJobs } = useJobs();
  const { data: userApplications = [], refetch: refetchApplications } = useUserApplications();

  const toggleJobExpansion = (jobId: string) => {
    console.log('Toggling job expansion for job ID:', jobId);
    const newExpanded = new Set(expandedJobs);
    if (newExpanded.has(jobId)) {
      newExpanded.delete(jobId);
      console.log('Job collapsed:', jobId);
    } else {
      newExpanded.add(jobId);
      console.log('Job expanded:', jobId);
      // Increment view count when job is viewed
      jobService.incrementJobViews(jobId);
    }
    setExpandedJobs(newExpanded);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleApplyToJob = (job: any) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to apply for jobs.",
        variant: "destructive",
      });
      return;
    }

    // Check if already applied
    const hasApplied = userApplications.some(app => app.job_id === job.id);
    if (hasApplied) {
      toast({
        title: "Already applied",
        description: "You have already applied to this job.",
        variant: "destructive",
      });
      return;
    }

    setCurrentJob(job);
    setShowApplicationModal(true);
  };

  const submitApplication = async () => {
    if (!currentJob || !user) return;

    setApplyingToJob(currentJob.id);

    try {
      // For now, we'll save the application without file upload
      // In a real app, you'd upload the file to Supabase Storage first
      const applicationData = {
        job_id: currentJob.id,
        cover_letter: coverLetter,
        resume_filename: selectedFile?.name,
        // resume_url would be set after file upload
      };

      const result = await applicationService.createApplication(applicationData);

      if (result) {
        toast({
          title: "Application submitted!",
          description: "Your application has been submitted successfully.",
        });
        setShowApplicationModal(false);
        setCoverLetter("");
        setSelectedFile(null);
        setCurrentJob(null);
        // Refetch user applications to update the UI
        refetchApplications();
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setApplyingToJob(null);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (job.company_id && job.company_id.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = !filters.jobType || job.job_type === filters.jobType;
    const matchesExperience = !filters.experience || job.experience_level === filters.experience;
    const matchesLocation = !filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase());
    
    return matchesSearch && matchesType && matchesExperience && matchesLocation;
  });

  if (jobsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <JobSeekerNav />
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-white text-lg">Loading jobs...</div>
          </div>
        </div>
      </div>
    );
  }

  if (jobsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <JobSeekerNav />
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-red-400 text-lg">Error loading jobs. Please try again later.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <JobSeekerNav />
      
      <div className="container mx-auto px-6 py-8">
        {/* Hero Search Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Find Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Dream Job</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8">Discover amazing opportunities with AI-powered matching</p>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search for jobs, companies, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 text-lg"
                />
              </div>
              <Button
                variant="outline"
                className="h-14 px-6 border-blue-400/30 text-blue-300 hover:bg-blue-500/10"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </Button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-lg mb-6 animate-in slide-in-from-top-5 duration-300">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Job Type</label>
                      <select
                        value={filters.jobType}
                        onChange={(e) => setFilters({...filters, jobType: e.target.value})}
                        className="w-full h-10 bg-white/10 border-white/20 text-white rounded-md px-3"
                      >
                        <option value="">All Types</option>
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="remote">Remote</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Experience</label>
                      <select
                        value={filters.experience}
                        onChange={(e) => setFilters({...filters, experience: e.target.value})}
                        className="w-full h-10 bg-white/10 border-white/20 text-white rounded-md px-3"
                      >
                        <option value="">All Levels</option>
                        <option value="entry-level">Entry-level</option>
                        <option value="mid-level">Mid-level</option>
                        <option value="senior">Senior</option>
                        <option value="executive">Executive</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Location</label>
                      <Input
                        placeholder="Enter location"
                        value={filters.location}
                        onChange={(e) => setFilters({...filters, location: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        className="w-full border-slate-400/30 text-slate-300 hover:bg-slate-500/10"
                        onClick={() => setFilters({jobType: "", experience: "", location: ""})}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Job Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Briefcase className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{filteredJobs.length}</div>
              <div className="text-slate-300 text-sm">Available Jobs</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Building className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{userApplications.length}</div>
              <div className="text-slate-300 text-sm">Your Applications</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {userApplications.filter(app => app.status === 'shortlisted').length}
              </div>
              <div className="text-slate-300 text-sm">Shortlisted</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">
                {userApplications.filter(app => app.status === 'selected').length}
              </div>
              <div className="text-slate-300 text-sm">Selected</div>
            </CardContent>
          </Card>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredJobs.map((job, index) => {
            const isExpanded = expandedJobs.has(job.id);
            const hasApplied = userApplications.some(app => app.job_id === job.id);
            
            return (
              <Card 
                key={job.id}
                className="bg-white/5 border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl animate-in slide-in-from-bottom-5"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-white">{job.title}</h3>
                        {hasApplied && (
                          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                            Applied
                          </Badge>
                        )}
                        {job.is_featured && (
                          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-slate-300 mb-3">
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          <span>{job.company_id || 'Company'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(job.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                          {job.job_type}
                        </Badge>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
                          {job.experience_level}
                        </Badge>
                        {job.salary_min && job.salary_max && (
                          <div className="flex items-center gap-1 text-green-400">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-semibold">
                              {job.currency} {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        className="border-blue-400/30 text-blue-300 hover:bg-blue-500/10"
                        onClick={() => toggleJobExpansion(job.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {isExpanded ? 'Hide' : 'View'} Details
                        {isExpanded ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-white/10 pt-6 space-y-6 animate-in slide-in-from-top-5 duration-300">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Job Description</h4>
                        <p className="text-slate-300 leading-relaxed">{job.description}</p>
                      </div>
                      
                      {job.responsibilities && (
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Key Responsibilities</h4>
                          <p className="text-slate-300 leading-relaxed">{job.responsibilities}</p>
                        </div>
                      )}
                      
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-3">Requirements</h4>
                        <p className="text-slate-300 leading-relaxed">{job.requirements}</p>
                      </div>

                      {job.department && (
                        <div>
                          <h4 className="text-lg font-semibold text-white mb-3">Department</h4>
                          <p className="text-slate-300">{job.department}</p>
                        </div>
                      )}
                      
                      <div className="flex justify-end pt-4">
                        <Button
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 transition-all duration-300 transform hover:scale-105 px-8"
                          onClick={() => handleApplyToJob(job)}
                          disabled={hasApplied || !user}
                        >
                          {hasApplied ? 'Already Applied' : 'Apply Now'}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredJobs.length === 0 && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
            <CardContent className="p-12 text-center">
              <Search className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">No jobs found</h3>
              <p className="text-slate-300">Try adjusting your search criteria or filters</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Application Modal */}
      {showApplicationModal && currentJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-slate-800 border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white">Apply to {currentJob.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-slate-200 text-sm font-medium mb-2 block">Cover Letter</label>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full h-32 bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2 resize-none"
                  placeholder="Write a brief cover letter..."
                />
              </div>
              
              <div>
                <label className="text-slate-200 text-sm font-medium mb-2 block">Resume (PDF)</label>
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-2 text-green-400">
                      <FileText className="h-5 w-5" />
                      <span>{selectedFile.name}</span>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-400 mb-2">Click to upload your resume</p>
                      <Button
                        variant="outline"
                        className="border-slate-600 text-slate-200"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Choose File
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  className="border-slate-600 text-slate-200"
                  onClick={() => {
                    setShowApplicationModal(false);
                    setCoverLetter("");
                    setSelectedFile(null);
                    setCurrentJob(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={submitApplication}
                  disabled={applyingToJob === currentJob.id}
                >
                  {applyingToJob === currentJob.id ? 'Submitting...' : 'Submit Application'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Chat Component */}
      <AIChat />
    </div>
  );
};

export default JobSeekerDashboard;
