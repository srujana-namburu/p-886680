
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Mail, Phone } from "lucide-react";

const HRCandidates = () => {
  const candidates = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.johnson@email.com",
      phone: "+1 (555) 123-4567",
      appliedFor: "Senior React Developer",
      status: "Shortlisted",
      appliedDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob.smith@email.com",
      phone: "+1 (555) 987-6543",
      appliedFor: "UI/UX Designer",
      status: "Pending",
      appliedDate: "2024-01-14"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Candidates</h1>
            <p className="text-slate-300 mt-2">Manage job applications and candidates</p>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search candidates..."
              className="pl-10 bg-slate-800 border-slate-700 text-white"
            />
          </div>
          <Button variant="outline" className="border-slate-600 text-slate-200">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        <div className="grid gap-4">
          {candidates.map((candidate) => (
            <Card key={candidate.id} className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-2">{candidate.name}</h3>
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-300">{candidate.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-300">{candidate.phone}</span>
                      </div>
                    </div>
                    <p className="text-slate-400 mb-2">Applied for: <span className="text-white">{candidate.appliedFor}</span></p>
                    <p className="text-slate-400">Applied on: {candidate.appliedDate}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={candidate.status === 'Shortlisted' ? 'default' : 'secondary'}>
                      {candidate.status}
                    </Badge>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HRCandidates;
