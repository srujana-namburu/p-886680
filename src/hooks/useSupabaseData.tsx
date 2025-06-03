
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  jobService, 
  applicationService, 
  interviewService,
  settingsService,
  notificationService,
  realtimeService
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
    queryFn: () => user ? applicationService.getUserApplications(user.id) : Promise.resolve([]),
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

// Enhanced Notifications Hook with real-time updates
export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [subscriptionSetup, setSubscriptionSetup] = useState(false);
  
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

  // Set up real-time subscription for notifications only once
  useEffect(() => {
    if (!user || subscriptionSetup) return;

    console.log('Setting up notification subscription for user:', user.id);
    
    const subscription = realtimeService.subscribeToNotifications(user.id, (payload) => {
      console.log('Notification update:', payload);
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications', user.id] });
    });

    setSubscriptionSetup(true);

    return () => {
      console.log('Cleaning up notification subscription');
      subscription.unsubscribe();
      setSubscriptionSetup(false);
    };
  }, [user?.id, queryClient, subscriptionSetup]);

  return {
    notifications: notificationsQuery,
    unreadCount: unreadCountQuery,
  };
};

// Real-time Applications Hook
export const useRealtimeApplications = () => {
  const queryClient = useQueryClient();
  const [subscriptionSetup, setSubscriptionSetup] = useState(false);

  useEffect(() => {
    if (subscriptionSetup) return;

    console.log('Setting up applications subscription');
    
    const subscription = realtimeService.subscribeToApplications((payload) => {
      console.log('Application update:', payload);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['application-stats'] });
      queryClient.invalidateQueries({ queryKey: ['application'] });
      queryClient.invalidateQueries({ queryKey: ['user-applications'] });
    });

    setSubscriptionSetup(true);

    return () => {
      console.log('Cleaning up applications subscription');
      subscription.unsubscribe();
      setSubscriptionSetup(false);
    };
  }, [queryClient, subscriptionSetup]);
};
