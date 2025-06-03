
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, MapPin, Building, Eye, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import JobSeekerNav from "@/components/JobSeekerNav";
import { useUserApplications } from "@/hooks/useSupabaseData";
import { format } from "date-fns";

const JobSeekerApplications = () => {
  const { data: applications, isLoading, error } = useUserApplications();

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'interviewing':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'offered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatStatus = (status: string) => {
    return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <JobSeekerNav />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Loading your applications...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <JobSeekerNav />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading applications</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <JobSeekerNav />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/jobseeker/dashboard">
            <Button variant="outline" size="sm" className="border-slate-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Applications</h1>
            <p className="text-slate-600 mt-2">Track your job application status and progress</p>
          </div>
        </div>

        {!applications || applications.length === 0 ? (
          <Card className="bg-white border-slate-200">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No Applications Yet</h3>
              <p className="text-slate-600 mb-6">
                You haven't applied to any jobs yet. Start browsing opportunities!
              </p>
              <Link to="/jobseeker/dashboard">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Browse Jobs
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {applications.map((application) => (
              <Card key={application.id} className="bg-white border-slate-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-slate-900 mb-2">
                        {application.job?.title || 'Job Title Not Available'}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          <span>{application.job?.company?.name || 'Company Name Not Available'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{application.job?.location || 'Location Not Available'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>Applied {application.applied_at ? format(new Date(application.applied_at), 'MMM dd, yyyy') : 'Date not available'}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(application.status)} border`}>
                      {formatStatus(application.status)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Application Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Job Type:</span>
                          <span className="text-slate-900">{application.job?.job_type || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Experience Level:</span>
                          <span className="text-slate-900">{application.job?.experience_level || 'Not specified'}</span>
                        </div>
                        {application.job?.salary_min && application.job?.salary_max && (
                          <div className="flex justify-between">
                            <span className="text-slate-600">Salary Range:</span>
                            <span className="text-slate-900">
                              {application.job.currency || 'USD'} {application.job.salary_min?.toLocaleString()} - {application.job.salary_max?.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Application Status</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">
                            Last updated: {application.updated_at ? format(new Date(application.updated_at), 'MMM dd, yyyy') : 'Not available'}
                          </span>
                        </div>
                        {application.hr_notes && (
                          <div className="mt-3">
                            <span className="text-slate-600 font-medium">HR Notes:</span>
                            <p className="text-slate-900 mt-1">{application.hr_notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {application.cover_letter && (
                    <>
                      <Separator className="my-4" />
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-2">Cover Letter</h4>
                        <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">
                          {application.cover_letter}
                        </p>
                      </div>
                    </>
                  )}

                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" size="sm" className="border-slate-300">
                      <Eye className="w-4 h-4 mr-2" />
                      View Job Details
                    </Button>
                    {application.resume_url && (
                      <Button variant="outline" size="sm" className="border-slate-300">
                        <Eye className="w-4 h-4 mr-2" />
                        View Resume
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSeekerApplications;
