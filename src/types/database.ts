
export type UserRole = 'admin' | 'hr_manager' | 'recruiter' | 'interviewer' | 'jobseeker';
export type ApplicationStatus = 'pending' | 'shortlisted' | 'interviewed' | 'selected' | 'rejected' | 'withdrawn';
export type JobStatus = 'draft' | 'active' | 'paused' | 'closed' | 'archived';
export type InterviewType = 'phone' | 'video' | 'in_person' | 'technical' | 'behavioral';
export type AIAnalysisType = 'resume_match' | 'bias_detection' | 'interview_summary' | 'chat_summary';
export type NotificationType = 'application_received' | 'status_change' | 'interview_scheduled' | 'message_received' | 'system_alert';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  company_name?: string;
  avatar_url?: string;
  phone?: string;
  location?: string;
  linkedin_url?: string;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  description?: string;
  website?: string;
  logo_url?: string;
  industry?: string;
  size_range?: string;
  location?: string;
  founded_year?: number;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface JobPosting {
  id: string;
  title: string;
  description: string;
  requirements: string;
  responsibilities?: string;
  salary_min?: number;
  salary_max?: number;
  currency: string;
  location: string;
  job_type: string;
  experience_level: string;
  department?: string;
  status: JobStatus;
  company_id?: string;
  posted_by?: string;
  applications_count: number;
  views_count: number;
  expires_at?: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  company?: Company;
  job_skills?: JobSkill[];
}

export interface JobSkill {
  id: string;
  job_id: string;
  skill_name: string;
  is_required: boolean;
  experience_years?: number;
  created_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  status: ApplicationStatus;
  cover_letter?: string;
  resume_url?: string;
  resume_filename?: string;
  application_source?: string;
  rating?: number;
  notes?: string;
  screening_score?: number;
  hr_notes?: string;
  rejection_reason?: string;
  applied_at: string;
  last_updated_by?: string;
  created_at: string;
  updated_at: string;
  job?: JobPosting;
  candidate?: Profile;
}

export interface Interview {
  id: string;
  application_id: string;
  interviewer_id?: string;
  interview_type: InterviewType;
  scheduled_at: string;
  duration_minutes: number;
  location?: string;
  meeting_link?: string;
  status: string;
  feedback?: string;
  technical_score?: number;
  cultural_score?: number;
  communication_score?: number;
  overall_rating?: number;
  recommendation?: string;
  notes?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  application?: Application;
  interviewer?: Profile;
}

export interface ChatTranscript {
  id: string;
  application_id: string;
  participant_id?: string;
  message_content: string;
  message_type: string;
  timestamp: string;
  is_from_candidate: boolean;
  metadata?: any;
  created_at: string;
  participant?: Profile;
}

export interface AIAnalysisResult {
  id: string;
  analysis_type: AIAnalysisType;
  job_id?: string;
  application_id?: string;
  interview_id?: string;
  input_data?: any;
  analysis_results: any;
  confidence_score?: number;
  processing_time_ms?: number;
  model_version?: string;
  analyzed_by?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  related_job_id?: string;
  related_application_id?: string;
  is_read: boolean;
  action_url?: string;
  metadata?: any;
  expires_at?: string;
  created_at: string;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description?: string;
  is_public: boolean;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}
