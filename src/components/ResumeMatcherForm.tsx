
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Star, Users } from "lucide-react";
import { useAllJobs } from "@/hooks/useSupabaseData";
import { applicationService } from "@/services/supabaseService";
import type { JobPosting, Application } from "@/types/database";

const ResumeMatcherForm = () => {
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [jobApplications, setJobApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  
  const { data: jobs = [] } = useAllJobs();

  const handleJobSelect = async (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    if (job) {
      setSelectedJob(job);
      setLoading(true);
      
      try {
        const applications = await applicationService.getJobApplicationsWithResumes(jobId);
        setJobApplications(applications);
      } catch (error) {
        console.error('Error fetching job applications:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDownloadResume = async (application: Application) => {
    if (!application.resume_url) return;

    try {
      // Create a download link
      const link = document.createElement('a');
      link.href = application.resume_url;
      link.download = application.resume_filename || 'resume.pdf';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">AI Resume Matcher</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Job Selection */}
          <div className="space-y-2">
            <label className="text-slate-200 text-sm font-medium">Select Job Position</label>
            <Select onValueChange={handleJobSelect}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder="Choose a job position..." />
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

          {/* Auto-filled Job Details */}
          {selectedJob && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-slate-200 text-sm font-medium">Job Description</label>
                <Textarea
                  value={selectedJob.description}
                  readOnly
                  className="bg-slate-700 border-slate-600 text-slate-200 min-h-[120px]"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-slate-200 text-sm font-medium">Requirements</label>
                <Textarea
                  value={selectedJob.requirements}
                  readOnly
                  className="bg-slate-700 border-slate-600 text-slate-200 min-h-[120px]"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-slate-200 text-sm font-medium">Key Responsibilities</label>
                <Textarea
                  value={selectedJob.responsibilities || 'No responsibilities specified'}
                  readOnly
                  className="bg-slate-700 border-slate-600 text-slate-200 min-h-[120px]"
                />
              </div>
            </div>
          )}

          {/* AI Analysis Button */}
          {selectedJob && jobApplications.length > 0 && (
            <div className="text-center">
              <Button className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700">
                <Star className="w-4 h-4 mr-2" />
                Analyze Resumes with AI
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Candidate Resumes */}
      {selectedJob && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5" />
              Candidates for {selectedJob.title}
              <Badge variant="secondary" className="ml-2">
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
                          className="border-slate-600 text-slate-200 hover:bg-slate-700"
                          onClick={() => handleDownloadResume(application)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          View
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
