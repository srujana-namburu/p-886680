
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, Mail, Lock, User, Building, ArrowLeft, Users, CheckCircle } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    userType: "jobseeker",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    companyName: "",
    position: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (type: "jobseeker" | "hr") => {
    setFormData({ ...formData, userType: type });
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate registration
    setTimeout(() => {
      localStorage.setItem('userType', formData.userType);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userName', formData.fullName);
      localStorage.setItem('isAuthenticated', 'true');
      
      toast({
        title: "Account Created!",
        description: "Welcome to TalentHub AI. Your account has been created successfully.",
      });

      if (formData.userType === 'hr') {
        navigate('/hr/dashboard');
      } else {
        navigate('/jobseeker/dashboard');
      }
      setIsLoading(false);
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Choose Your Role</h3>
              <p className="text-slate-300">How will you be using TalentHub?</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Button
                type="button"
                variant={formData.userType === 'jobseeker' ? 'default' : 'outline'}
                className={`h-16 transition-all duration-300 ${
                  formData.userType === 'jobseeker'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg scale-105'
                    : 'border-blue-400/30 text-blue-300 hover:bg-blue-500/10'
                }`}
                onClick={() => handleUserTypeChange('jobseeker')}
              >
                <div className="flex flex-col items-center">
                  <Users className="h-6 w-6 mb-1" />
                  <span className="font-semibold">Job Seeker</span>
                  <span className="text-xs opacity-80">Find your dream job</span>
                </div>
              </Button>
              <Button
                type="button"
                variant={formData.userType === 'hr' ? 'default' : 'outline'}
                className={`h-16 transition-all duration-300 ${
                  formData.userType === 'hr'
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white border-0 shadow-lg scale-105'
                    : 'border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/10'
                }`}
                onClick={() => handleUserTypeChange('hr')}
              >
                <div className="flex flex-col items-center">
                  <Briefcase className="h-6 w-6 mb-1" />
                  <span className="font-semibold">HR Professional</span>
                  <span className="text-xs opacity-80">Recruit top talent</span>
                </div>
              </Button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Account Details</h3>
              <p className="text-slate-300">Create your secure account</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 h-12"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 h-12"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Personal Information</h3>
              <p className="text-slate-300">Tell us a bit about yourself</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-white">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 h-12"
                    required
                  />
                </div>
              </div>

              {formData.userType === 'hr' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-white">Company Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <Input
                        id="companyName"
                        name="companyName"
                        type="text"
                        placeholder="Enter your company name"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-white">Your Position</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                      <Input
                        id="position"
                        name="position"
                        type="text"
                        placeholder="e.g., HR Manager, Recruiter"
                        value={formData.position}
                        onChange={handleInputChange}
                        className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 h-12"
                        required
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 text-blue-300 hover:text-white hover:bg-white/10 transition-all duration-300"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <Card className="bg-white/5 border-white/10 backdrop-blur-lg shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-white">Join TalentHub</CardTitle>
            <p className="text-slate-300 mt-2">Create your account in 3 simple steps</p>
            
            {/* Progress Indicator */}
            <div className="flex justify-center mt-6">
              <div className="flex space-x-2">
                {[1, 2, 3].map((step) => (
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
          
          <CardContent>
            <form onSubmit={handleSubmit}>
              {renderStepContent()}
              
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    className="border-slate-400/30 text-slate-300 hover:bg-slate-500/10"
                    onClick={handlePrevStep}
                  >
                    Previous
                  </Button>
                )}
                
                <div className="flex-1" />
                
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 transition-all duration-300"
                    onClick={handleNextStep}
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0 font-semibold transition-all duration-300 transform hover:scale-105"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating Account...
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                )}
              </div>
            </form>

            <div className="text-center mt-6">
              <p className="text-slate-300">
                Already have an account?{' '}
                <Button
                  variant="link"
                  className="text-blue-400 hover:text-blue-300 p-0 h-auto font-medium"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
