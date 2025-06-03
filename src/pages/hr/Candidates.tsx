
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Mail, Phone, MapPin, Calendar, Download, Eye, Star, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import HRNav from "@/components/HRNav";

const HRCandidates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const candidates = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.johnson@email.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      appliedFor: "Senior React Developer",
      status: "Shortlisted",
      appliedDate: "2024-01-15",
      experience: "5 years",
      rating: 4.5,
      resumeUrl: "/resumes/alice-johnson.pdf"
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob.smith@email.com",
      phone: "+1 (555) 987-6543",
      location: "Remote",
      appliedFor: "UX Designer",
      status: "Pending",
      appliedDate: "2024-01-14",
      experience: "3 years",
      rating: 4.2,
      resumeUrl: "/resumes/bob-smith.pdf"
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol.davis@email.com",
      phone: "+1 (555) 456-7890",
      location: "New York, NY",
      appliedFor: "Product Manager",
      status: "Interviewed",
      appliedDate: "2024-01-12",
      experience: "7 years",
      rating: 4.8,
      resumeUrl: "/resumes/carol-davis.pdf"
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david.wilson@email.com",
      phone: "+1 (555) 321-0987",
      location: "Austin, TX",
      appliedFor: "Senior React Developer",
      status: "Rejected",
      appliedDate: "2024-01-10",
      experience: "4 years",
      rating: 3.5,
      resumeUrl: "/resumes/david-wilson.pdf"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Shortlisted': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Interviewed': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Selected': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Rejected': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.appliedFor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || candidate.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    All: candidates.length,
    Pending: candidates.filter(c => c.status === 'Pending').length,
    Shortlisted: candidates.filter(c => c.status === 'Shortlisted').length,
    Interviewed: candidates.filter(c => c.status === 'Interviewed').length,
    Selected: candidates.filter(c => c.status === 'Selected').length,
    Rejected: candidates.filter(c => c.status === 'Rejected').length,
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <HRNav />
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Candidates</h1>
            <p className="text-slate-400">Manage job applications and track candidate progress</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-700">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
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
            <Button variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-700">
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
                    ? "bg-blue-500 text-white" 
                    : "border-slate-600 text-slate-300 hover:bg-slate-700"
                }`}
                onClick={() => setStatusFilter(status)}
              >
                {status} ({count})
              </Button>
            ))}
          </div>
        </div>

        {/* Candidates Grid */}
        <div className="grid gap-6">
          {filteredCandidates.map((candidate, index) => (
            <Card 
              key={candidate.id} 
              className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/70 transition-all duration-300 transform hover:scale-[1.01]"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                          {candidate.name}
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-slate-300">{candidate.rating}</span>
                          </div>
                        </h3>
                        <p className="text-lg text-blue-400 font-medium">{candidate.appliedFor}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">{candidate.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">{candidate.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">{candidate.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">Applied: {candidate.appliedDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <CheckCircle className="h-4 w-4 text-slate-400" />
                        <span className="text-sm">Experience: {candidate.experience}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3 min-w-fit">
                    <Badge className={`${getStatusColor(candidate.status)} border px-3 py-1`}>
                      {candidate.status}
                    </Badge>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-200 hover:bg-slate-700">
                        <Download className="h-4 w-4 mr-1" />
                        Resume
                      </Button>
                      <Link to={`/hr/candidates/${candidate.id}`}>
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

        {filteredCandidates.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-400 mb-2">No candidates found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HRCandidates;
