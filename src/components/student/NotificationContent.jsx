import React, { useEffect, useState } from 'react';
import { getNotifications } from '../../api/notification';

const NotificationContent = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError('');
      try {
        // Example: get userId from localStorage
        const user = JSON.parse(localStorage.getItem('user')); // Adjust key as needed
        const userId = user?.id;
        if (!userId) {
          setError('User not logged in');
          setNotifications([]);
          return;
        }
        const data = await getNotifications(userId);
        setNotifications(Array.isArray(data) ? data : (data?.items || []));
      } catch (e) {
        setError(e.message || 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Notifications</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500 dark:text-red-400">{error}</p>
      ) : notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map(n => (
            <li key={n.id} className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
              <div className="text-gray-900 dark:text-white">{n.message}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{n.date}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationContent;