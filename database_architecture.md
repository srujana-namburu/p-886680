
# ATS (Applicant Tracking System) Database Architecture

## Overview
This document outlines the complete database schema and architecture for the ATS system built on Supabase PostgreSQL. The system manages job postings, candidate applications, interviews, and various AI-powered features for recruitment processes.

## Core Tables and Relationships

### 1. User Management & Profiles

#### `profiles` (Main User Table)
- **Primary Key**: `id` (UUID)
- **Purpose**: Stores user profile information for all system users
- **Key Fields**:
  - `email` (TEXT, NOT NULL) - User email address
  - `full_name` (TEXT, NOT NULL) - User's full name
  - `role` (user_role ENUM) - User role (admin, hr_manager, recruiter, interviewer, jobseeker)
  - `company_name` (TEXT) - Company affiliation
  - `phone`, `location`, `linkedin_url` - Contact information
  - `is_active` (BOOLEAN) - Account status
  - `avatar_url` (TEXT) - Profile picture URL

**Relationships**:
- One-to-Many with `job_postings` (posted_by)
- One-to-Many with `applications` (candidate_id)
- One-to-Many with `interviews` (interviewer_id)
- One-to-Many with `notifications` (user_id)

### 2. Company Management

#### `companies`
- **Primary Key**: `id` (UUID)
- **Purpose**: Stores company information for job postings
- **Key Fields**:
  - `name` (TEXT, NOT NULL) - Company name
  - `description`, `website`, `logo_url` - Company details
  - `industry`, `size_range`, `location` - Company classification
  - `founded_year` (INTEGER) - Establishment year
  - `is_active` (BOOLEAN) - Company status

**Relationships**:
- One-to-Many with `job_postings` (company_id)

### 3. Job Management

#### `job_postings` (Central Job Table)
- **Primary Key**: `id` (UUID)
- **Purpose**: Core table for all job listings
- **Key Fields**:
  - `title` (TEXT, NOT NULL) - Job title
  - `description` (TEXT, NOT NULL) - Job description
  - `requirements` (TEXT, NOT NULL) - Job requirements
  - `responsibilities` (TEXT) - Job responsibilities
  - `salary_min`, `salary_max` (INTEGER) - Salary range
  - `currency` (TEXT, DEFAULT 'USD') - Salary currency
  - `location` (TEXT, NOT NULL) - Job location
  - `job_type` (TEXT) - Employment type (full-time, part-time, contract)
  - `experience_level` (TEXT) - Required experience level
  - `department` (TEXT) - Department/team
  - `status` (job_status ENUM) - Job status (draft, active, paused, closed, archived)
  - `posted_by` (UUID) - References profiles.id
  - `company_id` (TEXT) - References companies.id
  - `applications_count` (INTEGER) - Application counter
  - `views_count` (INTEGER) - View counter
  - `expires_at` (TIMESTAMP) - Job expiration date
  - `is_featured` (BOOLEAN) - Featured job flag

**Relationships**:
- Many-to-One with `profiles` (posted_by)
- Many-to-One with `companies` (company_id)
- One-to-Many with `applications` (job_id)
- One-to-Many with `job_skills` (job_id)

#### `job_skills`
- **Primary Key**: `id` (UUID)
- **Purpose**: Stores required skills for each job
- **Key Fields**:
  - `job_id` (UUID) - References job_postings.id
  - `skill_name` (TEXT, NOT NULL) - Skill name
  - `is_required` (BOOLEAN) - Required vs preferred skill
  - `experience_years` (INTEGER) - Required experience in skill

**Relationships**:
- Many-to-One with `job_postings` (job_id)

### 4. Application Management

