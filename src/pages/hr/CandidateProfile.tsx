import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Mail, Phone, Download, MessageSquare, MapPin, Calendar, Briefcase } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { applicationService, resumeService } from "@/services/supabaseService";
import { useToast } from "@/hooks/use-toast";
import HRNav from "@/components/HRNav";
import type { Application, ApplicationStatus } from "@/types/database";

const CandidateProfile = () => {
  const { id } = useParams();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      fetchApplication();
    }
  }, [id]);

  const fetchApplication = async () => {
    try {
      const data = await applicationService.getApplicationById(id!);
      setApplication(data);
    } catch (error) {
      console.error('Error fetching application:', error);
      toast({
        title: "Error",
        description: "Failed to load candidate profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: ApplicationStatus) => {
    if (!application) return;

    try {
      await applicationService.updateApplicationStatus(application.id, newStatus);
      setApplication(prev => prev ? { ...prev, status: newStatus } : null);
      toast({
        title: "Success",
        description: "Application status updated successfully.",
      });
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadResume = async () => {
    if (!application?.resume_url) return;

    try {
      // Extract file path from URL
      const url = new URL(application.resume_url);
      const filePath = url.pathname.split('/').pop();
      
      if (filePath) {
        const blob = await resumeService.downloadResume(filePath);
        if (blob) {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = application.resume_filename || 'resume.pdf';
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
          
          toast({
            title: "Success",
            description: "Resume downloaded successfully.",
          });
        }
      }
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast({
        title: "Error",
        description: "Failed to download resume.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'shortlisted': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'interviewed': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'selected': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <HRNav />
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-white text-lg">Loading candidate profile...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-slate-900">
        <HRNav />
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-red-400 text-lg">Candidate not found.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <HRNav />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/hr/candidates">
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Candidates
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{application.candidate?.full_name || 'Unknown Candidate'}</h1>
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
                  <span className="text-slate-200">{application.candidate?.email || 'No email provided'}</span>
                </div>
                {application.candidate?.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-200">{application.candidate.phone}</span>
                  </div>
                )}
                {application.candidate?.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-200">{application.candidate.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-slate-400" />
                  <span className="text-slate-200">Applied for: {application.job?.title || 'Unknown Position'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-slate-400" />
                  <span className="text-slate-200">Applied on: {new Date(application.applied_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>

            {application.cover_letter && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Cover Letter</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {application.cover_letter}
                  </p>
                </CardContent>
              </Card>
            )}

            {application.hr_notes && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">HR Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {application.hr_notes}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Application Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Badge className={`${getStatusColor(application.status)} border px-3 py-2 w-full justify-center`}>
                  {application.status === 'pending' ? 'Applied' : application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Badge>
                
                <div className="space-y-2">
                  <label className="text-sm text-slate-300">Update Status:</label>
                  <Select
                    value={application.status}
                    onValueChange={handleStatusUpdate}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="shortlisted">Shortlisted</SelectItem>
                      <SelectItem value="interviewed">Interviewed</SelectItem>
                      <SelectItem value="selected">Selected</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="text-slate-300 text-sm space-y-2">
                  <p><strong>Applied for:</strong> {application.job?.title || 'Unknown Position'}</p>
                  <p><strong>Applied on:</strong> {new Date(application.applied_at).toLocaleDateString()}</p>
                  {application.rating && (
                    <p><strong>Rating:</strong> {application.rating}/5</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {application.resume_url && (
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={handleDownloadResume}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </Button>
                )}
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
