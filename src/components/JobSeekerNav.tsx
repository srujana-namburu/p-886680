import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/hooks/useSupabaseData";
import { useRealtimeManager } from "@/hooks/useRealtimeManager";
import { 
  Briefcase, 
  User, 
  FileText, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Settings
} from "lucide-react";
import NotificationPanel from "./NotificationPanel";

const JobSeekerNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();
  const { unreadCount } = useNotifications();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  
  // Initialize real-time subscriptions
  useRealtimeManager();
  
  const userName = profile?.full_name || user?.email?.split('@')[0] || 'Job Seeker';

  const navItems = [
    { path: '/jobseeker/dashboard', label: 'Dashboard', icon: Briefcase },
    { path: '/jobseeker/applications', label: 'Applications', icon: FileText },
    { path: '/jobseeker/profile', label: 'Profile', icon: User },
  ];

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error during logout:', error);
      window.location.href = '/';
    }
  };

  const isActiveRoute = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="bg-white/5 border-b border-white/10 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">TalentHub</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className={`flex items-center space-x-2 transition-all duration-300 text-white hover:text-white ${
                      isActiveRoute(item.path)
                        ? 'text-blue-300 bg-blue-500/10 border-b-2 border-blue-400'
                        : 'hover:bg-white/10'
                    }`}
                    onClick={() => navigate(item.path)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
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
                onClick={() => setIsNotificationPanelOpen(true)}
              >
                <Bell className="h-5 w-5" />
                {(unreadCount.data ?? 0) > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                    {unreadCount.data}
                  </span>
                )}
              </Button>
              
              <div className="flex items-center space-x-3 px-3 py-2 bg-white/5 rounded-lg border border-white/10">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
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
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-white/10 py-4 animate-in slide-in-from-top-5 duration-300">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.path}
                      variant="ghost"
                      className={`w-full justify-start flex items-center space-x-3 text-white hover:text-white ${
                        isActiveRoute(item.path)
                          ? 'text-blue-300 bg-blue-500/10'
                          : 'hover:bg-white/10'
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
                
                <div className="border-t border-white/10 pt-4 mt-4">
                  <div className="flex items-center justify-between px-3 py-2 mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="text-white font-medium">{userName}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-300 hover:text-white hover:bg-white/10 relative"
                      onClick={() => {
                        setIsNotificationPanelOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Bell className="h-5 w-5" />
                      {(unreadCount.data ?? 0) > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">
                          {unreadCount.data}
                        </span>
                      )}
                    </Button>
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

      {/* Notification Panel */}
      <NotificationPanel
        userType="jobseeker"
        isOpen={isNotificationPanelOpen}
        onClose={() => setIsNotificationPanelOpen(false)}
      />
    </>
  );
};

export default JobSeekerNav;
