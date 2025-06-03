import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const HREditJob = () => {
  const { id } = useParams();
  const [jobData, setJobData] = useState({
    title: 'Senior React Developer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    type: 'Full-time',
    description: 'We are looking for an experienced React developer...',
    requirements: '5+ years of React experience...',
    salary: '$100,000 - $130,000'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Job updated:', jobData);
    // Handle job update logic here
  };

  const handleDelete = () => {
    console.log('Job deleted:', id);
    // Handle job deletion logic here
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/hr/dashboard">
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Edit Job</h1>
            <p className="text-slate-300 mt-2">Update job posting details</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl">
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Job Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title" className="text-slate-200">Job Title</Label>
                  <Input
                    id="title"
                    value={jobData.title}
                    onChange={(e) => setJobData({...jobData, title: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="company" className="text-slate-200">Company Name</Label>
                  <Input
                    id="company"
                    value={jobData.company}
                    onChange={(e) => setJobData({...jobData, company: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="location" className="text-slate-200">Location</Label>
                  <Input
                    id="location"
                    value={jobData.location}
                    onChange={(e) => setJobData({...jobData, location: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="salary" className="text-slate-200">Salary Range</Label>
                  <Input
                    id="salary"
                    value={jobData.salary}
                    onChange={(e) => setJobData({...jobData, salary: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-slate-200">Job Description</Label>
                <Textarea
                  id="description"
                  value={jobData.description}
                  onChange={(e) => setJobData({...jobData, description: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white mt-2 min-h-32"
                />
              </div>

              <div>
                <Label htmlFor="requirements" className="text-slate-200">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={jobData.requirements}
                  onChange={(e) => setJobData({...jobData, requirements: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white mt-2 min-h-32"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              Update Job
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Job
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HREditJob;
