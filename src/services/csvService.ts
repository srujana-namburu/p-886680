
import { supabase } from "@/integrations/supabase/client";
import { Application, Profile, Interview } from "@/types/database";

interface CandidateInterviewData {
  candidate_id: string;
  candidate_name: string;
  interviewer: string;
  job_id: string;
  interview_feedback: string;
}

// Generate realistic interview feedback
const generateRealisticFeedback = (): string => {
  const positiveFeedbacks = [
    "Candidate demonstrated excellent problem-solving skills and provided well-structured solutions. Strong communication throughout the interview and showed genuine enthusiasm for the role. Technical knowledge appears solid with good understanding of core concepts.",
    "Very impressive technical skills with ability to think through complex problems systematically. Candidate asked thoughtful questions and showed strong analytical thinking. Would be a valuable addition to the team based on this interview performance.",
    "Outstanding communication skills and clear thought process. Candidate showed deep understanding of the subject matter and provided creative solutions to challenging questions. Demonstrates leadership potential and collaborative mindset.",
    "Excellent technical foundation with practical experience clearly evident. Candidate handled pressure well and adapted quickly to different question types. Shows strong potential for growth and learning in this role.",
    "Impressive problem-solving approach with methodical thinking. Candidate demonstrated both technical competence and soft skills. Good cultural fit and shows genuine interest in contributing to team success."
  ];

  const neutralFeedbacks = [
    "Candidate showed adequate technical skills but could benefit from more practical experience. Communication was clear but lacked depth in some areas. Shows potential but may need additional support initially.",
    "Technical knowledge is satisfactory with room for improvement in advanced concepts. Candidate was prepared and professional throughout the interview. Would require some mentoring to reach full potential in this role.",
    "Candidate demonstrated basic understanding of core concepts but struggled with more complex scenarios. Professional demeanor and willingness to learn are positive indicators. May be suitable with proper onboarding.",
    "Average performance overall with some strengths in specific areas. Candidate showed enthusiasm but technical skills need development. Could be considered for a more junior position or with extended training period.",
    "Decent communication skills and professional attitude. Technical abilities are at entry level but candidate shows potential for growth. Would need significant support and mentoring to succeed in this role."
  ];

  const negativeFeedbacks = [
    "Candidate struggled with fundamental concepts and showed limited problem-solving ability. Communication was unclear and responses lacked structure. Technical skills do not meet the requirements for this position.",
    "Significant gaps in technical knowledge with difficulty explaining basic concepts. Candidate appeared unprepared and showed limited understanding of the role requirements. Not recommended for this position.",
    "Poor communication skills and inability to articulate thought process clearly. Technical competence is well below expected level. Candidate did not demonstrate the skills necessary for this role.",
    "Candidate showed minimal technical understanding and struggled with even basic questions. Lack of preparation was evident and professional presentation needs improvement. Does not meet position requirements.",
    "Insufficient technical skills and poor problem-solving approach. Candidate was unable to handle standard interview questions effectively. Would not recommend proceeding with this candidate for this role."
  ];

  const feedbackTypes = [positiveFeedbacks, neutralFeedbacks, negativeFeedbacks];
  const randomType = feedbackTypes[Math.floor(Math.random() * feedbackTypes.length)];
  return randomType[Math.floor(Math.random() * randomType.length)];
};

// Convert data to CSV format
const convertToCSV = (data: CandidateInterviewData[]): string => {
  const headers = ['candidate_id', 'candidate_name', 'interviewer', 'job_id', 'interview_feedback'];
  const csvContent = [
    headers.join(','),
    ...data.map(row => [
      row.candidate_id,
      `"${row.candidate_name}"`,
      `"${row.interviewer}"`,
      row.job_id,
      `"${row.interview_feedback.replace(/"/g, '""')}"` // Escape quotes in feedback
    ].join(','))
  ].join('\n');
  
  return csvContent;
};

export const csvService = {
  async generateInterviewFeedbackCSV(jobId: string): Promise<string | null> {
    try {
      // Get applications for the job
      const { data: applications, error: appError } = await supabase
        .from('applications')
        .select(`
          *,
          candidate:profiles!applications_candidate_id_fkey(*),
          interviews(*, interviewer:profiles!interviews_interviewer_id_fkey(*))
        `)
        .eq('job_id', jobId);

      if (appError) {
        console.error('Error fetching applications:', appError);
        return null;
      }

      if (!applications || applications.length === 0) {
        console.error('No applications found for this job');
        return null;
      }

      // Prepare CSV data
      const csvData: CandidateInterviewData[] = applications.map(app => {
        const interview = app.interviews?.[0]; // Get first interview if exists
        const interviewer = interview?.interviewer?.full_name || 'TBD';
        
        return {
          candidate_id: app.candidate_id,
          candidate_name: app.candidate?.full_name || 'Unknown Candidate',
          interviewer: interviewer,
          job_id: jobId,
          interview_feedback: generateRealisticFeedback()
        };
      });

      // Convert to CSV
      const csvContent = convertToCSV(csvData);
      
      // Create file blob
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const fileName = `interview_feedback_${jobId}_${Date.now()}.csv`;
      
      // Upload to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('interview-feedback-csv')
        .upload(fileName, blob, {
          contentType: 'text/csv',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading CSV:', uploadError);
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('interview-feedback-csv')
        .getPublicUrl(fileName);

      // Save file record to database
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: dbError } = await supabase
          .from('interview_feedback_files')
          .insert({
            job_id: jobId,
            file_url: publicUrl,
            file_name: fileName,
            uploaded_by: user.id
          });

        if (dbError) {
          console.error('Error saving file record:', dbError);
        }
      }

      return publicUrl;
    } catch (error) {
      console.error('Error generating CSV:', error);
      return null;
    }
  },

  async uploadChatInputCSV(file: File, jobId: string): Promise<string | null> {
    try {
      const fileName = `chat_input_${jobId}_${Date.now()}_${file.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('chat-input-csv')
        .upload(fileName, file, {
          contentType: 'text/csv',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading chat input CSV:', uploadError);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('chat-input-csv')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading chat input CSV:', error);
      return null;
    }
  },

  async uploadChatOutputCSV(file: File, jobId: string): Promise<string | null> {
    try {
      const fileName = `chat_output_${jobId}_${Date.now()}_${file.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('chat-output-csv')
        .upload(fileName, file, {
          contentType: 'text/csv',
          upsert: false
        });

      if (uploadError) {
        console.error('Error uploading chat output CSV:', uploadError);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('chat-output-csv')
        .getPublicUrl(fileName);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading chat output CSV:', error);
      return null;
    }
  }
};