#### `applications` (Core Application Table)
- **Primary Key**: `id` (UUID)
- **Purpose**: Manages all job applications and their lifecycle
- **Key Fields**:
  - `job_id` (UUID) - References job_postings.id
  - `candidate_id` (UUID) - References profiles.id
  - `status` (application_status ENUM) - Application status
    - Values: pending, shortlisted, interviewed, selected, rejected, withdrawn
  - `cover_letter` (TEXT) - Candidate's cover letter
  - `resume_url` (TEXT) - Resume file URL
  - `resume_filename` (TEXT) - Original resume filename
  - `application_source` (TEXT) - How application was submitted
  - `rating` (NUMERIC) - HR rating for candidate
  - `screening_score` (INTEGER) - Automated screening score
  - `hr_notes` (TEXT) - HR internal notes
  - `rejection_reason` (TEXT) - Reason for rejection
  - `applied_at` (TIMESTAMP) - Application submission time
  - `last_updated_by` (UUID) - Last person to update application

**Relationships**:
- Many-to-One with `job_postings` (job_id)
- Many-to-One with `profiles` (candidate_id)
- One-to-Many with `interviews` (application_id)
- One-to-Many with `chat_transcripts` (application_id)

### 5. Interview Management

#### `interviews`
- **Primary Key**: `id` (UUID)
- **Purpose**: Manages interview scheduling and feedback
- **Key Fields**:
  - `application_id` (UUID) - References applications.id
  - `interviewer_id` (UUID) - References profiles.id
  - `interview_type` (interview_type ENUM) - Type of interview
    - Values: phone, video, in_person, technical, behavioral
  - `scheduled_at` (TIMESTAMP, NOT NULL) - Interview date/time
  - `duration_minutes` (INTEGER) - Interview duration
  - `location` (TEXT) - Interview location
  - `meeting_link` (TEXT) - Video meeting link
  - `status` (TEXT) - Interview status
  - `feedback` (TEXT) - Interview feedback
  - `technical_score`, `cultural_score`, `communication_score` (INTEGER) - Scoring
  - `overall_rating` (NUMERIC) - Overall candidate rating
  - `recommendation` (TEXT) - Interviewer recommendation
  - `notes` (TEXT) - Additional notes

**Relationships**:
- Many-to-One with `applications` (application_id)
- Many-to-One with `profiles` (interviewer_id)

### 6. Communication & Chat

#### `chat_transcripts`
- **Primary Key**: `id` (UUID)
- **Purpose**: Stores chat communications between HR and candidates
- **Key Fields**:
  - `application_id` (UUID) - References applications.id
  - `participant_id` (UUID) - References profiles.id
  - `message_content` (TEXT, NOT NULL) - Message text
  - `message_type` (TEXT) - Message type (text, file, etc.)
  - `is_from_candidate` (BOOLEAN) - Message direction flag
  - `timestamp` (TIMESTAMP) - Message timestamp
  - `metadata` (JSONB) - Additional message data

**Relationships**:
- Many-to-One with `applications` (application_id)
- Many-to-One with `profiles` (participant_id)

#### `jobseeker_chat_transcripts`
- **Primary Key**: `id` (UUID)
- **Purpose**: Stores AI chat sessions for job seekers
- **Key Fields**:
  - `user_id` (UUID, NOT NULL) - References profiles.id
  - `transcript_data` (JSONB, NOT NULL) - Complete chat transcript
  - `completed_at` (TIMESTAMP) - Session completion time

**Relationships**:
- Many-to-One with `profiles` (user_id)

### 7. Skills Management

#### `candidate_skills`
- **Primary Key**: `id` (UUID)
- **Purpose**: Stores candidate skill profiles
- **Key Fields**:
  - `candidate_id` (UUID) - References profiles.id
  - `skill_name` (TEXT, NOT NULL) - Skill name
  - `proficiency_level` (TEXT) - Skill level
  - `experience_years` (INTEGER) - Years of experience
  - `verified` (BOOLEAN) - Skill verification status

**Relationships**:
- Many-to-One with `profiles` (candidate_id)

### 8. AI & Analytics

