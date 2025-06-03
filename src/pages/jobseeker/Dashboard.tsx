
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import JobSeekerNav from "@/components/JobSeekerNav";
import JobApplicationModal from "@/components/JobApplicationModal";
import AIChat from "@/components/AIChat";
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  Building, 
  ChevronDown, 
  ChevronUp, 
  Filter,
  Heart,
  Eye,
  Briefcase,
  Users,
  Star
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  postedDate: string;
  description: string;
  requirements: string[];
  benefits: string[];
  experience: string;
  isExpanded?: boolean;
  isSaved?: boolean;
}

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filters, setFilters] = useState({
    jobType: "",
    experience: "",
    salary: { min: 0, max: 200000 },
    location: ""
  });

  // Mock job data - In real app, this would come from API
  useEffect(() => {
    const mockJobs: Job[] = [
      {
        id: "1",
        title: "Senior Frontend Developer",
        company: "TechCorp Solutions",
        location: "San Francisco, CA",
        type: "Full-time",
        salary: "$120,000 - $150,000",
        postedDate: "2 days ago",
        description: "Join our innovative team building next-generation web applications. We're looking for a passionate frontend developer who loves creating amazing user experiences.",
        requirements: ["React", "TypeScript", "CSS/SCSS", "5+ years experience"],
        benefits: ["Health Insurance", "401k", "Remote Work", "Stock Options"],
        experience: "Senior"
      },
      {
        id: "2",
        title: "UX/UI Designer",
        company: "Design Studio Pro",
        location: "New York, NY",
        type: "Full-time",
        salary: "$85,000 - $110,000",
        postedDate: "1 week ago",
        description: "Create beautiful and intuitive user interfaces that delight our customers. Work closely with product and engineering teams.",
        requirements: ["Figma", "Adobe Creative Suite", "Prototyping", "3+ years experience"],
        benefits: ["Health Insurance", "Flexible Hours", "Design Budget", "PTO"],
        experience: "Mid-level"
      },
      {
        id: "3",
        title: "Data Scientist",
        company: "AI Innovations Inc",
        location: "Austin, TX",
        type: "Full-time",
        salary: "$100,000 - $130,000",
        postedDate: "3 days ago",
        description: "Analyze complex datasets to drive business decisions. Build machine learning models and create data visualizations.",
        requirements: ["Python", "SQL", "Machine Learning", "Statistics", "4+ years experience"],
        benefits: ["Health Insurance", "Research Budget", "Conference Travel", "Stock Options"],
        experience: "Senior"
      },
      {
        id: "4",
        title: "Marketing Manager",
        company: "Growth Marketing Co",
        location: "Remote",
        type: "Full-time",
        salary: "$70,000 - $90,000",
        postedDate: "5 days ago",
        description: "Lead our marketing efforts across digital channels. Develop strategies to increase brand awareness and drive growth.",
        requirements: ["Digital Marketing", "Analytics", "Content Strategy", "3+ years experience"],
        benefits: ["Health Insurance", "Remote Work", "Marketing Budget", "Professional Development"],
        experience: "Mid-level"
      }
    ];
    setJobs(mockJobs);
  }, []);

  const toggleJobExpansion = (jobId: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, isExpanded: !job.isExpanded } : job
    ));
  };

  const handleApplyToJob = (job: Job) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const handleSaveJob = (jobId: string) => {
    setJobs(jobs.map(job => 
      job.id === jobId ? { ...job, isSaved: !job.isSaved } : job
    ));
    toast({
      title: "Job Saved!",
      description: "Job has been added to your saved jobs.",
    });
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = !filters.jobType || job.type === filters.jobType;
    const matchesExperience = !filters.experience || job.experience === filters.experience;
    const matchesLocation = !filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase());
    
    return matchesSearch && matchesType && matchesExperience && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <JobSeekerNav />
      
      <div className="container mx-auto px-6 py-8">
        {/* Hero Search Section */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Find Your <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Dream Job</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8">Discover amazing opportunities with AI-powered matching</p>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search for jobs, companies, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-14 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 text-lg"
                />
              </div>
              <Button
                variant="outline"
                className="h-14 px-6 border-blue-400/30 text-blue-300 hover:bg-blue-500/10"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </Button>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <Card className="bg-white/5 border-white/10 backdrop-blur-lg mb-6 animate-in slide-in-from-top-5 duration-300">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Job Type</label>
                      <select
                        value={filters.jobType}
                        onChange={(e) => setFilters({...filters, jobType: e.target.value})}
                        className="w-full h-10 bg-white/10 border-white/20 text-white rounded-md px-3"
                      >
                        <option value="">All Types</option>
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Remote">Remote</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Experience</label>
                      <select
                        value={filters.experience}
                        onChange={(e) => setFilters({...filters, experience: e.target.value})}
                        className="w-full h-10 bg-white/10 border-white/20 text-white rounded-md px-3"
                      >
                        <option value="">All Levels</option>
                        <option value="Entry-level">Entry-level</option>
                        <option value="Mid-level">Mid-level</option>
                        <option value="Senior">Senior</option>
                        <option value="Executive">Executive</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Location</label>
                      <Input
                        placeholder="Enter location"
                        value={filters.location}
                        onChange={(e) => setFilters({...filters, location: e.target.value})}
                        className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        variant="outline"
                        className="w-full border-slate-400/30 text-slate-300 hover:bg-slate-500/10"
                        onClick={() => setFilters({jobType: "", experience: "", salary: {min: 0, max: 200000}, location: ""})}
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Job Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Briefcase className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">{filteredJobs.length}</div>
              <div className="text-slate-300 text-sm">Available Jobs</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Building className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">150+</div>
              <div className="text-slate-300 text-sm">Companies</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">5,000+</div>
              <div className="text-slate-300 text-sm">Active Job Seekers</div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300">
            <CardContent className="p-6 text-center">
              <Star className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-white">95%</div>
              <div className="text-slate-300 text-sm">Success Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredJobs.map((job, index) => (
            <Card 
              key={job.id}
              className="bg-white/5 border-white/10 backdrop-blur-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl animate-in slide-in-from-bottom-5"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-white">{job.title}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1"
                        onClick={() => handleSaveJob(job.id)}
                      >
                        <Heart className={`h-5 w-5 ${job.isSaved ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 text-slate-300 mb-3">
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        <span>{job.company}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{job.postedDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                        {job.type}
                      </Badge>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30">
                        {job.experience}
                      </Badge>
                      <div className="flex items-center gap-1 text-green-400">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-semibold">{job.salary}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      className="border-blue-400/30 text-blue-300 hover:bg-blue-500/10"
                      onClick={() => toggleJobExpansion(job.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {job.isExpanded ? 'Hide' : 'View'} Details
                      {job.isExpanded ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                    </Button>
                  </div>
                </div>

                {/* Expanded Content */}
                {job.isExpanded && (
                  <div className="border-t border-white/10 pt-6 space-y-6 animate-in slide-in-from-top-5 duration-300">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Job Description</h4>
                      <p className="text-slate-300 leading-relaxed">{job.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Requirements</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.requirements.map((req, index) => (
                          <Badge key={index} className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Benefits</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.benefits.map((benefit, index) => (
                          <Badge key={index} className="bg-green-500/20 text-green-300 border-green-400/30">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <Button
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 transition-all duration-300 transform hover:scale-105 px-8"
                        onClick={() => handleApplyToJob(job)}
                      >
                        Apply Now
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
            <CardContent className="p-12 text-center">
              <Search className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">No jobs found</h3>
              <p className="text-slate-300">Try adjusting your search criteria or filters</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Job Application Modal */}
      {showApplicationModal && selectedJob && (
        <JobApplicationModal
          job={selectedJob}
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
        />
      )}

      {/* AI Chat Component */}
      <AIChat />
    </div>
  );
};

export default JobSeekerDashboard;
