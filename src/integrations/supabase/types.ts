export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_analysis_results: {
        Row: {
          analysis_results: Json
          analysis_type: Database["public"]["Enums"]["ai_analysis_type"]
          analyzed_by: string | null
          application_id: string | null
          confidence_score: number | null
          created_at: string | null
          id: string
          input_data: Json | null
          interview_id: string | null
          job_id: string | null
          model_version: string | null
          processing_time_ms: number | null
        }
        Insert: {
          analysis_results: Json
          analysis_type: Database["public"]["Enums"]["ai_analysis_type"]
          analyzed_by?: string | null
          application_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          input_data?: Json | null
          interview_id?: string | null
          job_id?: string | null
          model_version?: string | null
          processing_time_ms?: number | null
        }
        Update: {
          analysis_results?: Json
          analysis_type?: Database["public"]["Enums"]["ai_analysis_type"]
          analyzed_by?: string | null
          application_id?: string | null
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          input_data?: Json | null
          interview_id?: string | null
          job_id?: string | null
          model_version?: string | null
          processing_time_ms?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_analysis_results_analyzed_by_fkey"
            columns: ["analyzed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_analysis_results_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_analysis_results_interview_id_fkey"
            columns: ["interview_id"]
            isOneToOne: false
            referencedRelation: "interviews"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ai_analysis_results_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_summarizer: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          input_csv_chat_name: string
          input_csv_chat_url: string
          job_id: string | null
          output_csv_chat_name: string | null
          output_csv_chat_url: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          input_csv_chat_name: string
          input_csv_chat_url: string
          job_id?: string | null
          output_csv_chat_name?: string | null
          output_csv_chat_url?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          input_csv_chat_name?: string
          input_csv_chat_url?: string
          job_id?: string | null
          output_csv_chat_name?: string | null
          output_csv_chat_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_summarizer_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_summarizer_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_events: {
        Row: {
          application_id: string | null
          event_name: string
          id: string
          job_id: string | null
          properties: Json | null
          session_id: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          application_id?: string | null
          event_name: string
          id?: string
          job_id?: string | null
          properties?: Json | null
          session_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          application_id?: string | null
          event_name?: string
          id?: string
          job_id?: string | null
          properties?: Json | null
          session_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analytics_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          application_source: string | null
          applied_at: string | null
          candidate_id: string | null
          cover_letter: string | null
          created_at: string | null
          hr_notes: string | null
          id: string
          job_id: string | null
          last_updated_by: string | null
          notes: string | null
          rating: number | null
          rejection_reason: string | null
          resume_filename: string | null
          resume_url: string | null
          screening_score: number | null
          status: Database["public"]["Enums"]["application_status"] | null
          updated_at: string | null
        }
        Insert: {
          application_source?: string | null
          applied_at?: string | null
          candidate_id?: string | null
          cover_letter?: string | null
          created_at?: string | null
          hr_notes?: string | null
          id?: string
          job_id?: string | null
          last_updated_by?: string | null
          notes?: string | null
          rating?: number | null
          rejection_reason?: string | null
          resume_filename?: string | null
          resume_url?: string | null
          screening_score?: number | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
        }
        Update: {
          application_source?: string | null
          applied_at?: string | null
          candidate_id?: string | null
          cover_letter?: string | null
          created_at?: string | null
          hr_notes?: string | null
          id?: string
          job_id?: string | null
          last_updated_by?: string | null
          notes?: string | null
          rating?: number | null
          rejection_reason?: string | null
          resume_filename?: string | null
          resume_url?: string | null
          screening_score?: number | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_last_updated_by_fkey"
            columns: ["last_updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      candidate_skills: {
        Row: {
          candidate_id: string | null
          created_at: string | null
          experience_years: number | null
          id: string
          proficiency_level: string | null
          skill_name: string
          verified: boolean | null
        }
        Insert: {
          candidate_id?: string | null
          created_at?: string | null
          experience_years?: number | null
          id?: string
          proficiency_level?: string | null
          skill_name: string
          verified?: boolean | null
        }
        Update: {
          candidate_id?: string | null
          created_at?: string | null
          experience_years?: number | null
          id?: string
          proficiency_level?: string | null
          skill_name?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "candidate_skills_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_transcripts: {
        Row: {
          application_id: string | null
          created_at: string | null
          id: string
          is_from_candidate: boolean
          message_content: string
          message_type: string | null
          metadata: Json | null
          participant_id: string | null
          timestamp: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          id?: string
          is_from_candidate: boolean
          message_content: string
          message_type?: string | null
          metadata?: Json | null
          participant_id?: string | null
          timestamp?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          id?: string
          is_from_candidate?: boolean
          message_content?: string
          message_type?: string | null
          metadata?: Json | null
          participant_id?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_transcripts_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_transcripts_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          founded_year: number | null
          id: string
          industry: string | null
          is_active: boolean | null
          location: string | null
          logo_url: string | null
          name: string
          size_range: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          founded_year?: number | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          location?: string | null
          logo_url?: string | null
          name: string
          size_range?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          founded_year?: number | null
          id?: string
          industry?: string | null
          is_active?: boolean | null
          location?: string | null
          logo_url?: string | null
          name?: string
          size_range?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      file_uploads: {
        Row: {
          created_at: string | null
          file_path: string
          file_size: number
          filename: string
          id: string
          is_public: boolean | null
          metadata: Json | null
          mime_type: string
          original_filename: string
          related_application_id: string | null
          related_job_id: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          file_path: string
          file_size: number
          filename: string
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          mime_type: string
          original_filename: string
          related_application_id?: string | null
          related_job_id?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          file_path?: string
          file_size?: number
          filename?: string
          id?: string
          is_public?: boolean | null
          metadata?: Json | null
          mime_type?: string
          original_filename?: string
          related_application_id?: string | null
          related_job_id?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "file_uploads_related_application_id_fkey"
            columns: ["related_application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_uploads_related_job_id_fkey"
            columns: ["related_job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_uploads_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      interview_feedback_files: {
        Row: {
          created_at: string | null
          file_name: string
          file_url: string
          id: string
          job_id: string | null
          updated_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_url: string
          id?: string
          job_id?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_url?: string
          id?: string
          job_id?: string | null
          updated_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interview_feedback_files_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interview_feedback_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          application_id: string | null
          communication_score: number | null
          created_at: string | null
          created_by: string | null
          cultural_score: number | null
          duration_minutes: number | null
          feedback: string | null
          id: string
          interview_type: Database["public"]["Enums"]["interview_type"]
          interviewer_id: string | null
          location: string | null
          meeting_link: string | null
          notes: string | null
          overall_rating: number | null
          recommendation: string | null
          scheduled_at: string
          status: string | null
          technical_score: number | null
          updated_at: string | null
        }
        Insert: {
          application_id?: string | null
          communication_score?: number | null
          created_at?: string | null
          created_by?: string | null
          cultural_score?: number | null
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          interview_type: Database["public"]["Enums"]["interview_type"]
          interviewer_id?: string | null
          location?: string | null
          meeting_link?: string | null
          notes?: string | null
          overall_rating?: number | null
          recommendation?: string | null
          scheduled_at: string
          status?: string | null
          technical_score?: number | null
          updated_at?: string | null
        }
        Update: {
          application_id?: string | null
          communication_score?: number | null
          created_at?: string | null
          created_by?: string | null
          cultural_score?: number | null
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          interview_type?: Database["public"]["Enums"]["interview_type"]
          interviewer_id?: string | null
          location?: string | null
          meeting_link?: string | null
          notes?: string | null
          overall_rating?: number | null
          recommendation?: string | null
          scheduled_at?: string
          status?: string | null
          technical_score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interviews_interviewer_id_fkey"
            columns: ["interviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          applications_count: number | null
          company_id: string | null
          created_at: string | null
          currency: string | null
          department: string | null
          description: string
          experience_level: string
          expires_at: string | null
          id: string
          is_featured: boolean | null
          job_type: string
          location: string
          posted_by: string | null
          requirements: string
          responsibilities: string | null
          salary_max: number | null
          salary_min: number | null
          status: Database["public"]["Enums"]["job_status"] | null
          title: string
          updated_at: string | null
          views_count: number | null
        }
        Insert: {
          applications_count?: number | null
          company_id?: string | null
          created_at?: string | null
          currency?: string | null
          department?: string | null
          description: string
          experience_level: string
          expires_at?: string | null
          id?: string
          is_featured?: boolean | null
          job_type: string
          location: string
          posted_by?: string | null
          requirements: string
          responsibilities?: string | null
          salary_max?: number | null
          salary_min?: number | null
          status?: Database["public"]["Enums"]["job_status"] | null
          title: string
          updated_at?: string | null
          views_count?: number | null
        }
        Update: {
          applications_count?: number | null
          company_id?: string | null
          created_at?: string | null
          currency?: string | null
          department?: string | null
          description?: string
          experience_level?: string
          expires_at?: string | null
          id?: string
          is_featured?: boolean | null
          job_type?: string
          location?: string
          posted_by?: string | null
          requirements?: string
          responsibilities?: string | null
          salary_max?: number | null
          salary_min?: number | null
          status?: Database["public"]["Enums"]["job_status"] | null
          title?: string
          updated_at?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "job_postings_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_skills: {
        Row: {
          created_at: string | null
          experience_years: number | null
          id: string
          is_required: boolean | null
          job_id: string | null
          skill_name: string
        }
        Insert: {
          created_at?: string | null
          experience_years?: number | null
          id?: string
          is_required?: boolean | null
          job_id?: string | null
          skill_name: string
        }
        Update: {
          created_at?: string | null
          experience_years?: number | null
          id?: string
          is_required?: boolean | null
          job_id?: string | null
          skill_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_skills_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      jobseeker_chat_transcripts: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          transcript_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          transcript_data: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          transcript_data?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          related_application_id: string | null
          related_job_id: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          related_application_id?: string | null
          related_job_id?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          related_application_id?: string | null
          related_job_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_application_id_fkey"
            columns: ["related_application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_related_job_id_fkey"
            columns: ["related_job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_active: boolean | null
          last_login_at: string | null
          linkedin_url: string | null
          location: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          is_active?: boolean | null
          last_login_at?: string | null
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_active?: boolean | null
          last_login_at?: string | null
          linkedin_url?: string | null
          location?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity_logs: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      increment_job_views: {
        Args: { job_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_hr_staff: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      ai_analysis_type:
        | "resume_match"
        | "bias_detection"
        | "interview_summary"
        | "chat_summary"
      application_status:
        | "pending"
        | "shortlisted"
        | "interviewed"
        | "selected"
        | "rejected"
        | "withdrawn"
      interview_type:
        | "phone"
        | "video"
        | "in_person"
        | "technical"
        | "behavioral"
      job_status: "draft" | "active" | "paused" | "closed" | "archived"
      notification_type:
        | "application_received"
        | "status_change"
        | "interview_scheduled"
        | "message_received"
        | "system_alert"
      user_role:
        | "admin"
        | "hr_manager"
        | "recruiter"
        | "interviewer"
        | "jobseeker"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      ai_analysis_type: [
        "resume_match",
        "bias_detection",
        "interview_summary",
        "chat_summary",
      ],
      application_status: [
        "pending",
        "shortlisted",
        "interviewed",
        "selected",
        "rejected",
        "withdrawn",
      ],
      interview_type: [
        "phone",
        "video",
        "in_person",
        "technical",
        "behavioral",
      ],
      job_status: ["draft", "active", "paused", "closed", "archived"],
      notification_type: [
        "application_received",
        "status_change",
        "interview_scheduled",
        "message_received",
        "system_alert",
      ],
      user_role: [
        "admin",
        "hr_manager",
        "recruiter",
        "interviewer",
        "jobseeker",
      ],
    },
  },
} as const
