
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Briefcase, 
  Users, 
  Plus, 
  Settings,
  LogOut, 
  Menu, 
  X,
  Bell,
  BarChart3,
  Brain,
  FileText,
  MessageSquare,
  Shield
} from "lucide-react";

const HRNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const userName = localStorage.getItem('userName') || 'HR Manager';

  const navItems = [
    { path: '/hr/dashboard', label: 'Dashboard', icon: Briefcase },
    { path: '/hr/candidates', label: 'Candidates', icon: Users },
    { path: '/hr/jobs/create', label: 'Create Job', icon: Plus },
    { path: '/hr/resume-matcher', label: 'Resume Matcher', icon: Brain },
    { path: '/hr/interview-summary', label: 'Interview Summary', icon: FileText },
    { path: '/hr/chat-summarizer', label: 'Chat Summarizer', icon: MessageSquare },
    { path: '/hr/bias-detector', label: 'Bias Detector', icon: Shield },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    navigate('/');
  };

  const isActiveRoute = (path: string) => location.pathname === path;

  return (
    <nav className="bg-slate-900/95 border-b border-slate-700/50 backdrop-blur-lg sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">TalentHub</span>
            <span className="text-sm text-blue-400 bg-blue-500/10 px-2 py-1 rounded">HR</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  className={`flex items-center space-x-2 transition-all duration-300 ${
                    isActiveRoute(item.path)
                      ? 'text-blue-300 bg-blue-500/10 border-b-2 border-blue-400'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                </Button>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-white/10 relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                2
              </span>
            </Button>
            
            <div className="flex items-center space-x-3 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-white" />
              </div>
              <span className="text-white font-medium">{userName}</span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="text-slate-300 hover:text-white hover:bg-white/10"
            >
              <Settings className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-700/50 py-4 animate-in slide-in-from-top-5 duration-300">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className={`w-full justify-start flex items-center space-x-3 ${
                      isActiveRoute(item.path)
                        ? 'text-blue-300 bg-blue-500/10'
                        : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
              
              <div className="border-t border-slate-700/50 pt-4 mt-4">
                <div className="flex items-center space-x-3 px-3 py-2 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-white font-medium">{userName}</span>
                </div>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default HRNav;
