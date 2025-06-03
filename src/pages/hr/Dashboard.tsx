
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Briefcase, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const HRDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">HR Dashboard</h1>
            <p className="text-slate-300 mt-2">Manage your recruitment pipeline</p>
          </div>
          <Link to="/hr/jobs/create">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Job
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">12</div>
              <p className="text-xs text-slate-400">+2 from last month</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Total Candidates</CardTitle>
              <Users className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">248</div>
              <p className="text-xs text-slate-400">+18 this week</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-200">Placement Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">73%</div>
              <p className="text-xs text-slate-400">+5% from last quarter</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Jobs</CardTitle>
              <CardDescription className="text-slate-400">Your latest job postings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-slate-700 rounded-lg">
                  <div>
                    <h3 className="font-medium text-white">Senior React Developer</h3>
                    <p className="text-sm text-slate-400">Posted 2 days ago • 15 applications</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-200">
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-slate-400">Common recruitment tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link to="/hr/candidates">
                  <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-200">
                    <Users className="w-4 h-4 mr-2" />
                    View All Candidates
                  </Button>
                </Link>
                <Link to="/hr/jobs/create">
                  <Button variant="outline" className="w-full justify-start border-slate-600 text-slate-200">
                    <Plus className="w-4 h-4 mr-2" />
                    Post New Job
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
