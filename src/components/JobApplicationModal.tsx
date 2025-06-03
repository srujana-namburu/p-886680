
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { applicationService, resumeService } from "@/services/supabaseService";
import { useAuth } from "@/hooks/useAuth";
import { Upload, FileText } from "lucide-react";
import type { JobPosting } from "@/types/database";

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobPosting | null;
  onApplicationSubmitted?: () => void;
}

const JobApplicationModal = ({ isOpen, onClose, job, onApplicationSubmitted }: JobApplicationModalProps) => {
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF or Word document.",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      setResumeFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!job || !user) return;

    setIsSubmitting(true);

    try {
      let resumeUrl = null;
      let resumeFilename = null;

      // Upload resume if provided
      if (resumeFile) {
        resumeUrl = await resumeService.uploadResume(resumeFile, user.id);
        if (!resumeUrl) {
          throw new Error('Failed to upload resume');
        }
        resumeFilename = resumeFile.name;
      }

      // Create application with status "pending" (which becomes "applied" in display)
      const application = await applicationService.createApplication({
        job_id: job.id,
        cover_letter: coverLetter || undefined,
        resume_url: resumeUrl || undefined,
        resume_filename: resumeFilename || undefined,
      });

      if (application) {
        toast({
          title: "Application submitted!",
          description: "Your application has been submitted successfully.",
        });
        
        // Reset form
        setCoverLetter('');
        setResumeFile(null);
        onClose();
        onApplicationSubmitted?.();
      } else {
        throw new Error('Failed to create application');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            Apply for {job.title}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="resume" className="text-slate-200 mb-2 block">
              Resume *
            </Label>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-slate-500 transition-colors">
              <input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
                required
              />
              <label
                htmlFor="resume"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                {resumeFile ? (
                  <>
                    <FileText className="h-8 w-8 text-blue-400" />
                    <span className="text-slate-200 font-medium">{resumeFile.name}</span>
                    <span className="text-slate-400 text-sm">Click to change file</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-slate-400" />
                    <span className="text-slate-200 font-medium">Upload your resume</span>
                    <span className="text-slate-400 text-sm">PDF, DOC, or DOCX (Max 5MB)</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="coverLetter" className="text-slate-200 mb-2 block">
              Cover Letter (Optional)
            </Label>
            <Textarea
              id="coverLetter"
              placeholder="Tell us why you're interested in this position and what makes you a great fit..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="min-h-[120px] bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
              rows={6}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-600 text-slate-200 hover:bg-slate-700"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isSubmitting || !resumeFile}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JobApplicationModal;
