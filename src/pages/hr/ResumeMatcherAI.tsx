
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Download, Eye, Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import HRNav from "@/components/HRNav";
import { useAllJobs } from "@/hooks/useSupabaseData";
import { applicationService, resumeService } from "@/services/supabaseService";
import { useToast } from "@/hooks/use-toast";
import type { JobPosting, Application } from "@/types/database";

const ResumeMatcherAI = () => {
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  
  const { data: jobs = [], isLoading: jobsLoading } = useAllJobs();
  const { toast } = useToast();

  useEffect(() => {
    if (selectedJob) {
      fetchJobApplications();
    }
  }, [selectedJob]);

  const fetchJobApplications = async () => {
    if (!selectedJob) return;
    
    setLoading(true);
    try {
      const jobApplications = await applicationService.getJobApplicationsWithResumes(selectedJob);
      setApplications(jobApplications);
      console.log(`Found ${jobApplications.length} applications with resumes for job ${selectedJob}`);
    } catch (error) {
      console.error('Error fetching job applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications for this job.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeResumes = async () => {
    if (!selectedJob || applications.length === 0) {
      toast({
        title: "No resumes to analyze",
        description: "Please select a job with applications that include resumes.",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockResults = applications.map((application, index) => ({
        applicationId: application.id,
        candidateName: application.candidate?.full_name || 'Unknown',
        matchScore: Math.floor(Math.random() * 40) + 60, // 60-100%
        keyStrengths: [
          'Strong technical background',
          'Relevant work experience',
          'Good communication skills'
        ],
        gaps: [
          'Limited experience with specific technology',
          'Could benefit from industry certification'
        ],
        recommendation: Math.random() > 0.3 ? 'Recommended for interview' : 'Consider for further review'
      }));
      
      setAnalysisResults(mockResults.sort((a, b) => b.matchScore - a.matchScore));
      setAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: `Analyzed ${applications.length} resumes successfully.`,
      });
    }, 3000);
  };

  const handleDownloadResume = async (application: Application) => {
    if (!application.resume_url) return;

    try {
      const url = new URL(application.resume_url);
      const filePath = url.pathname.split('/').pop();
      
      if (filePath) {
        const blob = await resumeService.downloadResume(filePath);
        if (blob) {
          const downloadUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = application.resume_filename || 'resume.pdf';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(downloadUrl);
          document.body.removeChild(a);
          
          toast({
            title: "Success",
            description: "Resume downloaded successfully.",
          });
        }
      }
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast({
        title: "Error",
        description: "Failed to download resume.",
        variant: "destructive",
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/20 text-green-300 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    return 'bg-red-500/20 text-red-300 border-red-500/30';
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <HRNav />
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/hr/dashboard">
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">AI Resume Matcher</h1>
            <p className="text-slate-400">Analyze and match candidate resumes to job requirements using AI</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-400" />
                  Analysis Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-slate-200 mb-2 block">Select Job Position</Label>
                  <Select value={selectedJob} onValueChange={setSelectedJob}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Choose a job posting" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id} className="text-white">
                          {job.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedJob && (
                  <div className="space-y-4">
                    <div className="text-slate-300 text-sm">
                      <p><strong>Applications found:</strong> {applications.length}</p>
                      <p><strong>With resumes:</strong> {applications.filter(app => app.resume_url).length}</p>
                    </div>

                    <Button
                      onClick={handleAnalyzeResumes}
                      disabled={analyzing || applications.length === 0}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {analyzing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Analyzing...
                        </div>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Analyze Resumes
                        </>
                      )}
                    </Button>

                    {analyzing && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-slate-300">
                          <span>Processing resumes...</span>
                          <span>AI Analysis</span>
                        </div>
                        <Progress value={33} className="bg-slate-700" />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">
                  {analysisResults.length > 0 ? 'Analysis Results' : 'Available Resumes'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="text-slate-400">Loading applications...</div>
                  </div>
                ) : applications.length === 0 && selectedJob ? (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-slate-400 mb-2">No resumes found</h3>
                    <p className="text-slate-500">No applications with resumes for this job position.</p>
                  </div>
                ) : !selectedJob ? (
                  <div className="text-center py-12">
                    <Upload className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-slate-400 mb-2">Select a Job Position</h3>
                    <p className="text-slate-500">Choose a job posting to view and analyze candidate resumes.</p>
                  </div>
                ) : analysisResults.length > 0 ? (
                  <div className="space-y-4">
                    {analysisResults.map((result, index) => (
                      <div key={result.applicationId} className="border border-slate-600 rounded-lg p-4 hover:bg-slate-700/30 transition-colors">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-white text-lg">{result.candidateName}</h3>
                            <Badge className={`${getScoreBadgeColor(result.matchScore)} border mt-1`}>
                              {result.matchScore}% Match
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-600 text-slate-200"
                              onClick={() => {
                                const app = applications.find(a => a.id === result.applicationId);
                                if (app) handleDownloadResume(app);
                              }}
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Resume
                            </Button>
                            <Link to={`/hr/candidates/${result.applicationId}`}>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <Eye className="h-4 w-4 mr-1" />
                                View Profile
                              </Button>
                            </Link>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h4 className="font-medium text-green-400 mb-2">Key Strengths</h4>
                            <ul className="text-slate-300 space-y-1">
                              {result.keyStrengths.map((strength: string, i: number) => (
                                <li key={i} className="flex items-center gap-2">
                                  <div className="w-1 h-1 bg-green-400 rounded-full" />
                                  {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-yellow-400 mb-2">Areas for Development</h4>
                            <ul className="text-slate-300 space-y-1">
                              {result.gaps.map((gap: string, i: number) => (
                                <li key={i} className="flex items-center gap-2">
                                  <div className="w-1 h-1 bg-yellow-400 rounded-full" />
                                  {gap}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-slate-600">
                          <p className="text-slate-300 text-sm">
                            <strong className="text-purple-400">Recommendation:</strong> {result.recommendation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((application) => (
                      <div key={application.id} className="flex justify-between items-center p-4 border border-slate-600 rounded-lg hover:bg-slate-700/30 transition-colors">
                        <div>
                          <h3 className="font-semibold text-white">{application.candidate?.full_name || 'Unknown Candidate'}</h3>
                          <p className="text-slate-400 text-sm">Applied: {new Date(application.applied_at).toLocaleDateString()}</p>
                          {application.resume_filename && (
                            <p className="text-slate-500 text-xs mt-1">Resume: {application.resume_filename}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-600 text-slate-200"
                            onClick={() => handleDownloadResume(application)}
                            disabled={!application.resume_url}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Resume
                          </Button>
                          <Link to={`/hr/candidates/${application.id}`}>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeMatcherAI;
