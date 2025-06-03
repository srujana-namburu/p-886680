
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
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'reviewed':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'interviewing':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'offered':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'withdrawn':
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const formatStatus = (status: string) => {
    return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <JobSeekerNav />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-300">Loading your applications...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <JobSeekerNav />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-400 mb-4">Error loading applications</p>
              <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <JobSeekerNav />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/jobseeker/dashboard">
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">My Applications</h1>
            <p className="text-slate-300 mt-2">Track your job application status and progress</p>
          </div>
        </div>

        {!applications || applications.length === 0 ? (
          <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Applications Yet</h3>
              <p className="text-slate-300 mb-6">
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
              <Card key={application.id} className="bg-white/5 border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-white mb-2">
                        {application.job?.title || 'Job Title Not Available'}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-slate-300 mb-3">
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
                      <h4 className="font-semibold text-white mb-2">Application Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-300">Job Type:</span>
                          <span className="text-white">{application.job?.job_type || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-300">Experience Level:</span>
                          <span className="text-white">{application.job?.experience_level || 'Not specified'}</span>
                        </div>
                        {application.job?.salary_min && application.job?.salary_max && (
                          <div className="flex justify-between">
                            <span className="text-slate-300">Salary Range:</span>
                            <span className="text-white">
                              {application.job.currency || 'USD'} {application.job.salary_min?.toLocaleString()} - {application.job.salary_max?.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-white mb-2">Application Status</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">
                            Last updated: {application.updated_at ? format(new Date(application.updated_at), 'MMM dd, yyyy') : 'Not available'}
                          </span>
                        </div>
                        {application.hr_notes && (
                          <div className="mt-3">
                            <span className="text-slate-300 font-medium">HR Notes:</span>
                            <p className="text-white mt-1 bg-slate-800 p-2 rounded">{application.hr_notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {application.cover_letter && (
                    <>
                      <Separator className="my-4 bg-slate-600" />
                      <div>
                        <h4 className="font-semibold text-white mb-2">Cover Letter</h4>
                        <p className="text-sm text-slate-300 bg-slate-800 p-3 rounded-lg">
                          {application.cover_letter}
                        </p>
                      </div>
                    </>
                  )}

                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                      <Eye className="w-4 h-4 mr-2" />
                      View Job Details
                    </Button>
                    {application.resume_url && (
                      <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
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
