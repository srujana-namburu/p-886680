
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const ChatTranscript: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [responses, setResponses] = useState<{ question: string; answer: string }[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const questions = [
    "Do you have any work experience? If yes, how many years?",
    "Are you currently employed, or looking for opportunities?",
    "What type of job are you looking for? (Full-time, Part-time, Internship)",
    "Are you open to remote work, or prefer on-site/hybrid?",
    "What is your current location? Are you willing to relocate?",
    "What are your top 3 skills or areas of expertise?",
    "What is your expected salary or stipend?",
    "What is your notice period or availability to join?",
    "Do you have any certifications or relevant training?"
  ];

  const handleStart = () => {
    setIsStarted(true);
    setCurrentQuestionIndex(0);
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      toast({
        title: "Please provide an answer",
        description: "Your response is required to continue.",
        variant: "destructive",
      });
      return;
    }

    const newResponse = {
      question: questions[currentQuestionIndex],
      answer: currentAnswer.trim()
    };

    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);
    setCurrentAnswer('');

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Save to database
      await saveTranscript(updatedResponses);
      setIsCompleted(true);
    }
  };

  const saveTranscript = async (transcriptData: { question: string; answer: string }[]) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('jobseeker_chat_transcripts')
        .insert({
          user_id: user.id,
          transcript_data: transcriptData,
          completed_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving transcript:', error);
        toast({
          title: "Error saving responses",
          description: "There was an issue saving your responses. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Responses saved!",
          description: "Your profile information has been saved successfully.",
        });
      }
    } catch (error) {
      console.error('Error saving transcript:', error);
      toast({
        title: "Error saving responses",
        description: "There was an issue saving your responses. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(-1);
    setResponses([]);
    setCurrentAnswer('');
    setIsStarted(false);
    setIsCompleted(false);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full w-14 h-14 bg-green-600 hover:bg-green-700 shadow-lg"
        size="sm"
      >
        <MessageSquare className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-96 bg-white border shadow-2xl max-h-[600px] flex flex-col">
      <CardHeader className="bg-green-600 text-white rounded-t-lg flex-shrink-0">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Profile Chat
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-green-700 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-1 overflow-y-auto">
        {!isStarted && !isCompleted && (
          <div className="text-center space-y-4">
            <p className="text-gray-700">
              Hi! I'd like to learn more about your professional background to help match you with the best opportunities.
            </p>
            <p className="text-sm text-gray-600">
              This will take about 2-3 minutes and will help us provide better job recommendations.
            </p>
            <Button onClick={handleStart} className="bg-green-600 hover:bg-green-700">
              Yes, Let's Start!
            </Button>
          </div>
        )}

        {isStarted && !isCompleted && (
          <div className="space-y-4">
            <div className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
            <div className="bg-green-100 rounded-lg p-3">
              <p className="text-gray-800 font-medium">
                {questions[currentQuestionIndex]}
              </p>
            </div>
            <div className="space-y-3">
              <Input
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your answer here..."
                onKeyPress={(e) => e.key === 'Enter' && handleSubmitAnswer()}
                className="w-full"
              />
              <Button 
                onClick={handleSubmitAnswer}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!currentAnswer.trim()}
              >
                <Send className="h-4 w-4 mr-2" />
                {currentQuestionIndex === questions.length - 1 ? 'Complete' : 'Next'}
              </Button>
            </div>
            
            {responses.length > 0 && (
              <div className="mt-4 space-y-2 max-h-32 overflow-y-auto">
                <p className="text-sm font-medium text-gray-700">Previous responses:</p>
                {responses.map((response, index) => (
                  <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                    <p className="font-medium">{response.question}</p>
                    <p className="text-gray-600">{response.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {isCompleted && (
          <div className="text-center space-y-4">
            <div className="text-green-600 text-2xl">✅</div>
            <p className="text-gray-700 font-medium">
              Thank you for completing your profile!
            </p>
            <p className="text-sm text-gray-600">
              Your responses have been saved and will help us provide better job recommendations.
            </p>
            <Button onClick={handleReset} variant="outline" className="mt-4">
              Start Over
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ChatTranscript;
