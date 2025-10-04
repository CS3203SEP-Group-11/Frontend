import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getInAppNotifications } from '../api/notification';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user?.id) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const data = await getInAppNotifications(user.id);
      const notificationList = Array.isArray(data) ? data : [];
      // Reverse array to show newest notifications first (assuming backend returns in insertion order)
      const reversedNotifications = [...notificationList].reverse();
      setNotifications(reversedNotifications);
      
      // Count unread notifications
      const unread = reversedNotifications.filter(notification => !notification.read).length;
      setUnreadCount(unread);
    } catch (e) {
      setError(e.message || 'Failed to load notifications');
      console.error('Error fetching notifications:', e);
    } finally {
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true, readAt: new Date().toISOString() }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Add new notification
  const addNotification = (notification) => {
    // Add new notification at the beginning to maintain newest first order
    setNotifications(prev => [notification, ...prev]);
    if (!notification.read) {
      setUnreadCount(prev => prev + 1);
    }
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  // Fetch notifications when user changes
  useEffect(() => {
    fetchNotifications();
  }, [user?.id]);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user?.id]);

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    addNotification,
    clearAll
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
