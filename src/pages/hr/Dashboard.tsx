
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Briefcase, TrendingUp, Eye, Edit, Trash2, BarChart3, Clock, Star } from "lucide-react";
import { Link } from "react-router-dom";
import HRNav from "@/components/HRNav";

const HRDashboard = () => {
  const [jobs] = useState([
    {
      id: 1,
      title: 'Senior React Developer',
      company: 'Tech Corp',
      location: 'San Francisco, CA',
      applications: 15,
      status: 'Active',
      postedDate: '2024-01-15',
      views: 120,
      salary: '$100k - $130k'
    },
    {
      id: 2,
      title: 'UX Designer',
      company: 'Design Studio',
      location: 'Remote',
      applications: 8,
      status: 'Active',
      postedDate: '2024-01-12',
      views: 85,
      salary: '$80k - $110k'
    },
    {
      id: 3,
      title: 'Product Manager',
      company: 'StartupCo',
      location: 'New York, NY',
      applications: 22,
      status: 'Paused',
      postedDate: '2024-01-10',
      views: 200,
      salary: '$120k - $150k'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Paused': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Closed': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <HRNav />
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">HR Dashboard</h1>
            <p className="text-slate-400">Manage your recruitment pipeline and track performance</p>
          </div>
          <Link to="/hr/jobs/create">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Plus className="w-5 h-5 mr-2" />
              Create Job
            </Button>
          </Link>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Active Jobs</CardTitle>
              <Briefcase className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">12</div>
              <p className="text-xs text-green-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Total Applications</CardTitle>
              <Users className="h-5 w-5 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">248</div>
              <p className="text-xs text-green-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +18 this week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Placement Rate</CardTitle>
              <Star className="h-5 w-5 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">73%</div>
              <p className="text-xs text-green-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5% from last quarter
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Avg. Time to Hire</CardTitle>
              <Clock className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-1">18</div>
              <p className="text-xs text-slate-400">days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Job Listings */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-white text-xl">Your Job Postings</CardTitle>
                    <CardDescription className="text-slate-400">Manage and track your active job listings</CardDescription>
                  </div>
                  <Link to="/hr/candidates">
                    <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-700">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {jobs.map((job, index) => (
                  <div 
                    key={job.id} 
                    className="p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:bg-slate-700/50 transition-all duration-300 transform hover:scale-[1.02]"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white text-lg mb-1">{job.title}</h3>
                        <p className="text-slate-300 mb-2">{job.company} • {job.location}</p>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {job.applications} applications
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {job.views} views
                          </span>
                          <span>{job.salary}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`${getStatusColor(job.status)} border px-2 py-1`}>
                          {job.status}
                        </Badge>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="text-slate-400 hover:text-white">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Link to={`/hr/jobs/edit/${job.id}`}>
                            <Button size="sm" variant="ghost" className="text-slate-400 hover:text-blue-400">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button size="sm" variant="ghost" className="text-slate-400 hover:text-red-400">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Analytics */}
          <div className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-slate-400">Common recruitment tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/hr/candidates">
                  <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-200 hover:bg-slate-700">
                    <Users className="w-4 h-4 mr-2" />
                    View All Candidates
                  </Button>
                </Link>
                <Link to="/hr/resume-matcher">
                  <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-200 hover:bg-slate-700">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    AI Resume Matcher
                  </Button>
                </Link>
                <Link to="/hr/interview-summary">
                  <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-200 hover:bg-slate-700">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Interview Summary
                  </Button>
                </Link>
                <Link to="/hr/bias-detector">
                  <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-200 hover:bg-slate-700">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Bias Detector
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <p className="text-slate-300">New application received</p>
                  <p className="text-slate-500 text-xs">Senior React Developer • 2 hours ago</p>
                </div>
                <div className="text-sm">
                  <p className="text-slate-300">Interview scheduled</p>
                  <p className="text-slate-500 text-xs">UX Designer • 4 hours ago</p>
                </div>
                <div className="text-sm">
                  <p className="text-slate-300">Candidate shortlisted</p>
                  <p className="text-slate-500 text-xs">Product Manager • 6 hours ago</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
