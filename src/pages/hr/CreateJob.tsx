import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { jobService } from "@/services/supabaseService";
import { useAuth } from "@/hooks/useAuth";

const HRCreateJob = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobData, setJobData] = useState({
    title: '',
    description: '',
    requirements: '',
    responsibilities: '',
    location: '',
    job_type: 'full-time',
    experience_level: 'mid-level',
    salary_min: '',
    salary_max: '',
    currency: 'USD',
    department: '',
    company_id: '',
    expires_at: '',
    is_featured: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a job.",
        variant: "destructive",
      });
      return;
    }

    if (!jobData.title || !jobData.description || !jobData.requirements || !jobData.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const jobToCreate = {
        title: jobData.title.trim(),
        description: jobData.description.trim(),
        requirements: jobData.requirements.trim(),
        responsibilities: jobData.responsibilities.trim(),
        location: jobData.location.trim(),
        job_type: jobData.job_type,
        experience_level: jobData.experience_level,
        salary_min: jobData.salary_min ? parseInt(jobData.salary_min) : null,
        salary_max: jobData.salary_max ? parseInt(jobData.salary_max) : null,
        currency: jobData.currency,
        department: jobData.department.trim() || null,
        company_id: jobData.company_id.trim() || null,
        expires_at: jobData.expires_at ? new Date(jobData.expires_at).toISOString() : null,
        is_featured: jobData.is_featured
      };

      console.log('Creating job with data:', jobToCreate);
      console.log('Current user:', user);

      const result = await jobService.createJob(jobToCreate);

      if (result) {
        toast({
          title: "Success!",
          description: "Job posting created successfully.",
        });
        navigate('/hr/dashboard');
      } else {
        throw new Error('Failed to create job');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      toast({
        title: "Error",
        description: "Failed to create job posting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/hr/dashboard">
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-200 bg-slate-800 hover:bg-slate-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Create New Job</h1>
            <p className="text-slate-300 mt-2">Post a new job opening</p>
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
                  <Label htmlFor="title" className="text-slate-200">Job Title *</Label>
                  <Input
                    id="title"
                    value={jobData.title}
                    onChange={(e) => setJobData({...jobData, title: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                    placeholder="e.g. Senior React Developer"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="location" className="text-slate-200">Location *</Label>
                  <Input
                    id="location"
                    value={jobData.location}
                    onChange={(e) => setJobData({...jobData, location: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                    placeholder="e.g. San Francisco, CA"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="department" className="text-slate-200">Department</Label>
                  <Input
                    id="department"
                    value={jobData.department}
                    onChange={(e) => setJobData({...jobData, department: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                    placeholder="e.g. Engineering, Marketing"
                  />
                </div>
                <div>
                  <Label htmlFor="company_id" className="text-slate-200">Company ID</Label>
                  <Input
                    id="company_id"
                    value={jobData.company_id}
                    onChange={(e) => setJobData({...jobData, company_id: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                    placeholder="Optional: Company UUID"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="job_type" className="text-slate-200">Job Type</Label>
                  <select
                    id="job_type"
                    value={jobData.job_type}
                    onChange={(e) => setJobData({...jobData, job_type: e.target.value})}
                    className="w-full mt-2 bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="remote">Remote</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="experience_level" className="text-slate-200">Experience Level</Label>
                  <select
                    id="experience_level"
                    value={jobData.experience_level}
                    onChange={(e) => setJobData({...jobData, experience_level: e.target.value})}
                    className="w-full mt-2 bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="entry-level">Entry Level</option>
                    <option value="mid-level">Mid Level</option>
                    <option value="senior">Senior</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label htmlFor="salary_min" className="text-slate-200">Minimum Salary</Label>
                  <Input
                    id="salary_min"
                    type="number"
                    value={jobData.salary_min}
                    onChange={(e) => setJobData({...jobData, salary_min: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                    placeholder="e.g. 80000"
                  />
                </div>
                <div>
                  <Label htmlFor="salary_max" className="text-slate-200">Maximum Salary</Label>
                  <Input
                    id="salary_max"
                    type="number"
                    value={jobData.salary_max}
                    onChange={(e) => setJobData({...jobData, salary_max: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white mt-2"
                    placeholder="e.g. 120000"
                  />
                </div>
                <div>
                  <Label htmlFor="currency" className="text-slate-200">Currency</Label>
                  <select
                    id="currency"
                    value={jobData.currency}
                    onChange={(e) => setJobData({...jobData, currency: e.target.value})}
                    className="w-full mt-2 bg-slate-700 border-slate-600 text-white rounded-md px-3 py-2"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                    <option value="INR">INR</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="expires_at" className="text-slate-200">Job Expiration Date</Label>
                <Input
                  id="expires_at"
                  type="datetime-local"
                  value={jobData.expires_at}
                  onChange={(e) => setJobData({...jobData, expires_at: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white mt-2"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="is_featured"
                  type="checkbox"
                  checked={jobData.is_featured}
                  onChange={(e) => setJobData({...jobData, is_featured: e.target.checked})}
                  className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded focus:ring-blue-500"
                />
                <Label htmlFor="is_featured" className="text-slate-200">Featured Job</Label>
              </div>

              <div>
                <Label htmlFor="description" className="text-slate-200">Job Description *</Label>
                <Textarea
                  id="description"
                  value={jobData.description}
                  onChange={(e) => setJobData({...jobData, description: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white mt-2 min-h-32"
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="responsibilities" className="text-slate-200">Key Responsibilities</Label>
                <Textarea
                  id="responsibilities"
                  value={jobData.responsibilities}
                  onChange={(e) => setJobData({...jobData, responsibilities: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white mt-2 min-h-32"
                  placeholder="List the main responsibilities and duties..."
                />
              </div>

              <div>
                <Label htmlFor="requirements" className="text-slate-200">Requirements *</Label>
                <Textarea
                  id="requirements"
                  value={jobData.requirements}
                  onChange={(e) => setJobData({...jobData, requirements: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white mt-2 min-h-32"
                  placeholder="List the required skills, experience, and qualifications..."
                  required
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Creating...' : 'Post Job'}
            </Button>
            <Button type="button" variant="outline" className="border-slate-600 text-slate-200 bg-slate-800 hover:bg-slate-700">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HRCreateJob;
