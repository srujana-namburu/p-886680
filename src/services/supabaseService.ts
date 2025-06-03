
import { supabase } from "@/integrations/supabase/client";
import type { 
  Profile, 
  JobPosting, 
  Application, 
  Interview, 
  ChatTranscript, 
  AIAnalysisResult,
  Notification,
  SystemSetting,
  ApplicationStatus,
  UserRole,
  AIAnalysisType
} from "@/types/database";

// Profile Services
export const profileService = {
  async getCurrentProfile(): Promise<Profile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  },

  async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }
    return data;
  },

  async getHRProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .in('role', ['admin', 'hr_manager', 'recruiter', 'interviewer'])
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching HR profiles:', error);
      return [];
    }
    return data || [];
  }
};

// Job Services
export const jobService = {
  async getActiveJobs(): Promise<JobPosting[]> {
    const { data, error } = await supabase
      .from('job_postings')
      .select(`
        *,
        company:companies(*),
        job_skills(*)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching jobs:', error);
      return [];
    }
    return data || [];
  },

  async getAllJobs(): Promise<JobPosting[]> {
    const { data, error } = await supabase
      .from('job_postings')
      .select(`
        *,
        company:companies(*),
        job_skills(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all jobs:', error);
      return [];
    }
    return data || [];
  },

  async getJobById(id: string): Promise<JobPosting | null> {
    const { data, error } = await supabase
      .from('job_postings')
      .select(`
        *,
        company:companies(*),
        job_skills(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching job:', error);
      return null;
    }
    return data;
  },

  async createJob(jobData: {
    title: string;
    description: string;
    requirements: string;
    location: string;
    job_type: string;
    experience_level: string;
    salary_min?: number;
    salary_max?: number;
    company_id?: string;
  }): Promise<JobPosting | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('job_postings')
      .insert({
        ...jobData,
        posted_by: user.id,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating job:', error);
      return null;
    }
    return data;
  },

  async incrementJobViews(jobId: string): Promise<void> {
    const { error } = await supabase.rpc('increment_job_views', {
      job_id: jobId
    });

    if (error) {
      console.error('Error incrementing job views:', error);
    }
  }
};

// Application Services
export const applicationService = {
  async getApplications(filters?: { status?: ApplicationStatus; jobId?: string }): Promise<Application[]> {
    let query = supabase
      .from('applications')
      .select(`
        *,
        job_postings(*),
        candidate:profiles!applications_candidate_id_fkey(*)
      `)
      .order('created_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.jobId) {
      query = query.eq('job_id', filters.jobId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching applications:', error);
      return [];
    }

    // Transform the data to match our Application interface
    return (data || []).map(item => ({
      ...item,
      job: item.job_postings,
      candidate: item.candidate
    })) as Application[];
  },

  async getUserApplications(userId: string): Promise<Application[]> {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        job_postings(*)
      `)
      .eq('candidate_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user applications:', error);
      return [];
    }

    // Transform the data to match our Application interface
    return (data || []).map(item => ({
      ...item,
      job: item.job_postings
    })) as Application[];
  },

  async createApplication(applicationData: {
    job_id: string;
    cover_letter?: string;
    resume_url?: string;
    resume_filename?: string;
  }): Promise<Application | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('applications')
      .insert({
        ...applicationData,
        candidate_id: user.id,
        status: 'pending',
        applied_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating application:', error);
      return null;
    }
    return data;
  },

  async updateApplicationStatus(id: string, status: ApplicationStatus, notes?: string): Promise<Application | null> {
    const { data, error } = await supabase
      .from('applications')
      .update({ 
        status,
        hr_notes: notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating application status:', error);
      return null;
    }
    return data;
  },

  async getApplicationStats(): Promise<{ [key: string]: number }> {
    const { data, error } = await supabase
      .from('applications')
      .select('status');

    if (error) {
      console.error('Error fetching application stats:', error);
      return {};
    }

    const stats = data.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return stats;
  }
};

// Interview Services
export const interviewService = {
  async getInterviews(): Promise<Interview[]> {
    const { data, error } = await supabase
      .from('interviews')
      .select(`
        *,
        applications(
          *,
          job_postings(*),
          candidate:profiles!applications_candidate_id_fkey(*)
        ),
        interviewer:profiles!interviews_interviewer_id_fkey(*)
      `)
      .order('scheduled_at', { ascending: true });

    if (error) {
      console.error('Error fetching interviews:', error);
      return [];
    }

    // Transform the data to match our Interview interface
    return (data || []).map(item => ({
      ...item,
      application: {
        ...item.applications,
        job: item.applications.job_postings,
        candidate: item.applications.candidate
      },
      interviewer: item.interviewer
    })) as Interview[];
  },

  async getInterviewsByApplication(applicationId: string): Promise<Interview[]> {
    const { data, error } = await supabase
      .from('interviews')
      .select(`
        *,
        interviewer:profiles!interviews_interviewer_id_fkey(*)
      `)
      .eq('application_id', applicationId)
      .order('scheduled_at', { ascending: true });

    if (error) {
      console.error('Error fetching interviews for application:', error);
      return [];
    }

    // Transform the data to match our Interview interface
    return (data || []).map(item => ({
      ...item,
      interviewer: item.interviewer
    })) as Interview[];
  }
};

// Chat Services
export const chatService = {
  async getChatTranscripts(applicationId: string): Promise<ChatTranscript[]> {
    const { data, error } = await supabase
      .from('chat_transcripts')
      .select(`
        *,
        participant:profiles!chat_transcripts_participant_id_fkey(*)
      `)
      .eq('application_id', applicationId)
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error fetching chat transcripts:', error);
      return [];
    }

    // Transform the data to match our ChatTranscript interface
    return (data || []).map(item => ({
      ...item,
      participant: item.participant
    })) as ChatTranscript[];
  },

  async addChatMessage(applicationId: string, message: string, isFromCandidate: boolean): Promise<ChatTranscript | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('chat_transcripts')
      .insert({
        application_id: applicationId,
        participant_id: user.id,
        message_content: message,
        is_from_candidate: isFromCandidate,
        timestamp: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding chat message:', error);
      return null;
    }
    return data;
  }
};

