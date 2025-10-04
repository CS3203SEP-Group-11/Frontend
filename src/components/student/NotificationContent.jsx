import React, { useEffect, useState } from 'react';
import { getNotifications, getInAppNotifications, markInAppNotificationRead } from '../../api/notification';
import { useAuth } from '../../context/AuthContext';

const NotificationContent = () => {
  const { user } = useAuth();
  const [notificationsList, setNotificationsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Helper function to safely format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Recent';
      return date.toLocaleDateString();
    } catch (error) {
      return 'Recent';
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError('');
      try {
        if (!user?.id) {
          setError('User not found');
          setNotificationsList([]);
          return;
        }
        // Try to get in-app notifications first, fallback to general notifications
        try {
          const data = await getInAppNotifications(user.id);
          const notificationsList = Array.isArray(data) ? data : [];
          // Reverse array to show newest notifications first (assuming backend returns in insertion order)
          const reversedNotifications = [...notificationsList].reverse();
          setNotificationsList(reversedNotifications);
        } catch (e) {
          // Fallback to general notifications if in-app fails
          const data = await getNotifications(user.id);
          const notificationsList = Array.isArray(data) ? data : (data?.items || []);
          // Reverse array to show newest notifications first
          const reversedNotifications = [...notificationsList].reverse();
          setNotificationsList(reversedNotifications);
        }
      } catch (e) {
        setError(e.message || 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [user?.id]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markInAppNotificationRead(notificationId);
      // Update the local state to reflect the change
      setNotificationsList(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true, readAt: new Date().toISOString() }
            : notification
        )
      );
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('notificationRead', { 
        detail: { notificationId } 
      }));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      // You could add a toast notification here to show the error
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
      </div>
      
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 dark:text-red-400 mb-2">Error Loading Notifications</h3>
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : notificationsList.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.586 2.586a2 2 0 002.828 0L12 7H4.828z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No notifications yet</h3>
          <p className="text-gray-600 dark:text-gray-400">You'll see notifications about your courses and account here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notificationsList.map(notification => (
            <div key={notification.id} className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow ${
              notification.read ? 'opacity-75' : ''
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {notification.title || 'Notification'}
                    </h3>
                    {!notification.read && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {notification.content || notification.body}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>
                      {formatDate(notification.createdAt || notification.readAt)}
                    </span>
                    {notification.type && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        notification.type === 'info' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        notification.type === 'alert' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      }`}>
                        {notification.type}
                      </span>
                    )}
                    {notification.read && notification.readAt && (
                      <span className="text-green-600 dark:text-green-400">
                        ✓ Read {formatDate(notification.readAt)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 rounded-lg transition-colors"
                    >
                      Mark as Read
                    </button>
                  )}
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationContent;