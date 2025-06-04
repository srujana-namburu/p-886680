
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, MessageSquare, Users, Brain, Upload, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import HRNav from "@/components/HRNav";
import { useAllJobs, useApplications } from "@/hooks/useSupabaseData";

const ChatSummarizer = () => {
  const { toast } = useToast();
  const { data: jobs = [] } = useAllJobs();
  const { data: applications = [] } = useApplications();
  const [selectedJobId, setSelectedJobId] = useState('');
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [chatTranscript, setChatTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  // Filter candidates based on selected job
  const filteredCandidates = selectedJobId 
    ? applications.filter(app => app.job_id === selectedJobId)
    : [];

  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
    // Clear candidate selection when job changes
    setSelectedCandidateId('');
    setChatTranscript('');
  };

  const handleCandidateSelect = (candidateId: string) => {
    setSelectedCandidateId(candidateId);
    // In a real app, you would fetch the actual chat transcript for this candidate
    // For now, we'll clear the transcript field
    setChatTranscript('');
  };

  const handleAnalyze = async () => {
    if (!selectedJobId) {
      toast({
        title: "Missing Information",
        description: "Please select a job position.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const selectedJob = jobs.find(job => job.id === selectedJobId);
      const selectedApplication = selectedCandidateId 
        ? applications.find(app => app.id === selectedCandidateId)
        : null;
      
      // Mock analysis result
      const mockAnalysis = {
        jobTitle: selectedJob?.title || 'Unknown Position',
        candidateName: selectedApplication?.candidate?.full_name || 'General Analysis',
        totalMessages: Math.floor(Math.random() * 50) + 20,
        conversationDuration: `${Math.floor(Math.random() * 60) + 30} minutes`,
        sentimentScore: Math.floor(Math.random() * 30) + 70, // 70-100%
        keyTopics: [
          "Technical skills discussion",
          "Work experience",
          "Career goals",
          "Company culture fit"
        ],
        candidateInterests: [
          "Remote work opportunities",
          "Professional development",
          "Team collaboration",
          "Technology stack"
        ],
        concerns: [
          "Salary expectations",
          "Work-life balance"
        ],
        summary: "The candidate showed strong interest in the position and demonstrated good communication skills. They asked thoughtful questions about the role and company culture. Overall positive interaction with high engagement.",
        recommendation: "Proceed with formal interview - candidate shows good potential and genuine interest."
      };

      setAnalysis(mockAnalysis);
      
      toast({
        title: "Analysis Complete",
        description: "Chat transcript has been analyzed successfully.",
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze chat transcript. Please try again.",
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
            <h1 className="text-3xl font-bold text-white">Chat Summarizer</h1>
            <p className="text-slate-300 mt-2">Analyze and summarize candidate chat conversations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-400" />
                  Chat Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-slate-200">Job Position *</Label>
                  <Select value={selectedJobId} onValueChange={handleJobSelect}>
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
                  <Label className="text-slate-200">Select Candidate (Optional)</Label>
                  <Select 
                    value={selectedCandidateId} 
                    onValueChange={handleCandidateSelect}
                    disabled={!selectedJobId}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder={selectedJobId ? "Choose candidate to analyze..." : "Select job first..."} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      {filteredCandidates.map((application) => (
                        <SelectItem key={application.id} value={application.id} className="text-white hover:bg-slate-600">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <div>
                              <div>{application.candidate?.full_name || 'Unknown Candidate'}</div>
                              <div className="text-xs text-slate-400">
                                Applied for: {application.job?.title || 'Unknown Position'}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="chatTranscript" className="text-slate-200">Chat Transcript (Optional)</Label>
                  <Textarea
                    id="chatTranscript"
                    value={chatTranscript}
                    onChange={(e) => setChatTranscript(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white min-h-64"
                    placeholder="Paste the chat transcript here or upload a file..."
                  />
                </div>

                <div className="border-2 border-dashed border-slate-600 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm mb-2">Or upload chat transcript file</p>
                  <Button variant="outline" className="border-slate-600 text-slate-200 bg-slate-700 hover:bg-slate-600">
                    Choose File
                  </Button>
                </div>
                
                <Button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !selectedJobId}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isAnalyzing ? (
                    <>
                      <Brain className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing Chat...
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Analyze Chat
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
                <CardTitle className="text-white">Chat Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                {analysis ? (
                  <div className="space-y-6">
                    <div className="border-b border-slate-700 pb-4">
                      <h3 className="font-semibold text-white mb-2">Conversation Overview</h3>
                      <p className="text-slate-300"><strong>Job Position:</strong> {analysis.jobTitle}</p>
                      <p className="text-slate-300"><strong>Candidate:</strong> {analysis.candidateName}</p>
                      <p className="text-slate-300"><strong>Duration:</strong> {analysis.conversationDuration}</p>
                      <p className="text-slate-300"><strong>Messages:</strong> {analysis.totalMessages}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div className="text-center p-4 bg-slate-700 rounded-lg">
                        <div className="text-3xl font-bold text-green-400">{analysis.sentimentScore}%</div>
                        <div className="text-slate-300">Positive Sentiment</div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-white mb-2">Key Topics Discussed</h4>
                        <ul className="space-y-1">
                          {analysis.keyTopics.map((topic: string, index: number) => (
                            <li key={index} className="text-blue-400 text-sm">• {topic}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-white mb-2">Candidate Interests</h4>
                        <ul className="space-y-1">
                          {analysis.candidateInterests.map((interest: string, index: number) => (
                            <li key={index} className="text-green-400 text-sm">• {interest}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-white mb-2">Concerns Raised</h4>
                        <ul className="space-y-1">
                          {analysis.concerns.map((concern: string, index: number) => (
                            <li key={index} className="text-yellow-400 text-sm">• {concern}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-white mb-2">Summary</h4>
                        <p className="text-slate-300 text-sm">{analysis.summary}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-white mb-2">Recommendation</h4>
                        <p className="text-blue-300 text-sm font-medium">{analysis.recommendation}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <MessageSquare className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Select a job position to start analyzing chat conversations</p>
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

export default ChatSummarizer;
