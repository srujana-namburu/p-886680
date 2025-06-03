import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Briefcase, Mail, Lock, ArrowLeft, Users } from "lucide-react";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, user, profile, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "jobseeker"
  });
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && profile && !loading) {
      // Use the actual profile role instead of localStorage
      if (profile.role === 'hr_manager' || profile.role === 'admin' || profile.role === 'recruiter' || profile.role === 'interviewer') {
        navigate('/hr/dashboard');
      } else {
        navigate('/jobseeker/dashboard');
      }
    }
  }, [user, profile, loading, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUserTypeChange = (type: "jobseeker" | "hr") => {
    setFormData({ ...formData, userType: type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to sign in. Please check your credentials.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "Successfully signed in to your account.",
        });
        // Navigation will be handled by the useEffect hook based on actual profile data
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

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
            <CardTitle className="text-3xl font-bold text-white">Welcome Back</CardTitle>
            <p className="text-slate-300 mt-2">Sign in to your TalentHub account</p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* User Type Selection */}
            <div className="space-y-3">
              <Label className="text-white text-sm font-medium">I am a:</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={formData.userType === 'jobseeker' ? 'default' : 'outline'}
                  className={`h-12 transition-all duration-300 ${
                    formData.userType === 'jobseeker'
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 shadow-lg'
                      : 'border-blue-400/30 text-blue-300 hover:bg-blue-500/10'
                  }`}
                  onClick={() => handleUserTypeChange('jobseeker')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Job Seeker
                </Button>
                <Button
                  type="button"
                  variant={formData.userType === 'hr' ? 'default' : 'outline'}
                  className={`h-12 transition-all duration-300 ${
                    formData.userType === 'hr'
                      ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white border-0 shadow-lg'
                      : 'border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/10'
                  }`}
                  onClick={() => handleUserTypeChange('hr')}
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  HR Professional
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
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
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:border-blue-400 focus:ring-blue-400/20 h-12"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 font-semibold transition-all duration-300 transform hover:scale-105"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-slate-300">
                Don't have an account?{' '}
                <Button
                  variant="link"
                  className="text-blue-400 hover:text-blue-300 p-0 h-auto font-medium"
                  onClick={() => navigate('/register')}
                >
                  Create Account
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
