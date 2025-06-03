
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Briefcase, Users, Search, CheckCircle, Star, TrendingUp } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [animatedElements, setAnimatedElements] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimatedElements(true), 100);
  }, []);

  const features = [
    {
      icon: <Briefcase className="h-8 w-8 text-blue-500" />,
      title: "Smart Job Matching",
      description: "AI-powered job recommendations based on your skills and experience"
    },
    {
      icon: <Users className="h-8 w-8 text-emerald-500" />,
      title: "Candidate Management",
      description: "Comprehensive tools for HR professionals to manage talent pipeline"
    },
    {
      icon: <Search className="h-8 w-8 text-purple-500" />,
      title: "Advanced Filtering",
      description: "Find exactly what you're looking for with powerful search capabilities"
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      title: "Application Tracking",
      description: "Track your applications and manage candidate status seamlessly"
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Jobs", icon: <Briefcase className="h-5 w-5" /> },
    { number: "50,000+", label: "Job Seekers", icon: <Users className="h-5 w-5" /> },
    { number: "95%", label: "Success Rate", icon: <Star className="h-5 w-5" /> },
    { number: "500+", label: "Companies", icon: <TrendingUp className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
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

      {/* Navigation */}
      <nav className="relative z-10 p-6 flex justify-between items-center backdrop-blur-lg bg-white/5 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">TalentHub AI</span>
        </div>
        <div className="flex space-x-4">
          <Button 
            variant="ghost" 
            className="text-white hover:bg-white/10 transition-all duration-300"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
          <Button 
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 transition-all duration-300 transform hover:scale-105"
            onClick={() => navigate('/register')}
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div className={`max-w-4xl mx-auto transition-all duration-1000 ${animatedElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Badge className="mb-6 bg-blue-500/20 text-blue-300 border-blue-400/30 hover:bg-blue-500/30 transition-all duration-300">
            ✨ AI-Powered Recruitment Platform
          </Badge>
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Transform Your
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Hiring Process</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Connect top talent with dream opportunities using our revolutionary AI-powered platform. 
            Streamlined for both job seekers and HR professionals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 transition-all duration-300 transform hover:scale-105 px-8 py-6 text-lg"
              onClick={() => navigate('/register')}
            >
              Start Your Journey
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-blue-400 text-blue-300 hover:bg-blue-500/10 transition-all duration-300 px-8 py-6 text-lg"
              onClick={() => navigate('/login')}
            >
              Explore Platform
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card 
                key={index}
                className={`bg-white/5 border-white/10 backdrop-blur-lg transition-all duration-500 hover:bg-white/10 transform hover:scale-105 ${
                  animatedElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-2 text-blue-400">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <div className="text-slate-300 text-sm">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Everything you need to revolutionize your recruitment process
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={`bg-white/5 border-white/10 backdrop-blur-lg transition-all duration-500 hover:bg-white/10 transform hover:scale-105 ${
                  animatedElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-6">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-400/30 backdrop-blur-lg">
            <CardContent className="p-12">
              <h2 className="text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
              <p className="text-xl text-slate-300 mb-8">
                Join thousands of professionals who have transformed their hiring process
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 transition-all duration-300 transform hover:scale-105"
                  onClick={() => navigate('/register')}
                >
                  Create Account
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-blue-400 text-blue-300 hover:bg-blue-500/10 transition-all duration-300"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
