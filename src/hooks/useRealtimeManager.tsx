
import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { realtimeService } from '@/services/supabaseService';
import { useAuth } from './useAuth';

// Global subscription tracking
const globalSubscriptions = {
  notifications: null as any,
  applications: null as any,
};

export const useRealtimeManager = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const initializationRef = useRef(false);

  useEffect(() => {
    // Only initialize once globally
    if (initializationRef.current || !user) return;
    
    console.log('Initializing global real-time subscriptions');
    initializationRef.current = true;

    // Set up notifications subscription if not already active
    if (!globalSubscriptions.notifications) {
      console.log('Setting up global notification subscription for user:', user.id);
      globalSubscriptions.notifications = realtimeService.subscribeToNotifications(user.id, (payload) => {
        console.log('Notification update:', payload);
        queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
        queryClient.invalidateQueries({ queryKey: ['unread-notifications', user.id] });
      });
    }

    // Set up applications subscription if not already active
    if (!globalSubscriptions.applications) {
      console.log('Setting up global applications subscription');
      globalSubscriptions.applications = realtimeService.subscribeToApplications((payload) => {
        console.log('Application update:', payload);
        queryClient.invalidateQueries({ queryKey: ['applications'] });
        queryClient.invalidateQueries({ queryKey: ['application-stats'] });
        queryClient.invalidateQueries({ queryKey: ['application'] });
        queryClient.invalidateQueries({ queryKey: ['user-applications'] });
      });
    }

    // Cleanup function
    return () => {
      console.log('Cleaning up global real-time subscriptions');
      
      if (globalSubscriptions.notifications) {
        globalSubscriptions.notifications.unsubscribe();
        globalSubscriptions.notifications = null;
      }
      
      if (globalSubscriptions.applications) {
        globalSubscriptions.applications.unsubscribe();
        globalSubscriptions.applications = null;
      }
      
      initializationRef.current = false;
    };
  }, [user?.id, queryClient]);
};
