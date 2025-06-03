
import React from 'react';
import HRNav from "@/components/HRNav";
import ResumeMatcherForm from "@/components/ResumeMatcherForm";

const ResumeMatcherAI = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <HRNav />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">AI Resume Matcher</h1>
          <p className="text-slate-400">
            Use AI to automatically match and rank candidate resumes against job requirements
          </p>
        </div>
        
        <ResumeMatcherForm />
      </div>
    </div>
  );
};

export default ResumeMatcherAI;
