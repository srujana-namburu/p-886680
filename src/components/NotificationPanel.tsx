
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, Check, Clock, Briefcase, Users } from "lucide-react";
import { useNotifications } from "@/hooks/useSupabaseData";
import { notificationService } from "@/services/supabaseService";
import { useToast } from "@/hooks/use-toast";

interface NotificationPanelProps {
  userType: 'jobseeker' | 'hr';
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel = ({ userType, isOpen, onClose }: NotificationPanelProps) => {
  const { data: notifications = [], refetch } = useNotifications();
  const { toast } = useToast();
  const [markingAsRead, setMarkingAsRead] = useState<string | null>(null);

  const handleMarkAsRead = async (notificationId: string) => {
    setMarkingAsRead(notificationId);
    try {
      await notificationService.markAsRead(notificationId);
      await refetch();
      toast({
        title: "Success",
        description: "Notification marked as read.",
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read.",
        variant: "destructive",
      });
    } finally {
      setMarkingAsRead(null);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'application_status':
      case 'new_application':
        return <Briefcase className="h-4 w-4" />;
      case 'interview_scheduled':
        return <Clock className="h-4 w-4" />;
      case 'new_candidate':
        return <Users className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'application_status':
        return 'bg-blue-500/20 text-blue-300';
      case 'new_application':
        return 'bg-green-500/20 text-green-300';
      case 'interview_scheduled':
        return 'bg-purple-500/20 text-purple-300';
      case 'new_candidate':
        return 'bg-orange-500/20 text-orange-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-end pt-16 pr-4">
      <Card className="w-96 max-h-[80vh] bg-slate-800/95 border-slate-700 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-12 w-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No notifications yet</p>
              <p className="text-slate-500 text-sm mt-1">
                {userType === 'jobseeker' 
                  ? "We'll notify you about application updates"
                  : "We'll notify you about new applications and candidates"
                }
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  notification.is_read
                    ? 'bg-slate-700/30 border-slate-600/50'
                    : 'bg-slate-700/50 border-slate-600'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-white text-sm">
                        {notification.title}
                      </h4>
                      {!notification.is_read && (
                        <Badge className="bg-blue-500 text-white text-xs px-2 py-0.5">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-slate-300 text-sm mt-1 leading-relaxed">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-slate-400 text-xs">
                        {new Date(notification.created_at).toLocaleDateString()} at{' '}
                        {new Date(notification.created_at).toLocaleTimeString()}
                      </span>
                      {!notification.is_read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 p-1 h-auto"
                          onClick={() => handleMarkAsRead(notification.id)}
                          disabled={markingAsRead === notification.id}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          {markingAsRead === notification.id ? 'Marking...' : 'Mark as read'}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationPanel;
