
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, Brain, Download, Star, TrendingUp, CheckCircle, X } from "lucide-react";
import HRNav from "@/components/HRNav";

const ResumeMatcherAI = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [uploadedResumes, setUploadedResumes] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedResumes(prev => [...prev, ...files]);
  };

  const removeResume = (index: number) => {
    setUploadedResumes(prev => prev.filter((_, i) => i !== index));
  };

  const analyzeResumes = async () => {
    if (!jobDescription.trim() || uploadedResumes.length === 0) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const mockResults = uploadedResumes.map((resume, index) => ({
        id: index,
        fileName: resume.name,
        score: Math.floor(Math.random() * 30) + 70, // 70-100 range
        strengths: [
          'Strong technical background',
          'Relevant experience',
          'Good communication skills'
        ].slice(0, Math.floor(Math.random() * 3) + 1),
        weaknesses: [
          'Limited leadership experience',
          'Missing specific technology',
          'Short tenure at previous roles'
        ].slice(0, Math.floor(Math.random() * 2) + 1),
        keySkills: ['React', 'JavaScript', 'Python', 'AWS', 'Node.js'].slice(0, Math.floor(Math.random() * 3) + 2),
        recommendation: Math.random() > 0.5 ? 'Recommend for interview' : 'Consider for phone screening'
      }));
      
      mockResults.sort((a, b) => b.score - a.score);
      setResults(mockResults);
      setIsAnalyzing(false);
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <HRNav />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AI Resume Matcher</h1>
          <p className="text-slate-400">Upload job description and resumes to find the best candidates using AI analysis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Job Description Input */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-400" />
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Paste your job description here. Include required skills, experience, qualifications, and responsibilities..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[200px] bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 resize-none"
              />
            </CardContent>
          </Card>

          {/* Resume Upload */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Upload className="h-5 w-5 text-green-400" />
                Upload Resumes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-slate-500 transition-colors">
                <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-300 mb-2">Drop resume files here or click to browse</p>
                <p className="text-slate-500 text-sm mb-4">Supports PDF, DOC, DOCX files up to 10MB each</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="resume-upload"
                />
                <label htmlFor="resume-upload">
                  <Button className="bg-green-600 hover:bg-green-700 text-white cursor-pointer">
                    Choose Files
                  </Button>
                </label>
              </div>

              {/* Uploaded Files List */}
              {uploadedResumes.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-white font-medium">Uploaded Resumes ({uploadedResumes.length})</h4>
                  {uploadedResumes.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-700/50 rounded">
                      <span className="text-slate-300 text-sm">{file.name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeResume(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Analyze Button */}
        <div className="text-center mb-8">
          <Button
            onClick={analyzeResumes}
            disabled={!jobDescription.trim() || uploadedResumes.length === 0 || isAnalyzing}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Analyzing Resumes...
              </>
            ) : (
              <>
                <Brain className="h-5 w-5 mr-2" />
                Analyze with AI
              </>
            )}
          </Button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
              <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-700">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>

            <div className="grid gap-6">
              {results.map((result, index) => (
                <Card key={result.id} className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-white">#{index + 1}</span>
                          <span className="text-white font-medium">{result.fileName}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                          {result.score}%
                        </div>
                        <p className="text-slate-400 text-sm">Match Score</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="text-green-400 font-medium mb-2 flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          Strengths
                        </h4>
                        <ul className="space-y-1">
                          {result.strengths.map((strength: string, idx: number) => (
                            <li key={idx} className="text-slate-300 text-sm">• {strength}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-yellow-400 font-medium mb-2 flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          Areas for Growth
                        </h4>
                        <ul className="space-y-1">
                          {result.weaknesses.map((weakness: string, idx: number) => (
                            <li key={idx} className="text-slate-300 text-sm">• {weakness}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          Key Skills
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {result.keySkills.map((skill: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-700">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-medium">Recommendation</p>
                          <p className="text-slate-400 text-sm">{result.recommendation}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 hover:bg-slate-700">
                            View Resume
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                            Contact Candidate
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeMatcherAI;
