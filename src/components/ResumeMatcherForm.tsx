import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Star, Users, Upload, X, Loader, User, CheckCircle, XCircle, Briefcase } from "lucide-react";
import { useAllJobs } from "@/hooks/useSupabaseData";
import { applicationService, resumeService, jobService } from "@/services/supabaseService";
import { useToast } from "@/hooks/use-toast";
import type { JobPosting, Application, ApplicationStatus, JobStatus } from "@/types/database";
import { Progress } from "@/components/ui/progress";

const ResumeMatcherForm = () => {
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [jobApplications, setJobApplications] = useState<Application[]>([]);
  const [uploadedResumes, setUploadedResumes] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingResumes, setUploadingResumes] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [topNResumes, setTopNResumes] = useState<number>(5);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const { data: jobs = [], refetch: refetchJobs } = useAllJobs();

  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const downloadResumeAsFile = async (application: Application): Promise<File | null> => {
    if (!application.resume_url) return null;

    try {
      const response = await fetch(application.resume_url);
      if (!response.ok) throw new Error('Failed to fetch resume');
      
      const blob = await response.blob();
      const filename = application.resume_filename || `${application.candidate?.full_name || 'candidate'}_resume.pdf`;
      
      return new File([blob], filename, { type: blob.type });
    } catch (error) {
      console.error('Error downloading resume for auto-upload:', error);
      return null;
    }
  };

  const handleJobSelect = async (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      setSelectedJob(job);
      setJobDescription(job.description);
      setRequirements(job.requirements);
      setResponsibilities(job.responsibilities || '');
      setLoading(true);
      setUploadingResumes(true);
      
      try {
        // Fetch applications with resumes for this job
        const applications = await applicationService.getJobApplicationsWithResumes(jobId);
        setJobApplications(applications);

        // Auto-upload all resumes from these applications
        if (applications.length > 0) {
          const resumeFiles: File[] = [];
          
          for (const application of applications) {
            if (application.resume_url) {
              const file = await downloadResumeAsFile(application);
              if (file) {
                resumeFiles.push(file);
              }
            }
          }
          
          if (resumeFiles.length > 0) {
            setUploadedResumes(prev => [...prev, ...resumeFiles]);
            toast({
              title: "Success",
              description: `Automatically uploaded ${resumeFiles.length} resumes from job applications.`,
            });
          } else {
            toast({
              title: "Info",
              description: "No resumes found for this job position.",
            });
          }
        }
      } catch (error) {
        console.error('Error fetching job applications:', error);
        toast({
          title: "Error",
          description: "Failed to fetch job applications.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        setUploadingResumes(false);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const resumeFiles = files.filter(file => 
      file.type === 'application/pdf' || 
      file.type === 'application/msword' || 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    
    if (resumeFiles.length !== files.length) {
      toast({
        title: "Warning",
        description: "Some files were skipped. Only PDF and Word documents are allowed.",
        variant: "destructive",
      });
    }
    
    setUploadedResumes(prev => [...prev, ...resumeFiles]);
  };

  const removeUploadedResume = (index: number) => {
    setUploadedResumes(prev => prev.filter((_, i) => i !== index));
  };

  const handleDownloadResume = async (application: Application) => {
    if (!application.resume_url) {
      toast({
        title: "Error",
        description: "No resume available for download.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(application.resume_url);
      if (!response.ok) {
        throw new Error('Failed to fetch resume');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = application.resume_filename || `resume_${application.candidate?.full_name || 'candidate'}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Resume download started.",
      });
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast({
        title: "Error",
        description: "Failed to download resume.",
        variant: "destructive",
      });
    }
  };

  const handleViewResume = (application: Application) => {
    if (!application.resume_url) {
      toast({
        title: "Error",
        description: "No resume available to view.",
        variant: "destructive",
      });
      return;
    }

    window.open(application.resume_url, '_blank', 'noopener,noreferrer');
  };

  const handleApplicationStatusUpdate = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, newStatus);
      // Update the local state
      setJobApplications(prev => 
        prev.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      toast({
        title: "Success",
        description: "Application status updated successfully.",
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status.",
        variant: "destructive",
      });
    }
  };

  const handleJobStatusUpdate = async (jobId: string, newStatus: JobStatus) => {
    try {
      await jobService.updateJob(jobId, { status: newStatus });
      
      // If job is being closed, reject remaining candidates
      if (newStatus === 'closed' && analysisResults.length > 0) {
        await rejectRemainingCandidates(jobId);
      }
      
      setSelectedJob(prev => prev ? { ...prev, status: newStatus } : null);
      refetchJobs();
      
      toast({
        title: "Success",
        description: `Job status updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating job status:', error);
      toast({
        title: "Error",
        description: "Failed to update job status.",
        variant: "destructive",
      });
    }
  };

  const rejectRemainingCandidates = async (jobId: string) => {
    try {
      // Get top N candidate filenames from analysis results
      const topNCandidates = analysisResults.slice(0, topNResumes).map(result => result.filename);
      
      // Find applications that are not in top N and still pending
      const applicationsToReject = jobApplications.filter(app => {
        const filename = app.resume_filename;
        return (
          app.status === 'pending' && 
          filename && 
          !topNCandidates.includes(filename)
        );
      });

      // Update status for each application
      for (const application of applicationsToReject) {
        await applicationService.updateApplicationStatus(
          application.id, 
          'rejected',
          'Not qualified during the initial screening round - resume did not meet the minimum requirements for this position'
        );
      }

      if (applicationsToReject.length > 0) {
        toast({
          title: "Success",
          description: `${applicationsToReject.length} candidates were automatically rejected.`,
        });
      }
    } catch (error) {
      console.error('Error rejecting remaining candidates:', error);
      toast({
        title: "Error",
        description: "Failed to reject remaining candidates.",
        variant: "destructive",
      });
    }
  };

  const canAnalyze = jobDescription.trim() && requirements.trim() && responsibilities.trim();

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResults([]);
    try {
      const formData = new FormData();
      // Combine all fields for JD
      const combinedJD = `${jobDescription}\nRequirements:\n${requirements}\nKey Responsibilities:\n${responsibilities}`;
      formData.append("jd", combinedJD);
      formData.append("top_n", topNResumes.toString());
      uploadedResumes.forEach((file) => {
        formData.append("resumes", file, file.name);
      });
      // You may need to update the URL below to your backend endpoint
      const response = await fetch("http://localhost:5002/analyze", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to analyze resumes");
      }
      const data = await response.json();
      setAnalysisResults(data);
    } catch (err: any) {
      setAnalysisError(err.message || "Unknown error");
    } finally {
      setAnalyzing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'shortlisted': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'interviewed': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'selected': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'active': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'closed': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'paused': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">AI Resume Matcher</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Job Selection - Optional */}
          <div className="space-y-2">
            <label className="text-slate-200 text-sm font-medium">Select Job Position (Optional)</label>
            <Select onValueChange={handleJobSelect}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Choose a job position to auto-fill fields..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title} - {job.location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Manual Job Details - All Required */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-slate-200 text-sm font-medium">
                Job Description <span className="text-red-400">*</span>
              </label>
              <Textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Enter job description..."
                className="bg-slate-700 border-slate-600 text-slate-200 min-h-[120px]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-slate-200 text-sm font-medium">
                Requirements <span className="text-red-400">*</span>
              </label>
              <Textarea
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Enter job requirements..."
                className="bg-slate-700 border-slate-600 text-slate-200 min-h-[120px]"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-slate-200 text-sm font-medium">
                Key Responsibilities <span className="text-red-400">*</span>
              </label>
              <Textarea
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                placeholder="Enter key responsibilities..."
                className="bg-slate-700 border-slate-600 text-slate-200 min-h-[120px]"
                required
              />
            </div>
          </div>

          {/* Top N Resumes Input */}
          <div className="space-y-2">
            <label className="text-slate-200 text-sm font-medium">
              Number of Top Resumes to Display (Optional)
            </label>
            <Input
              type="number"
              value={topNResumes}
              onChange={(e) => setTopNResumes(parseInt(e.target.value) || 5)}
              placeholder="5"
              min="1"
              max="50"
              className="bg-slate-700 border-slate-600 text-slate-200 w-32"
            />
            <p className="text-slate-400 text-xs">Default: 5 resumes</p>
          </div>

          {/* Resume Upload Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-slate-200 text-sm font-medium">
                Upload Additional Resumes
                {uploadingResumes && (
                  <span className="ml-2 text-blue-400 text-xs flex items-center gap-1">
                    <Loader className="w-3 h-3 animate-spin" />
                    Auto-uploading resumes...
                  </span>
                )}
              </label>
              <Button
                type="button"
                variant="outline"
                className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-slate-800"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingResumes}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Resumes
              </Button>
            </div>
            
            <Input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />

            {uploadedResumes.length > 0 && (
              <div className="space-y-2">
                <p className="text-slate-300 text-sm">Uploaded Resumes ({uploadedResumes.length}):</p>
                <div className="grid gap-2 max-h-40 overflow-y-auto">
                  {uploadedResumes.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-700/30 rounded-lg border border-slate-600/50">
                      <span className="text-slate-200 text-sm truncate">{file.name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1"
                        onClick={() => removeUploadedResume(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* AI Analysis Button */}
          <div className="text-center">
            <Button 
              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white"
              disabled={!canAnalyze || analyzing}
              onClick={handleAnalyze}
            >
              {analyzing ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Star className="w-4 h-4 mr-2" />
              )}
              Analyze Resumes with AI
            </Button>
            {!canAnalyze && (
              <p className="text-red-400 text-sm mt-2">
                Please fill in all required fields to proceed with analysis.
              </p>
            )}
            {analysisError && (
              <p className="text-red-400 text-sm mt-2">{analysisError}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Job Status Mini View */}
      {selectedJob && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Job Status Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
              <div>
                <h3 className="text-lg font-semibold text-white">{selectedJob.title}</h3>
                <p className="text-slate-300">{selectedJob.location}</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge className={`${getStatusColor(selectedJob.status)} border px-3 py-1`}>
                  {selectedJob.status.charAt(0).toUpperCase() + selectedJob.status.slice(1)}
                </Badge>
                <Select
                  value={selectedJob.status}
                  onValueChange={(value: JobStatus) => handleJobStatusUpdate(selectedJob.id, value)}
                >
                  <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-700 border-slate-600">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Analysis Results with Candidate Mini Views */}
      {analysisResults.length > 0 && (
        <Card className="bg-slate-800 border-slate-700 mt-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              AI Resume Match Results (Top {Math.min(topNResumes, analysisResults.length)})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6">
              {analysisResults.slice(0, topNResumes).map((result, idx) => {
                // Find the corresponding application
                const application = jobApplications.find(app => app.resume_filename === result.filename);
                
                return (
                  <div key={idx} className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50">
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Resume Analysis Card */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-400" />
                          <span className="text-slate-200 font-medium truncate">{result.filename}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400 text-xs">Match:</span>
                          <span className="text-lg font-bold text-green-400">{result.match_percent}%</span>
                        </div>
                        <Progress value={result.match_percent} className="h-2 bg-slate-600" />
                      </div>

                      {/* Candidate Mini View */}
                      {application && (
                        <div className="p-3 bg-slate-600/30 rounded-lg border border-slate-500/30">
                          <div className="flex items-center gap-2 mb-2">
                            <User className="h-4 w-4 text-slate-400" />
                            <span className="text-white font-medium">
                              {application.candidate?.full_name || 'Unknown Candidate'}
                            </span>
                          </div>
                          <p className="text-slate-300 text-sm mb-2">
                            {application.candidate?.email}
                          </p>
                          <div className="flex items-center justify-between">
                            <Badge className={`${getStatusColor(application.status)} border px-2 py-1 text-xs`}>
                              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                            </Badge>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-500 text-blue-400 hover:bg-blue-500/10 px-2 py-1 text-xs"
                                onClick={() => handleApplicationStatusUpdate(application.id, 'shortlisted')}
                                disabled={application.status === 'shortlisted'}
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Shortlist
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-red-500 text-red-400 hover:bg-red-500/10 px-2 py-1 text-xs"
                                onClick={() => handleApplicationStatusUpdate(application.id, 'rejected')}
                                disabled={application.status === 'rejected'}
                              >
                                <XCircle className="h-3 w-3 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Candidate Resumes Section */}
      {selectedJob && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              All Candidates for {selectedJob.title}
              <span className="ml-2 bg-slate-700 text-slate-200 rounded px-2 py-1 text-xs">{jobApplications.length} resumes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="text-slate-400">Loading candidate resumes...</div>
              </div>
            ) : jobApplications.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-slate-400 mb-2">No resumes found</h3>
                <p className="text-slate-500">No candidates have applied with resumes for this position yet.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {jobApplications.map((application) => (
                  <div
                    key={application.id}
                    className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:bg-slate-700/50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <h4 className="font-semibold text-white mb-1">
                          {application.candidate?.full_name || 'Unknown Candidate'}
                        </h4>
                        <p className="text-slate-300 text-sm mb-2">
                          {application.candidate?.email}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span>Applied: {new Date(application.applied_at).toLocaleDateString()}</span>
                          <Badge className={`${getStatusColor(application.status)} border px-2 py-1 text-xs`}>
                            {application.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-slate-800"
                          onClick={() => handleViewResume(application)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-slate-800"
                          onClick={() => handleDownloadResume(application)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ResumeMatcherForm;