#### `ai_analysis_results`
- **Primary Key**: `id` (UUID)
- **Purpose**: Stores AI analysis results for various processes
- **Key Fields**:
  - `analysis_type` (ai_analysis_type ENUM) - Type of analysis
    - Values: resume_match, bias_detection, interview_summary, chat_summary
  - `job_id` (UUID) - Related job posting
  - `application_id` (UUID) - Related application
  - `interview_id` (UUID) - Related interview
  - `input_data` (JSONB) - Input data for analysis
  - `analysis_results` (JSONB, NOT NULL) - Analysis output
  - `confidence_score` (NUMERIC) - AI confidence level
  - `processing_time_ms` (INTEGER) - Processing duration
  - `model_version` (TEXT) - AI model version used
  - `analyzed_by` (UUID) - User who initiated analysis

**Relationships**:
- Many-to-One with `job_postings` (job_id)
- Many-to-One with `applications` (application_id)
- Many-to-One with `interviews` (interview_id)

#### `analytics_events`
- **Primary Key**: `id` (UUID)
- **Purpose**: Tracks user interactions and system events
- **Key Fields**:
  - `event_name` (TEXT, NOT NULL) - Event identifier
  - `user_id` (UUID) - User who triggered event
  - `job_id` (UUID) - Related job posting
  - `application_id` (UUID) - Related application
  - `session_id` (TEXT) - User session identifier
  - `properties` (JSONB) - Event properties/metadata
  - `timestamp` (TIMESTAMP) - Event occurrence time

**Relationships**:
- Many-to-One with `profiles` (user_id)
- Many-to-One with `job_postings` (job_id)
- Many-to-One with `applications` (application_id)

### 9. System Management

#### `notifications`
- **Primary Key**: `id` (UUID)
- **Purpose**: Manages system notifications for users
- **Key Fields**:
  - `user_id` (UUID) - References profiles.id
  - `title` (TEXT, NOT NULL) - Notification title
  - `message` (TEXT, NOT NULL) - Notification content
  - `type` (notification_type ENUM) - Notification category
    - Values: application_received, status_change, interview_scheduled, message_received, system_alert
  - `related_job_id` (UUID) - Related job posting
  - `related_application_id` (UUID) - Related application
  - `is_read` (BOOLEAN) - Read status
  - `action_url` (TEXT) - Action link
  - `expires_at` (TIMESTAMP) - Notification expiration

**Relationships**:
- Many-to-One with `profiles` (user_id)
- Many-to-One with `job_postings` (related_job_id)
- Many-to-One with `applications` (related_application_id)

#### `system_settings`
- **Primary Key**: `id` (UUID)
- **Purpose**: Stores system configuration settings
- **Key Fields**:
  - `key` (TEXT, NOT NULL) - Setting key/name
  - `value` (JSONB, NOT NULL) - Setting value
  - `description` (TEXT) - Setting description
  - `is_public` (BOOLEAN) - Public visibility flag
  - `updated_by` (UUID) - Last modifier

#### `file_uploads`
- **Primary Key**: `id` (UUID)
- **Purpose**: Manages file upload metadata
- **Key Fields**:
  - `filename` (TEXT, NOT NULL) - System filename
  - `original_filename` (TEXT, NOT NULL) - Original filename
  - `file_path` (TEXT, NOT NULL) - Storage path
  - `mime_type` (TEXT, NOT NULL) - File MIME type
  - `file_size` (INTEGER, NOT NULL) - File size in bytes
  - `uploaded_by` (UUID) - Uploader user ID
  - `related_job_id` (UUID) - Related job posting
  - `related_application_id` (UUID) - Related application
  - `is_public` (BOOLEAN) - Public access flag
  - `metadata` (JSONB) - Additional file metadata

#### `user_activity_logs`
- **Primary Key**: `id` (UUID)
- **Purpose**: Audit trail for user actions
- **Key Fields**:
  - `user_id` (UUID) - User performing action
  - `action` (TEXT, NOT NULL) - Action performed
  - `resource_type` (TEXT) - Type of resource affected
  - `resource_id` (UUID) - ID of affected resource
  - `ip_address` (INET) - User's IP address
  - `user_agent` (TEXT) - User's browser information
  - `metadata` (JSONB) - Additional action context

