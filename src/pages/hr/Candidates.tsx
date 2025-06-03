
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Mail, Phone, MapPin, Calendar, Download, Eye, Star, CheckCircle, Users } from "lucide-react";
import { Link } from "react-router-dom";
import HRNav from "@/components/HRNav";
import { useApplications } from "@/hooks/useSupabaseData";
import { useRealtimeManager } from "@/hooks/useRealtimeManager";
import { applicationService } from "@/services/supabaseService";
import { useToast } from "@/hooks/use-toast";
import type { ApplicationStatus } from "@/types/database";

const HRCandidates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const { toast } = useToast();
  
  // Set up real-time updates
  useRealtimeManager();
  
  // Fetch applications from database - RLS will automatically filter by HR's jobs
  const { data: applications = [], isLoading, error, refetch } = useApplications();

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

  const filteredApplications = applications.filter(application => {
    const candidate = application.candidate;
    const job = application.job;
    
    const matchesSearch = candidate?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job?.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || application.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    All: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    interviewed: applications.filter(a => a.status === 'interviewed').length,
    selected: applications.filter(a => a.status === 'selected').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      await applicationService.updateApplicationStatus(applicationId, newStatus);
      toast({
        title: "Success",
        description: "Application status updated successfully.",
      });
      refetch();
    } catch (error) {
      console.error('Error updating application status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadResume = async (application: any) => {
    if (!application.resume_url) {
      toast({
        title: "Error",
        description: "No resume available for download.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = application.resume_url;
      link.download = application.resume_filename || `${application.candidate?.full_name || 'candidate'}_resume.pdf`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      // Append to body, click, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Success",
        description: "Resume download started.",
      });
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast({
        title: "Error",
        description: "Failed to download resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewResume = (application: any) => {
    if (!application.resume_url) {
      toast({
        title: "Error",
        description: "No resume available to view.",
        variant: "destructive",
      });
      return;
    }

    // Open resume in new tab for viewing
    window.open(application.resume_url, '_blank', 'noopener,noreferrer');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <HRNav />
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-white text-lg">Loading candidates...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900">
        <HRNav />
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-red-400 text-lg">Error loading candidates. Please try again.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <HRNav />
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Candidates</h1>
            <p className="text-slate-400">Manage job applications and track candidate progress</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search candidates by name, email, or job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-400 focus:border-blue-500"
              />
            </div>
            <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-slate-800">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
            </Button>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {Object.entries(statusCounts).map(([status, count]) => (
              <Button
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                className={`${
                  statusFilter === status 
                    ? "bg-blue-500 text-white hover:bg-blue-600" 
                    : "border-slate-600 text-slate-300 hover:bg-slate-700 bg-slate-800"
                }`}
                onClick={() => setStatusFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
              </Button>
            ))}
          </div>
        </div>

        {/* Applications Grid */}
        <div className="grid gap-6">
          {filteredApplications.map((application, index) => (
            <Card 
              key={application.id} 
              className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 transform hover:scale-[1.01]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                          {application.candidate?.full_name || 'Unknown Candidate'}
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-slate-300">{application.rating || 'N/A'}</span>
                          </div>
                        </h3>
                        <p className="text-lg text-blue-400 font-medium mb-1">
                          Applied for: {application.job?.title || 'Unknown Position'}
                        </p>
                        <p className="text-sm text-slate-400">
                          {application.job?.location} • {application.job?.job_type}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">{application.candidate?.email || 'No email'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">{application.candidate?.phone || 'No phone'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">{application.candidate?.location || 'No location'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">Applied: {new Date(application.applied_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <CheckCircle className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">Source: {application.application_source || 'Website'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3 min-w-fit">
                    <div className="flex flex-col gap-2 items-end">
                      <Badge className={`${getStatusColor(application.status)} border px-3 py-1`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                      <Select
                        value={application.status}
                        onValueChange={(value: ApplicationStatus) => handleStatusUpdate(application.id, value)}
                      >
                        <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
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
                    <div className="flex gap-2 flex-wrap">
                      {application.resume_url ? (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-slate-800"
                            onClick={() => handleViewResume(application)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Resume
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-slate-600 text-slate-200 hover:bg-slate-700 bg-slate-800"
                            onClick={() => handleDownloadResume(application)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-slate-600 text-slate-400 cursor-not-allowed bg-slate-800"
                          disabled
                        >
                          No Resume
                        </Button>
                      )}
                      <Link to={`/hr/candidates/${application.id}`}>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          <Eye className="h-4 w-4 mr-1" />
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-400 mb-2">No candidates found</h3>
            <p className="text-slate-500">
              {applications.length === 0 
                ? "No candidates have applied to your job postings yet" 
                : "Try adjusting your search or filters"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRCandidates;
