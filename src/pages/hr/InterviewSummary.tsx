
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, FileText, Users, Briefcase, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import HRNav from "@/components/HRNav";
import { useAllJobs, useApplications } from "@/hooks/useSupabaseData";

const InterviewSummary = () => {
  const { toast } = useToast();
  const { data: jobs = [] } = useAllJobs();
  const { data: applications = [] } = useApplications();
  const [selectedJobId, setSelectedJobId] = useState('');
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  // Filter candidates based on selected job
  const filteredCandidates = selectedJobId 
    ? applications.filter(app => app.job_id === selectedJobId)
    : applications;

  const handleGenerate = async () => {
    if (!selectedJobId) {
      toast({
        title: "Missing Information",
        description: "Please select a job position.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock summary result
      const selectedJob = jobs.find(job => job.id === selectedJobId);
      const selectedApplication = selectedCandidateId 
        ? applications.find(app => app.id === selectedCandidateId)
        : null;
      
      const mockSummary = {
        candidateName: selectedApplication?.candidate?.full_name || 'General Interview',
        jobTitle: selectedJob?.title || 'Unknown Position',
        overallRating: Math.floor(Math.random() * 3) + 3, // 3-5 rating
        technicalSkills: Math.floor(Math.random() * 2) + 4, // 4-5 rating
        communication: Math.floor(Math.random() * 2) + 4,
        culturalFit: Math.floor(Math.random() * 2) + 3,
        keyStrengths: [
          "Strong problem-solving abilities",
          "Excellent technical knowledge",
          "Good team collaboration skills"
        ],
        areasForImprovement: [
          "Could improve presentation skills",
          "More experience with specific technologies needed"
        ],
        recommendation: "Recommend for next round",
        nextSteps: "Schedule technical assessment and final interview with team lead"
      };

      setSummary(mockSummary);
      
      toast({
        title: "Summary Generated",
        description: "Interview summary has been generated successfully.",
      });
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
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
            <h1 className="text-3xl font-bold text-white">Interview Summary</h1>
            <p className="text-slate-300 mt-2">Generate AI-powered interview summaries and evaluations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  Interview Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-200">Job Position *</Label>
                  <Select value={selectedJobId} onValueChange={setSelectedJobId}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select job position..." />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {jobs.map((job) => (
                        <SelectItem key={job.id} value={job.id} className="text-white hover:bg-slate-600">
                          <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4" />
                            {job.title} - {job.location}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-200">Candidate Name (Optional)</Label>
                  <Select 
                    value={selectedCandidateId} 
                    onValueChange={setSelectedCandidateId}
                    disabled={!selectedJobId}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder={selectedJobId ? "Select candidate (optional)..." : "Select job first..."} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {filteredCandidates.map((application) => (
                        <SelectItem key={application.id} value={application.id} className="text-white hover:bg-slate-600">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {application.candidate?.full_name || 'Unknown Candidate'}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="interviewNotes" className="text-slate-200">Interview Notes (Optional)</Label>
                  <Textarea
                    id="interviewNotes"
                    value={interviewNotes}
                    onChange={(e) => setInterviewNotes(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white min-h-48"
                    placeholder="Enter detailed interview notes, observations, and candidate responses... (optional)"
                  />
                </div>
                
                <Button 
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isGenerating ? (
                    <>
                      <Brain className="w-4 h-4 mr-2 animate-spin" />
                      Generating Summary...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Summary
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
                <CardTitle className="text-white">Interview Summary</CardTitle>
              </CardHeader>
              <CardContent>
                {summary ? (
                  <div className="space-y-6">
                    <div className="border-b border-slate-700 pb-4">
                      <h3 className="font-semibold text-white mb-2">Interview Overview</h3>
                      <p className="text-slate-300"><strong>Candidate:</strong> {summary.candidateName}</p>
                      <p className="text-slate-300"><strong>Position:</strong> {summary.jobTitle}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-slate-700 rounded-lg">
                        <div className="text-2xl font-bold text-blue-400">{summary.overallRating}/5</div>
                        <div className="text-slate-300 text-sm">Overall Rating</div>
                      </div>
                      <div className="text-center p-3 bg-slate-700 rounded-lg">
                        <div className="text-2xl font-bold text-green-400">{summary.technicalSkills}/5</div>
                        <div className="text-slate-300 text-sm">Technical Skills</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-white mb-2">Key Strengths</h4>
                        <ul className="space-y-1">
                          {summary.keyStrengths.map((strength: string, index: number) => (
                            <li key={index} className="text-green-400 text-sm">• {strength}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-white mb-2">Areas for Improvement</h4>
                        <ul className="space-y-1">
                          {summary.areasForImprovement.map((area: string, index: number) => (
                            <li key={index} className="text-yellow-400 text-sm">• {area}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-white mb-2">Recommendation</h4>
                        <p className="text-slate-300 text-sm">{summary.recommendation}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-white mb-2">Next Steps</h4>
                        <p className="text-slate-300 text-sm">{summary.nextSteps}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Select job position to generate interview summary</p>
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

export default InterviewSummary;
