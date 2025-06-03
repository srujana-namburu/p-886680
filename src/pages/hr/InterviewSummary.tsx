
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Brain, Download, Star, Users, Clock, Mic, Upload } from "lucide-react";
import HRNav from "@/components/HRNav";

const InterviewSummary = () => {
  const [candidateName, setCandidateName] = useState('');
  const [position, setPosition] = useState('');
  const [interviewType, setInterviewType] = useState('Technical');
  const [feedback, setFeedback] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  const generateSummary = async () => {
    if (!candidateName.trim() || !feedback.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const mockSummary = {
        candidateName,
        position,
        interviewType,
        overallScore: Math.floor(Math.random() * 30) + 70,
        categories: [
          {
            name: 'Technical Skills',
            score: Math.floor(Math.random() * 20) + 80,
            notes: 'Strong understanding of React and modern JavaScript. Demonstrated problem-solving abilities.'
          },
          {
            name: 'Communication',
            score: Math.floor(Math.random() * 20) + 75,
            notes: 'Clear and articulate responses. Good at explaining complex concepts.'
          },
          {
            name: 'Problem Solving',
            score: Math.floor(Math.random() * 20) + 70,
            notes: 'Approached challenges methodically. Could benefit from more creative thinking.'
          },
          {
            name: 'Cultural Fit',
            score: Math.floor(Math.random() * 20) + 85,
            notes: 'Aligns well with company values. Shows enthusiasm for collaboration.'
          }
        ],
        strengths: [
          'Strong technical foundation in required technologies',
          'Excellent communication and presentation skills',
          'Demonstrates growth mindset and willingness to learn',
          'Good problem-solving approach with systematic thinking'
        ],
        concerns: [
          'Limited experience with large-scale systems',
          'May need mentoring in advanced architectural patterns',
          'Could improve time management during coding challenges'
        ],
        recommendation: 'Recommend for hire',
        nextSteps: [
          'Schedule final round with senior team',
          'Conduct reference checks',
          'Prepare offer package'
        ],
        keyQuotes: [
          '"I believe in writing clean, maintainable code that the team can easily understand."',
          '"I\'m always looking for ways to improve processes and help the team be more efficient."'
        ]
      };
      
      setSummary(mockSummary);
      setIsGenerating(false);
    }, 2500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-500/20 border-green-500/30';
    if (score >= 80) return 'bg-blue-500/20 border-blue-500/30';
    if (score >= 70) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <HRNav />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AI Interview Summarizer</h1>
          <p className="text-slate-400">Generate comprehensive interview summaries with AI-powered analysis and scoring</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Input Form */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-400" />
                Interview Details
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
                <Label htmlFor="position" className="text-slate-200">Position</Label>
                <Input
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g. Senior React Developer"
                  className="bg-slate-700/50 border-slate-600 text-white mt-1"
                />
              </div>

              <div>
                <Label htmlFor="type" className="text-slate-200">Interview Type</Label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full mt-1 p-2 bg-slate-700/50 border border-slate-600 text-white rounded-md"
                >
                  <option value="Technical">Technical Interview</option>
                  <option value="Behavioral">Behavioral Interview</option>
                  <option value="System Design">System Design</option>
                  <option value="Final Round">Final Round</option>
                  <option value="Phone Screen">Phone Screen</option>
                </select>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-700 flex-1">
                  <Mic className="h-4 w-4 mr-2" />
                  Record Audio
                </Button>
                <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-700 flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Input */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-400" />
                Interview Feedback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Enter your interview notes and feedback here. Include observations about technical skills, communication, problem-solving approach, cultural fit, and any specific examples or concerns..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[300px] bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 resize-none"
              />
            </CardContent>
          </Card>
        </div>

        {/* Generate Button */}
        <div className="text-center mb-8">
          <Button
            onClick={generateSummary}
            disabled={!candidateName.trim() || !feedback.trim() || isGenerating}
            className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-8 py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Generating Summary...
              </>
            ) : (
              <>
                <Brain className="h-5 w-5 mr-2" />
                Generate AI Summary
              </>
            )}
          </Button>
        </div>

        {/* Summary Results */}
        {summary && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Interview Summary</h2>
              <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-700">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>

            {/* Header Info */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">{summary.candidateName}</h3>
                    <p className="text-blue-400 text-lg">{summary.position}</p>
                    <p className="text-slate-400">{summary.interviewType}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-4xl font-bold ${getScoreColor(summary.overallScore)}`}>
                      {summary.overallScore}%
                    </div>
                    <p className="text-slate-400">Overall Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {summary.categories.map((category: any, index: number) => (
                <Card key={index} className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-white font-medium">{category.name}</h4>
                      <Badge className={`${getScoreBg(category.score)} border px-2 py-1`}>
                        <span className={getScoreColor(category.score)}>{category.score}%</span>
                      </Badge>
                    </div>
                    <p className="text-slate-300 text-sm">{category.notes}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Detailed Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-green-400 flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Strengths
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {summary.strengths.map((strength: string, index: number) => (
                      <li key={index} className="text-slate-300 flex items-start gap-2">
                        <span className="text-green-400 mt-1">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-yellow-400 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Areas for Development
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {summary.concerns.map((concern: string, index: number) => (
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
                <CardTitle className="text-blue-400">Key Quotes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {summary.keyQuotes.map((quote: string, index: number) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <p className="text-slate-300 italic">"{quote}"</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendation & Next Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Recommendation</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-3 py-1 text-lg">
                    {summary.recommendation}
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {summary.nextSteps.map((step: string, index: number) => (
                      <li key={index} className="text-slate-300 flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewSummary;
