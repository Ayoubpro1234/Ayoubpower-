import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Bell, Calendar, Zap, Trophy } from 'lucide-react';
import * as React from 'react';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('المتصفح الخاص بك لا يدعم الإشعارات');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        toast.success('تم تفعيل الإشعارات بنجاح!');
      } else {
        toast.error('تم رفض الإشعارات');
      }
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const sendNotification = useCallback((title: string, options?: NotificationOptions & { type?: 'task' | 'challenge' | 'reminder' }) => {
    // Show in-app toast
    const icon = options?.type === 'task' ? <Zap className="text-yellow-500" /> :
                 options?.type === 'challenge' ? <Trophy className="text-yellow-500" /> :
                 <Bell className="text-yellow-500" />;

    toast(title, {
      description: options?.body,
      icon,
      duration: 5000,
    });

    // Show system notification if granted
    if (permission === 'granted' && 'Notification' in window) {
      try {
        new Notification(title, {
          icon: '/favicon.ico', // fallback icon
          badge: '/favicon.ico',
          ...options,
        });
      } catch (error) {
        console.error('Error showing system notification:', error);
      }
    }
  }, [permission]);

  return {
    permission,
    requestPermission,
    sendNotification
  };
}
