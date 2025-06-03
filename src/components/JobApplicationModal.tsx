
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  X, 
  Upload, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  DollarSign,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
}

interface JobApplicationModalProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

const JobApplicationModal = ({ job, isOpen, onClose }: JobApplicationModalProps) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    currentJobTitle: "",
    currentCompany: "",
    yearsExperience: "",
    expectedSalary: "",
    availability: "",
    coverLetter: "",
    resume: null as File | null
  });

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, resume: file });
    }
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Application Submitted!",
        description: `Your application for ${job.title} at ${job.company} has been submitted successfully.`,
      });
      setIsSubmitting(false);
      onClose();
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Personal Information</h3>
              <p className="text-slate-300">Let's start with your basic details</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location" className="text-white">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, State"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Professional Details</h3>
              <p className="text-slate-300">Tell us about your professional background</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentJobTitle" className="text-white">Current Job Title</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    id="currentJobTitle"
                    name="currentJobTitle"
                    value={formData.currentJobTitle}
                    onChange={handleInputChange}
                    placeholder="e.g., Senior Developer"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentCompany" className="text-white">Current Company</Label>
                <Input
                  id="currentCompany"
                  name="currentCompany"
                  value={formData.currentCompany}
                  onChange={handleInputChange}
                  placeholder="Enter your current company"
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="yearsExperience" className="text-white">Years of Experience</Label>
                <Input
                  id="yearsExperience"
                  name="yearsExperience"
                  value={formData.yearsExperience}
                  onChange={handleInputChange}
                  placeholder="e.g., 5"
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expectedSalary" className="text-white">Expected Salary</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    id="expectedSalary"
                    name="expectedSalary"
                    value={formData.expectedSalary}
                    onChange={handleInputChange}
                    placeholder="e.g., $120,000"
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400"
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="availability" className="text-white">Availability to Start</Label>
              <Input
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                placeholder="e.g., Immediately, 2 weeks notice"
                className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Resume & Cover Letter</h3>
              <p className="text-slate-300">Upload your resume and write a cover letter</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="resume" className="text-white">Resume Upload</Label>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center bg-white/5 hover:bg-white/10 transition-colors">
                  <input
                    type="file"
                    id="resume"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label htmlFor="resume" className="cursor-pointer">
                    <Upload className="h-12 w-12 text-slate-400 mx-auto mb-2" />
                    <p className="text-white font-medium">
                      {formData.resume ? formData.resume.name : 'Click to upload your resume'}
                    </p>
                    <p className="text-slate-400 text-sm">PDF, DOC, DOCX (Max 5MB)</p>
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="coverLetter" className="text-white">Cover Letter</Label>
                <Textarea
                  id="coverLetter"
                  name="coverLetter"
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  placeholder="Write a compelling cover letter that highlights your interest in this position..."
                  rows={6}
                  className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 resize-none"
                />
                <div className="text-right text-slate-400 text-sm">
                  {formData.coverLetter.length}/500 characters
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Review Your Application</h3>
              <p className="text-slate-300">Please review your information before submitting</p>
            </div>
            
            <div className="space-y-4">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <h4 className="text-white font-semibold mb-2">Personal Information</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-slate-300">Name: <span className="text-white">{formData.fullName}</span></div>
                    <div className="text-slate-300">Email: <span className="text-white">{formData.email}</span></div>
                    <div className="text-slate-300">Phone: <span className="text-white">{formData.phone}</span></div>
                    <div className="text-slate-300">Location: <span className="text-white">{formData.location}</span></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <h4 className="text-white font-semibold mb-2">Professional Details</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-slate-300">Current Role: <span className="text-white">{formData.currentJobTitle}</span></div>
                    <div className="text-slate-300">Company: <span className="text-white">{formData.currentCompany}</span></div>
                    <div className="text-slate-300">Experience: <span className="text-white">{formData.yearsExperience} years</span></div>
                    <div className="text-slate-300">Expected Salary: <span className="text-white">{formData.expectedSalary}</span></div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-4">
                  <h4 className="text-white font-semibold mb-2">Documents</h4>
                  <div className="text-sm">
                    <div className="text-slate-300">Resume: <span className="text-white">{formData.resume?.name || 'No file uploaded'}</span></div>
                    <div className="text-slate-300 mt-2">Cover Letter: <span className="text-white">{formData.coverLetter ? `${formData.coverLetter.length} characters` : 'None'}</span></div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900/95 border-white/10 backdrop-blur-lg">
        <CardHeader className="border-b border-white/10">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl text-white mb-2">Apply for Position</CardTitle>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-blue-300">{job.title}</h3>
                <div className="flex items-center gap-4 text-slate-300">
                  <span>{job.company}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                    {job.type}
                  </Badge>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Progress Indicator */}
          <div className="flex justify-center mt-6">
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    step === currentStep
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white scale-110'
                      : step < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-white/20 text-slate-400'
                  }`}
                >
                  {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          {renderStepContent()}
          
          <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
            <div>
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  className="border-slate-400/30 text-slate-300 hover:bg-slate-500/10"
                  onClick={handlePrevStep}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
              )}
            </div>
            
            <div>
              {currentStep < 4 ? (
                <Button
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
                  onClick={handleNextStep}
                >
                  Next Step
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0 font-semibold px-8"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting...
                    </div>
                  ) : (
                    <>
                      Submit Application
                      <FileText className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobApplicationModal;