// AI Analysis Services
export const aiService = {
  async saveAnalysisResult(result: Omit<AIAnalysisResult, 'id' | 'created_at'>): Promise<AIAnalysisResult | null> {
    const { data, error } = await supabase
      .from('ai_analysis_results')
      .insert(result)
      .select()
      .single();

    if (error) {
      console.error('Error saving AI analysis:', error);
      return null;
    }
    return data;
  },

  async getAnalysisResults(type?: AIAnalysisType, jobId?: string): Promise<AIAnalysisResult[]> {
    let query = supabase
      .from('ai_analysis_results')
      .select('*')
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('analysis_type', type);
    }
    if (jobId) {
      query = query.eq('job_id', jobId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching AI analysis results:', error);
      return [];
    }
    return data || [];
  }
};

// System Settings Services
export const settingsService = {
  async getPublicSettings(): Promise<{ [key: string]: any }> {
    const { data, error } = await supabase
      .from('system_settings')
      .select('key, value')
      .eq('is_public', true);

    if (error) {
      console.error('Error fetching system settings:', error);
      return {};
    }

    const settings = data.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as { [key: string]: any });

    return settings;
  },

  async getSetting(key: string): Promise<any> {
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('key', key)
      .eq('is_public', true)
      .single();

    if (error) {
      console.error(`Error fetching setting ${key}:`, error);
      return null;
    }
    return data?.value;
  }
};

// Notification Services
export const notificationService = {
  async getUserNotifications(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    return data || [];
  },

  async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  async getUnreadCount(userId: string): Promise<number> {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
    return count || 0;
  }
};

// Real-time subscriptions
export const realtimeService = {
  subscribeToApplications(callback: (payload: any) => void) {
    return supabase
      .channel('applications-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'applications' }, 
        callback
      )
      .subscribe();
  },

  subscribeToNotifications(userId: string, callback: (payload: any) => void) {
    return supabase
      .channel('notifications-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        }, 
        callback
      )
      .subscribe();
  },

  subscribeToChats(applicationId: string, callback: (payload: any) => void) {
    return supabase
      .channel('chat-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'chat_transcripts',
          filter: `application_id=eq.${applicationId}`
        }, 
        callback
      )
      .subscribe();
  }
};
