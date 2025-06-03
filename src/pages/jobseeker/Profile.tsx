
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import JobSeekerNav from "@/components/JobSeekerNav";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Upload, 
  Save,
  Camera,
  Plus,
  X,
  Calendar,
  Building,
  GraduationCap
} from "lucide-react";

const JobSeekerProfile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    title: "Senior Frontend Developer",
    bio: "Passionate frontend developer with 5+ years of experience building responsive web applications using React, TypeScript, and modern CSS frameworks.",
    experience: [
      {
        id: "1",
        title: "Senior Frontend Developer",
        company: "TechCorp Solutions",
        duration: "2022 - Present",
        description: "Lead frontend development for multiple client projects, mentoring junior developers."
      },
      {
        id: "2",
        title: "Frontend Developer",
        company: "WebDev Agency",
        duration: "2020 - 2022",
        description: "Developed responsive websites and web applications using React and Vue.js."
      }
    ],
    education: [
      {
        id: "1",
        degree: "Bachelor of Computer Science",
        school: "University of California",
        year: "2020"
      }
    ],
    skills: ["React", "TypeScript", "JavaScript", "CSS/SCSS", "Node.js", "Git", "Figma", "Responsive Design"]
  });
  const [newSkill, setNewSkill] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    toast({
      title: "Profile Updated!",
      description: "Your profile has been successfully updated.",
    });
    setIsEditing(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <JobSeekerNav />
      
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              My <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Profile</span>
            </h1>
            <p className="text-xl text-slate-300">Manage your professional information</p>
          </div>
          <Button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`transition-all duration-300 ${
              isEditing 
                ? 'bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600'
            } text-white border-0`}
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Picture & Basic Info */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto">
                    <User className="h-16 w-16 text-white" />
                  </div>
                  {isEditing && (
                    <Button
                      size="sm"
                      className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-blue-500 hover:bg-blue-600"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/20 text-white text-center font-semibold"
                    />
                    <Input
                      name="title"
                      value={profileData.title}
                      onChange={handleInputChange}
                      className="bg-white/10 border-white/20 text-white text-center"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-white mb-1">{profileData.fullName}</h2>
                    <p className="text-blue-300 font-medium">{profileData.title}</p>
                  </>
                )}
                
                <div className="flex items-center justify-center gap-1 text-slate-300 mt-2">
                  <MapPin className="h-4 w-4" />
                  <span>{profileData.location}</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-slate-300">Email</Label>
                  {isEditing ? (
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        className="pl-10 bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-white">
                      <Mail className="h-4 w-4 text-slate-400" />
                      <span>{profileData.email}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-300">Phone</Label>
                  {isEditing ? (
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="pl-10 bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-white">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <span>{profileData.phone}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-300">Location</Label>
                  {isEditing ? (
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        name="location"
                        value={profileData.location}
                        onChange={handleInputChange}
                        className="pl-10 bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-white">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span>{profileData.location}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Resume Upload */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white">Resume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center bg-white/5 hover:bg-white/10 transition-colors">
                  <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-white font-medium mb-1">Upload New Resume</p>
                  <p className="text-slate-400 text-sm">PDF, DOC, DOCX (Max 5MB)</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 border-blue-400/30 text-blue-300 hover:bg-blue-500/10"
                  >
                    Choose File
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Me */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white">About Me</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    name="bio"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 resize-none"
                    placeholder="Write a brief description about yourself..."
                  />
                ) : (
                  <p className="text-slate-300 leading-relaxed">{profileData.bio}</p>
                )}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {profileData.skills.map((skill, index) => (
                    <Badge 
                      key={index}
                      className="bg-blue-500/20 text-blue-300 border-blue-400/30 relative group"
                    >
                      <span>{skill}</span>
                      {isEditing && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="ml-2 h-4 w-4 p-0 hover:bg-red-500/20 text-red-400"
                          onClick={() => removeSkill(skill)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      )}
                    </Badge>
                  ))}
                </div>
                
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill..."
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                      onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    />
                    <Button
                      onClick={addSkill}
                      variant="outline"
                      className="border-blue-400/30 text-blue-300 hover:bg-blue-500/10"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white">Work Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {profileData.experience.map((exp, index) => (
                  <div key={exp.id} className="relative">
                    {index > 0 && <div className="absolute left-6 -top-6 w-px h-6 bg-white/20" />}
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{exp.title}</h3>
                        <div className="flex items-center gap-2 text-blue-300 mb-2">
                          <Building className="h-4 w-4" />
                          <span>{exp.company}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{exp.duration}</span>
                          </div>
                        </div>
                        <p className="text-slate-300">{exp.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="bg-white/5 border-white/10 backdrop-blur-lg">
              <CardHeader>
                <CardTitle className="text-white">Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profileData.education.map((edu, index) => (
                  <div key={edu.id} className="flex gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{edu.degree}</h3>
                      <div className="flex items-center gap-2 text-emerald-300">
                        <span>{edu.school}</span>
                        <span>•</span>
                        <span>{edu.year}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerProfile;
