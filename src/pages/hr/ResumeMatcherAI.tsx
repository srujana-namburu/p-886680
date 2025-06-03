
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Brain, Upload, FileText, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import HRNav from "@/components/HRNav";
import { useAllJobs } from "@/hooks/useSupabaseData";

const ResumeMatcherAI = () => {
  const { toast } = useToast();
  const { data: jobs = [] } = useAllJobs();
  const [selectedJobId, setSelectedJobId] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
    const selectedJob = jobs.find(job => job.id === jobId);
    if (selectedJob) {
      setJobRole(selectedJob.title);
      setJobDescription(selectedJob.description);
      setRequirements(selectedJob.requirements);
    }
  };

  const handleAnalyze = async () => {
    if (!jobRole || !jobDescription || !requirements || !resumeText) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before analyzing.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis result
      const mockResult = {
        overallMatch: Math.floor(Math.random() * 40) + 60, // 60-100%
        skillsMatch: Math.floor(Math.random() * 30) + 70,
        experienceMatch: Math.floor(Math.random() * 25) + 75,
        educationMatch: Math.floor(Math.random() * 20) + 80,
        strengths: [
          "Strong technical background",
          "Relevant work experience",
          "Good educational qualifications"
        ],
        gaps: [
          "Missing some specific skills mentioned in requirements",
          "Could benefit from additional certifications"
        ],
        recommendation: "This candidate shows good potential with relevant experience. Consider for interview."
      };

      setAnalysisResult(mockResult);
      
      toast({
        title: "Analysis Complete",
        description: "Resume analysis has been completed successfully.",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <HRNav />
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/hr/dashboard">
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 bg-slate-800 hover:bg-slate-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">AI Resume Matcher</h1>
            <p className="text-slate-300 mt-2">Analyze resume compatibility with job requirements</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-400" />
                  Job Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-200">Select Job (Optional)</Label>
                  <Select value={selectedJobId} onValueChange={handleJobSelect}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Choose from existing jobs..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id} className="text-white hover:bg-slate-600">
                          {job.title} - {job.location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="jobRole" className="text-slate-200">Job Role *</Label>
                  <Input
                    id="jobRole"
                    value={jobRole}
                    onChange={(e) => setJobRole(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="e.g. Senior React Developer"
                  />
                </div>

                <div>
                  <Label htmlFor="jobDescription" className="text-slate-200">Job Description *</Label>
                  <Textarea
                    id="jobDescription"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white min-h-32"
                    placeholder="Paste the job description here..."
                  />
                </div>

                <div>
                  <Label htmlFor="requirements" className="text-slate-200">Requirements *</Label>
                  <Textarea
                    id="requirements"
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white min-h-32"
                    placeholder="List the job requirements..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-400" />
                  Resume Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="resumeText" className="text-slate-200">Resume Text *</Label>
                  <Textarea
                    id="resumeText"
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white min-h-48"
                    placeholder="Paste the resume content here..."
                  />
                </div>
                
                <Button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isAnalyzing ? (
                    <>
                      <Brain className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analyze Match
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div>
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                {analysisResult ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-slate-700 rounded-lg">
                        <div className="text-3xl font-bold text-blue-400">{analysisResult.overallMatch}%</div>
                        <div className="text-slate-300">Overall Match</div>
                      </div>
                      <div className="text-center p-4 bg-slate-700 rounded-lg">
                        <div className="text-3xl font-bold text-green-400">{analysisResult.skillsMatch}%</div>
                        <div className="text-slate-300">Skills Match</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-white mb-2">Strengths</h4>
                        <ul className="space-y-1">
                          {analysisResult.strengths.map((strength: string, index: number) => (
                            <li key={index} className="text-green-400 text-sm">• {strength}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-white mb-2">Areas for Improvement</h4>
                        <ul className="space-y-1">
                          {analysisResult.gaps.map((gap: string, index: number) => (
                            <li key={index} className="text-yellow-400 text-sm">• {gap}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-white mb-2">Recommendation</h4>
                        <p className="text-slate-300 text-sm">{analysisResult.recommendation}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Brain className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Upload job requirements and resume to see analysis results</p>
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
