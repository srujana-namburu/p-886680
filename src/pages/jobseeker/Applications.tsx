
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import JobSeekerNav from "@/components/JobSeekerNav";
import { 
  Search, 
  Filter, 
  Calendar, 
  Building, 
  MapPin, 
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  Clock3,
  Star,
  FileText
} from "lucide-react";

interface Application {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'interview' | 'offered';
  salary: string;
  jobType: string;
}

const JobSeekerApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    // Mock application data
    const mockApplications: Application[] = [
      {
        id: "1",
        jobTitle: "Senior Frontend Developer",
        company: "TechCorp Solutions",
        location: "San Francisco, CA",
        appliedDate: "2024-01-15",
        status: "interview",
        salary: "$120,000 - $150,000",
        jobType: "Full-time"
      },
      {
        id: "2",
        jobTitle: "UX/UI Designer",
        company: "Design Studio Pro",
        location: "New York, NY",
        appliedDate: "2024-01-10",
        status: "shortlisted",
        salary: "$85,000 - $110,000",
        jobType: "Full-time"
      },
      {
        id: "3",
        jobTitle: "Data Scientist",
        company: "AI Innovations Inc",
        location: "Austin, TX",
        appliedDate: "2024-01-08",
        status: "reviewed",
        salary: "$100,000 - $130,000",
        jobType: "Full-time"
      },
      {
        id: "4",
        jobTitle: "Marketing Manager",
        company: "Growth Marketing Co",
        location: "Remote",
        appliedDate: "2024-01-05",
        status: "pending",
        salary: "$70,000 - $90,000",
        jobType: "Full-time"
      },
      {
        id: "5",
        jobTitle: "Software Engineer",
        company: "StartupXYZ",
        location: "Seattle, WA",
        appliedDate: "2024-01-03",
        status: "rejected",
        salary: "$90,000 - $120,000",
        jobType: "Full-time"
      }
    ];
    setApplications(mockApplications);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock3 className="h-4 w-4" />;
      case 'reviewed':
        return <Eye className="h-4 w-4" />;
      case 'shortlisted':
        return <Star className="h-4 w-4" />;
      case 'interview':
        return <Calendar className="h-4 w-4" />;
      case 'offered':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock3 className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'reviewed':
        return 'bg-blue-500/20 text-blue-300 border-blue-400/30';
      case 'shortlisted':
        return 'bg-purple-500/20 text-purple-300 border-purple-400/30';
      case 'interview':
        return 'bg-orange-500/20 text-orange-300 border-orange-400/30';
      case 'offered':
        return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-400/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <JobSeekerNav />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            My <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Applications</span>
          </h1>
          <p className="text-xl text-slate-300">Track your job applications and their status</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card className="bg-white/5 border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-white">{applications.length}</div>
              <div className="text-slate-300 text-sm">Total</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{statusCounts.pending || 0}</div>
              <div className="text-slate-300 text-sm">Pending</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{statusCounts.reviewed || 0}</div>
              <div className="text-slate-300 text-sm">Reviewed</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{statusCounts.shortlisted || 0}</div>
              <div className="text-slate-300 text-sm">Shortlisted</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">{statusCounts.interview || 0}</div>
              <div className="text-slate-300 text-sm">Interview</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{statusCounts.offered || 0}</div>
              <div className="text-slate-300 text-sm">Offered</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-lg mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-4 h-11 bg-white/10 border border-white/20 text-white rounded-md appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="interview">Interview</option>
                  <option value="offered">Offered</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.map((application, index) => (
            <Card 
              key={application.id}
              className="bg-white/5 border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.01] animate-in slide-in-from-bottom-5"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{application.jobTitle}</h3>
                      <Badge className={getStatusColor(application.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(application.status)}
                          <span className="capitalize">{application.status}</span>
                        </div>
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-4 text-slate-300 mb-3">
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        <span>{application.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{application.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Applied {new Date(application.appliedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
                        {application.jobType}
                      </Badge>
                      <span className="text-green-400 font-semibold">{application.salary}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-400/30 text-blue-300 hover:bg-blue-500/10"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-400/30 text-slate-300 hover:bg-slate-500/10"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      View Application
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">No applications found</h3>
              <p className="text-slate-300">Try adjusting your search criteria or start applying to jobs</p>
              <Button 
                className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
                onClick={() => window.location.href = '/jobseeker/dashboard'}
              >
                Browse Jobs
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JobSeekerApplications;
