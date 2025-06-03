
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageSquare, Brain, Download, Calendar, DollarSign, MapPin, Upload, Clock } from "lucide-react";
import HRNav from "@/components/HRNav";

const ChatSummarizer = () => {
  const [candidateName, setCandidateName] = useState('');
  const [chatTranscript, setChatTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const analyzeChat = async () => {
    if (!candidateName.trim() || !chatTranscript.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const mockAnalysis = {
        candidateName,
        summary: 'Candidate showed strong interest in the position and demonstrated good technical knowledge. They are currently employed but looking for growth opportunities. Salary expectations align with budget.',
        availability: {
          status: 'Available in 2 weeks',
          startDate: '2024-02-15',
          noticePeriod: '2 weeks',
          flexibility: 'High'
        },
        salaryExpectations: {
          current: '$95,000',
          expected: '$110,000 - $125,000',
          negotiable: true,
          benefits: ['Health insurance', 'Remote work', 'Professional development']
        },
        interests: [
          'React and modern frontend technologies',
          'Team leadership opportunities',
          'Remote work flexibility',
          'Professional growth and learning',
          'Company culture and values'
        ],
        concerns: [
          'Work-life balance in new role',
          'Team dynamics and collaboration',
          'Growth opportunities within company',
          'Technical stack and architecture decisions'
        ],
        keyQuotes: [
          '"I\'m really excited about the opportunity to work with React and modern technologies."',
          '"Work-life balance is important to me, especially with remote work options."',
          '"I\'m looking for a role where I can grow both technically and in leadership."'
        ],
        sentiment: 'Positive',
        interestLevel: 85,
        nextSteps: [
          'Schedule technical interview',
          'Provide detailed job description',
          'Discuss remote work policies',
          'Share team structure information'
        ]
      };
      
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate file reading
      const mockTranscript = `[10:30 AM] HR: Hi! Thank you for your interest in our Senior React Developer position. I'd love to learn more about your background.

[10:31 AM] Candidate: Thank you for reaching out! I'm very excited about this opportunity. I've been working with React for about 4 years now.

[10:32 AM] HR: That's great! What's your current role and what are you looking for in your next position?

[10:33 AM] Candidate: I'm currently a Frontend Developer at TechCorp. I'm looking for more leadership opportunities and the chance to work with cutting-edge technologies. Your job posting mentioned React 18 and TypeScript, which I'm very passionate about.

[10:35 AM] HR: Perfect! What's your availability like? When could you potentially start?

[10:36 AM] Candidate: I'd need to give my current employer 2 weeks notice, so I could start in about 2-3 weeks. I'm quite flexible with the timing.

[10:37 AM] HR: And regarding compensation, what are your expectations?

[10:38 AM] Candidate: I'm currently at $95k. I was hoping for something in the $110-125k range, depending on the benefits package. Remote work options are also important to me.

[10:40 AM] HR: That sounds reasonable. We do offer remote work flexibility. What questions do you have about the role or our company?

[10:41 AM] Candidate: I'd love to know more about the team structure and growth opportunities. Work-life balance is also important to me.`;
      
      setChatTranscript(mockTranscript);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <HRNav />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AI Chat Summarizer</h1>
          <p className="text-slate-400">Extract key insights from candidate conversations and chat transcripts</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Input Section */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-400" />
                Chat Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="candidate" className="text-slate-200">Candidate Name</Label>
                <Input
                  id="candidate"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Enter candidate name"
                  className="bg-slate-700/50 border-slate-600 text-white mt-1"
                />
              </div>

              <div>
                <Label className="text-slate-200">Upload Chat File</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept=".txt,.json,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="chat-upload"
                  />
                  <label htmlFor="chat-upload">
                    <Button className="bg-green-600 hover:bg-green-700 text-white cursor-pointer w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Chat Transcript
                    </Button>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chat Transcript */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-400" />
                Chat Transcript
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your chat conversation here. Include timestamps and participant names for better analysis..."
                value={chatTranscript}
                onChange={(e) => setChatTranscript(e.target.value)}
                className="min-h-[300px] bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 resize-none text-sm font-mono"
              />
            </CardContent>
          </Card>
        </div>

        {/* Analyze Button */}
        <div className="text-center mb-8">
          <Button
            onClick={analyzeChat}
            disabled={!candidateName.trim() || !chatTranscript.trim() || isAnalyzing}
            className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyzing Chat...
              </>
            ) : (
              <>
                <Brain className="h-5 w-5 mr-2" />
                Analyze Conversation
              </>
            )}
          </Button>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Chat Analysis</h2>
              <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-700">
                <Download className="h-4 w-4 mr-2" />
                Export Summary
              </Button>
            </div>

            {/* Summary Overview */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white text-xl mb-2">{analysis.candidateName}</CardTitle>
                    <div className="flex items-center gap-4">
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                        {analysis.sentiment} Sentiment
                      </Badge>
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                        {analysis.interestLevel}% Interest Level
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300 leading-relaxed">{analysis.summary}</p>
              </CardContent>
            </Card>

            {/* Key Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Availability */}
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Availability
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status:</span>
                    <span className="text-white">{analysis.availability.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Start Date:</span>
                    <span className="text-white">{analysis.availability.startDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Notice Period:</span>
                    <span className="text-white">{analysis.availability.noticePeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Flexibility:</span>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      {analysis.availability.flexibility}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Salary Expectations */}
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-blue-400 flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Salary Expectations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Current:</span>
                    <span className="text-white">{analysis.salaryExpectations.current}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Expected:</span>
                    <span className="text-white">{analysis.salaryExpectations.expected}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Negotiable:</span>
                    <Badge className={analysis.salaryExpectations.negotiable ? "bg-green-500/20 text-green-300 border-green-500/30" : "bg-red-500/20 text-red-300 border-red-500/30"}>
                      {analysis.salaryExpectations.negotiable ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-slate-400 text-sm">Important Benefits:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {analysis.salaryExpectations.benefits.map((benefit: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-blue-500/10 text-blue-300 text-xs">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interests and Concerns */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-green-400">Interests & Motivations</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.interests.map((interest: string, index: number) => (
                      <li key={index} className="text-slate-300 flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>{interest}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-yellow-400">Concerns & Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.concerns.map((concern: string, index: number) => (
                      <li key={index} className="text-slate-300 flex items-start gap-2">
                        <span className="text-yellow-400 mt-1">•</span>
                        <span>{concern}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Key Quotes */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-purple-400">Key Quotes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.keyQuotes.map((quote: string, index: number) => (
                    <div key={index} className="border-l-4 border-purple-500 pl-4 py-2">
                      <p className="text-slate-300 italic">{quote}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recommended Next Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysis.nextSteps.map((step: string, index: number) => (
                    <li key={index} className="text-slate-300 flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSummarizer;
