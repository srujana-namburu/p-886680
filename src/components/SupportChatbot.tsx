
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, X, HeadphonesIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface SupportChatbotProps {
  userType: 'jobseeker' | 'hr';
}

const SupportChatbot: React.FC<SupportChatbotProps> = ({ userType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  const getMessage = () => {
    if (userType === 'jobseeker') {
      return "Hi Job Seeker! 👋 I'm here to help you find amazing opportunities. Whether you need help with applications, interview tips, or navigating the platform, I'm here for you!";
    } else {
      return "Hi HR Professional! 👋 I'm here to assist you with candidate management, job postings, and making the best hiring decisions. How can I help you today?";
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-50 rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
        size="sm"
      >
        <HeadphonesIcon className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 left-4 z-50 w-80 bg-white border shadow-2xl">
      <CardHeader className="bg-blue-600 text-white rounded-t-lg">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <HeadphonesIcon className="h-5 w-5" />
            Support Assistant
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-blue-700 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="bg-gray-100 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-800">{getMessage()}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
            Get Help
          </Button>
          <Button variant="outline" size="sm">
            Contact Support
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SupportChatbot;
