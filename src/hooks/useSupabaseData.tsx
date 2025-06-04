
import { useState, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  jobService, 
  applicationService, 
  interviewService,
  settingsService,
  notificationService
} from '@/services/supabaseService';
import { useAuth } from './useAuth';
import { ApplicationStatus } from '@/types/database';

// Jobs Hook
export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: jobService.getActiveJobs,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useAllJobs = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['all-jobs', user?.id],
    queryFn: () => {
      if (user?.id) {
        return jobService.getJobsByUser(user.id);
      }
      return jobService.getAllJobs();
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
};

// Applications Hook
export const useApplications = (filters?: { status?: ApplicationStatus; jobId?: string }) => {
  return useQuery({
    queryKey: ['applications', filters],
    queryFn: () => applicationService.getApplications(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useApplication = (id: string) => {
  return useQuery({
    queryKey: ['application', id],
    queryFn: () => applicationService.getApplicationById(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
};

export const useUserApplications = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-applications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Fetch applications with complete job and company data
      const applications = await applicationService.getUserApplications(user.id);
      
      // For each application, ensure we have complete job data
      const enrichedApplications = await Promise.all(
        applications.map(async (app) => {
          if (app.job_id && (!app.job || !app.job.title)) {
            try {
              // Fetch complete job data if missing
              const jobData = await jobService.getJobById(app.job_id);
              return {
                ...app,
                job: jobData
              };
            } catch (error) {
              console.error('Error fetching job data for application:', error);
              return app;
            }
          }
          return app;
        })
      );
      
      return enrichedApplications;
    },
    enabled: !!user,
    staleTime: 2 * 60 * 1000,
  });
};

// Application Stats Hook
export const useApplicationStats = () => {
  return useQuery({
    queryKey: ['application-stats'],
    queryFn: applicationService.getApplicationStats,
    staleTime: 5 * 60 * 1000,
  });
};

// Interviews Hook
export const useInterviews = () => {
  return useQuery({
    queryKey: ['interviews'],
    queryFn: interviewService.getInterviews,
    staleTime: 5 * 60 * 1000,
  });
};

// System Settings Hook
export const useSystemSettings = () => {
  return useQuery({
    queryKey: ['system-settings'],
    queryFn: settingsService.getPublicSettings,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Simplified Notifications Hook (no real-time subscription here)
export const useNotifications = () => {
  const { user } = useAuth();
  
  const notificationsQuery = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: () => user ? notificationService.getUserNotifications(user.id) : Promise.resolve([]),
    enabled: !!user,
    staleTime: 1 * 60 * 1000, // 1 minute
  });

  const unreadCountQuery = useQuery({
    queryKey: ['unread-notifications', user?.id],
    queryFn: () => user ? notificationService.getUnreadCount(user.id) : Promise.resolve(0),
    enabled: !!user,
    staleTime: 30 * 1000, // 30 seconds
  });

  return {
    notifications: notificationsQuery,
    unreadCount: unreadCountQuery,
  };
};
