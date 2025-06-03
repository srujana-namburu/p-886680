
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Star, Users, Upload, X, Loader } from "lucide-react";
import { useAllJobs } from "@/hooks/useSupabaseData";
import { applicationService, resumeService } from "@/services/supabaseService";
import { useToast } from "@/hooks/use-toast";
import type { JobPosting, Application } from "@/types/database";

const ResumeMatcherForm = () => {
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [jobApplications, setJobApplications] = useState<Application[]>([]);
  const [uploadedResumes, setUploadedResumes] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingResumes, setUploadingResumes] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const { data: jobs = [] } = useAllJobs();

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

  const canAnalyze = jobDescription.trim() && requirements.trim() && responsibilities.trim();

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
              disabled={!canAnalyze}
            >
              <Star className="w-4 h-4 mr-2" />
              Analyze Resumes with AI
            </Button>
            {!canAnalyze && (
              <p className="text-red-400 text-sm mt-2">
                Please fill in all required fields to proceed with analysis.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Candidate Resumes */}
      {selectedJob && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Candidates for {selectedJob.title}
              <Badge variant="secondary" className="ml-2 bg-slate-700 text-slate-200">
                {jobApplications.length} resumes
              </Badge>
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
                          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
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