## Database Enums and Custom Types

### User Roles (`user_role`)
- `admin`: System administrator
- `hr_manager`: HR manager with full access
- `recruiter`: Recruiter with job posting and candidate management
- `interviewer`: Interviewer with interview management access
- `jobseeker`: Job applicant/candidate

### Application Statuses (`application_status`)
- `pending`: Initial application state
- `shortlisted`: Application passed initial screening
- `interviewed`: Candidate has been interviewed
- `selected`: Candidate selected for position
- `rejected`: Application rejected
- `withdrawn`: Candidate withdrew application

### Job Statuses (`job_status`)
- `draft`: Job posting in draft state
- `active`: Job posting is live and accepting applications
- `paused`: Job posting temporarily paused
- `closed`: Job posting closed, no longer accepting applications
- `archived`: Job posting archived for reference

### Interview Types (`interview_type`)
- `phone`: Phone interview
- `video`: Video call interview
- `in_person`: Face-to-face interview
- `technical`: Technical assessment interview
- `behavioral`: Behavioral/culture fit interview

### AI Analysis Types (`ai_analysis_type`)
- `resume_match`: Resume-to-job matching analysis
- `bias_detection`: Bias detection in hiring process
- `interview_summary`: Interview feedback summarization
- `chat_summary`: Chat conversation summarization

### Notification Types (`notification_type`)
- `application_received`: New application notification
- `status_change`: Application status change notification
- `interview_scheduled`: Interview scheduling notification
- `message_received`: New message notification
- `system_alert`: System-wide alerts

## Key Database Functions

### User Management Functions
- `get_user_role(user_id)`: Returns user role for authorization
- `is_admin(user_id)`: Checks if user has admin privileges
- `is_hr_staff(user_id)`: Checks if user has HR-level access
- `handle_new_user()`: Trigger function for new user profile creation

### Job Management Functions
- `increment_job_views(job_id)`: Increments job view counter
- `update_updated_at_column()`: Generic trigger for timestamp updates

## Data Flow and Business Logic

### Application Lifecycle
1. **Application Creation**: Candidate applies to job through `applications` table
2. **Screening**: HR reviews applications, updates status to `shortlisted` or `rejected`
3. **Interview Scheduling**: HR schedules interviews in `interviews` table
4. **Interview Process**: Interviewers provide feedback and scores
5. **Decision Making**: Final status update to `selected` or `rejected`
6. **Notifications**: System sends notifications throughout process

### AI Integration Points
- **Resume Matching**: AI analyzes resumes against job requirements
- **Bias Detection**: AI checks for potential bias in hiring decisions
- **Interview Analysis**: AI summarizes interview feedback
- **Chat Analysis**: AI processes candidate-HR communications

### Data Security & Access Control
- **Row Level Security (RLS)**: Implemented on sensitive tables
- **Role-Based Access**: Different access levels based on user roles
- **Audit Trail**: User actions logged in `user_activity_logs`
- **Data Encryption**: Sensitive data encrypted at rest and in transit

## Optimization and Performance

### Indexing Strategy
- Primary keys (UUID) on all tables
- Foreign key indexes for join performance
- Composite indexes on frequently queried combinations
- JSON indexes on JSONB columns for AI data

### Scaling Considerations
- Partitioning strategy for large tables (applications, analytics_events)
- Archive strategy for old data
- Connection pooling for database access
- Read replicas for reporting queries

## Integration Points

### External Systems
- **File Storage**: Supabase Storage for resume and document uploads
- **Email Service**: For notification delivery
- **AI Services**: OpenAI/other AI providers for analysis
- **Authentication**: Supabase Auth for user management

### API Structure
- **REST API**: Supabase auto-generated REST endpoints
- **Real-time**: Supabase real-time subscriptions for live updates
- **Edge Functions**: Custom business logic and external integrations

This architecture supports a comprehensive ATS system with modern features like AI-powered analysis, real-time communications, and detailed analytics while maintaining data integrity and security through proper relationships and constraints.
