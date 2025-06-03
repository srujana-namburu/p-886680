
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Mail, Phone, Download, MessageSquare } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const CandidateProfile = () => {
  const { id } = useParams();
  
  const candidate = {
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    phone: "+1 (555) 123-4567",
    appliedFor: "Senior React Developer",
    status: "Shortlisted",
    appliedDate: "2024-01-15",
    experience: "5 years",
    location: "San Francisco, CA",
    resume: "alice_johnson_resume.pdf",
    coverLetter: "I am excited to apply for the Senior React Developer position..."
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/hr/candidates">
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Candidates
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{candidate.name}</h1>
            <p className="text-slate-300 mt-2">Candidate Profile</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-slate-400" />
                  <span className="text-slate-200">{candidate.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-slate-400" />
                  <span className="text-slate-200">{candidate.phone}</span>
                </div>
                <div className="text-slate-200">
                  <strong>Location:</strong> {candidate.location}
                </div>
                <div className="text-slate-200">
                  <strong>Experience:</strong> {candidate.experience}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Cover Letter</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-200 leading-relaxed">{candidate.coverLetter}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Application Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Badge variant="default" className="w-full justify-center py-2">
                  {candidate.status}
                </Badge>
                <div className="text-slate-300 text-sm">
                  <p><strong>Applied for:</strong> {candidate.appliedFor}</p>
                  <p><strong>Applied on:</strong> {candidate.appliedDate}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </Button>
                <Button variant="outline" className="w-full border-slate-600 text-slate-200">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button variant="outline" className="w-full border-slate-600 text-slate-200">
                  Schedule Interview
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
