
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, User, Mail, Phone, MapPin, Building, Linkedin, Save, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import JobSeekerNav from "@/components/JobSeekerNav";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const JobSeekerProfile = () => {
  const { user, profile, updateProfile, loading } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || user?.email || '',
    phone: profile?.phone || '',
    location: profile?.location || '',
    company_name: profile?.company_name || '',
    linkedin_url: profile?.linkedin_url || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setIsUpdating(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast({
        title: "Success!",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: profile?.full_name || '',
      email: profile?.email || user?.email || '',
      phone: profile?.phone || '',
      location: profile?.location || '',
      company_name: profile?.company_name || '',
      linkedin_url: profile?.linkedin_url || '',
    });
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <JobSeekerNav />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-300">Loading your profile...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <JobSeekerNav />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/jobseeker/dashboard">
            <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <p className="text-slate-300 mt-2">Manage your personal information and preferences</p>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-xl text-white">
                  {profile?.full_name || 'Your Name'}
                </CardTitle>
                <p className="text-slate-300">{profile?.role === 'jobseeker' ? 'Job Seeker' : profile?.role || 'Job Seeker'}</p>
                <Badge variant="outline" className="w-fit mx-auto mt-2 border-green-500/30 text-green-300">
                  {profile?.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300">{profile?.email || user?.email || 'Email not available'}</span>
                  </div>
                  {profile?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{profile.phone}</span>
                    </div>
                  )}
                  {profile?.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-300">{profile.location}</span>
                    </div>
                  )}
                  {profile?.linkedin_url && (
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4 text-slate-400" />
                      <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline">
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-xl text-white">Personal Information</CardTitle>
                <p className="text-slate-300">Update your personal details and contact information</p>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="full_name" className="text-slate-300">Full Name</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`mt-2 bg-white/10 border-white/20 text-white placeholder:text-slate-400 ${!isEditing ? 'opacity-50' : ''}`}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={true} // Email should not be editable
                        className="mt-2 bg-white/5 border-white/10 text-slate-400 opacity-50"
                        placeholder="Enter your email"
                      />
                      <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`mt-2 bg-white/10 border-white/20 text-white placeholder:text-slate-400 ${!isEditing ? 'opacity-50' : ''}`}
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location" className="text-slate-300">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`mt-2 bg-white/10 border-white/20 text-white placeholder:text-slate-400 ${!isEditing ? 'opacity-50' : ''}`}
                        placeholder="Enter your location"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="company_name" className="text-slate-300">Current Company</Label>
                      <Input
                        id="company_name"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`mt-2 bg-white/10 border-white/20 text-white placeholder:text-slate-400 ${!isEditing ? 'opacity-50' : ''}`}
                        placeholder="Enter your current company"
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin_url" className="text-slate-300">LinkedIn URL</Label>
                      <Input
                        id="linkedin_url"
                        name="linkedin_url"
                        value={formData.linkedin_url}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className={`mt-2 bg-white/10 border-white/20 text-white placeholder:text-slate-400 ${!isEditing ? 'opacity-50' : ''}`}
                        placeholder="Enter your LinkedIn profile URL"
                      />
                    </div>
                  </div>

                  {isEditing && (
                    <>
                      <Separator className="bg-slate-600" />
                      <div className="flex gap-4">
                        <Button 
                          type="button" 
                          onClick={handleSave}
                          disabled={isUpdating}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {isUpdating ? 'Saving...' : 'Save Changes'}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={handleCancel}
                          disabled={isUpdating}
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-lg mt-6">
              <CardHeader>
                <CardTitle className="text-xl text-white">Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div>
                    <Label className="text-slate-300">Account Status</Label>
                    <div className="mt-2">
                      <Badge variant={profile?.is_active ? "default" : "secondary"} className={profile?.is_active ? "bg-green-500/20 text-green-300 border-green-500/30" : ""}>
                        {profile?.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-300">Member Since</Label>
                    <p className="mt-2 text-slate-400">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Date not available'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-slate-300">Last Login</Label>
                    <p className="mt-2 text-slate-400">
                      {profile?.last_login_at ? new Date(profile.last_login_at).toLocaleDateString() : 'Not available'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-slate-300">User ID</Label>
                    <p className="mt-2 text-slate-400 font-mono text-xs">
                      {user?.id || 'Not available'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerProfile;
