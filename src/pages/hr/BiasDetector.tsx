
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Brain, AlertTriangle, CheckCircle, X, TrendingUp, BarChart3 } from "lucide-react";
import HRNav from "@/components/HRNav";

const BiasDetector = () => {
  const [feedbackText, setFeedbackText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const analyzeBias = async () => {
    if (!feedbackText.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      const mockAnalysis = {
        overallRisk: 'Medium',
        riskScore: 35,
        detectedBiases: [
          {
            type: 'Gender Bias',
            severity: 'Low',
            instances: [
              {
                text: 'he seems very technical',
                suggestion: 'they seem very technical',
                reasoning: 'Using gender-neutral pronouns reduces assumptions about technical capability based on gender'
              }
            ]
          },
          {
            type: 'Age Bias',
            severity: 'Medium',
            instances: [
              {
                text: 'young and energetic',
                suggestion: 'enthusiastic and motivated',
                reasoning: 'Focus on behavioral traits rather than age-related characteristics'
              }
            ]
          },
          {
            type: 'Cultural Bias',
            severity: 'Low',
            instances: [
              {
                text: 'good English for a foreign candidate',
                suggestion: 'excellent communication skills',
                reasoning: 'Avoid making assumptions based on perceived background or origin'
              }
            ]
          }
        ],
        safePhrases: [
          'Strong technical skills',
          'Demonstrates problem-solving ability',
          'Good communication skills',
          'Shows enthusiasm for learning'
        ],
        recommendations: [
          'Use standardized evaluation criteria for all candidates',
          'Focus on job-relevant skills and experience',
          'Avoid personal characteristics unrelated to job performance',
          'Use structured interview questions to ensure fairness'
        ],
        alternativePhrasing: [
          {
            original: 'cultural fit',
            alternative: 'alignment with team values and working style'
          },
          {
            original: 'overqualified',
            alternative: 'brings extensive experience that could benefit the team'
          },
          {
            original: 'not a good fit',
            alternative: 'skills don\'t align with current role requirements'
          }
        ]
      };
      
      setAnalysis(mockAnalysis);
      setIsAnalyzing(false);
    }, 2500);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'Low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-yellow-400';
      case 'Low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <HRNav />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AI Bias Detector</h1>
          <p className="text-slate-400">Identify and eliminate unconscious bias in recruitment feedback and decision-making</p>
        </div>

        {/* Input Section */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              Feedback Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste your interview feedback, evaluation notes, or any recruitment-related text here. The AI will analyze it for potential bias and suggest improvements..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="min-h-[200px] bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 resize-none"
            />
            <div className="flex justify-between items-center mt-4">
              <p className="text-slate-400 text-sm">
                {feedbackText.length} characters • Real-time bias detection as you type
              </p>
              <Button
                onClick={analyzeBias}
                disabled={!feedbackText.trim() || isAnalyzing}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze for Bias
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Risk Overview */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1">Bias Risk Assessment</h3>
                    <p className="text-slate-400">Overall evaluation of potential bias in your feedback</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-4xl font-bold ${getRiskColor(analysis.overallRisk)}`}>
                      {analysis.overallRisk}
                    </div>
                    <div className="text-slate-400 text-sm">Risk Level</div>
                    <div className={`text-2xl font-bold ${getRiskColor(analysis.overallRisk)} mt-1`}>
                      {analysis.riskScore}%
                    </div>
                  </div>
                </div>

                {analysis.overallRisk !== 'Low' && (
                  <Alert className="bg-yellow-500/10 border-yellow-500/30 mt-4">
                    <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    <AlertDescription className="text-yellow-300">
                      Potential bias detected. Review the suggestions below to improve fairness in your evaluation.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Detected Biases */}
            {analysis.detectedBiases.length > 0 && (
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Detected Biases ({analysis.detectedBiases.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysis.detectedBiases.map((bias: any, index: number) => (
                    <div key={index} className="border border-slate-700 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="text-white font-medium">{bias.type}</h4>
                        <Badge className={`${getSeverityColor(bias.severity)} border px-2 py-1`}>
                          {bias.severity} Risk
                        </Badge>
                      </div>
                      {bias.instances.map((instance: any, idx: number) => (
                        <div key={idx} className="bg-slate-700/30 rounded p-3 space-y-2">
                          <div className="flex items-start gap-2">
                            <X className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-red-300 font-medium">Problematic phrase:</p>
                              <p className="text-slate-300 italic">"{instance.text}"</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-green-300 font-medium">Suggested improvement:</p>
                              <p className="text-slate-300 italic">"{instance.suggestion}"</p>
                            </div>
                          </div>
                          <div className="bg-slate-800/50 p-2 rounded text-sm">
                            <p className="text-blue-300 font-medium">Why this matters:</p>
                            <p className="text-slate-400">{instance.reasoning}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Safe Phrases */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Bias-Free Phrases Detected
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {analysis.safePhrases.map((phrase: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-green-500/10 rounded">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span className="text-slate-300">"{phrase}"</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Alternative Phrasing Guide */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-blue-400 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Better Phrasing Alternatives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.alternativePhrasing.map((item: any, index: number) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-3 bg-slate-700/30 rounded">
                      <div>
                        <p className="text-red-300 font-medium text-sm">Instead of:</p>
                        <p className="text-slate-300">"{item.original}"</p>
                      </div>
                      <div>
                        <p className="text-green-300 font-medium text-sm">Try:</p>
                        <p className="text-slate-300">"{item.alternative}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-purple-400 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Best Practices & Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {analysis.recommendations.map((recommendation: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 p-2">
                      <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-purple-400 text-sm font-bold">{index + 1}</span>
                      </div>
                      <span className="text-slate-300">{recommendation}</span>
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

export default BiasDetector;
