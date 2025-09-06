import React, { useEffect, useState } from 'react';
// import your notification API if available
// import { getNotifications } from '../../api/notification';

const NotificationContent = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Example: fetch notifications from backend
    // getNotifications().then(data => {
    //   setNotifications(data);
    //   setLoading(false);
    // });
    // For now, use mock data:
    setTimeout(() => {
      setNotifications([
        { id: 1, message: 'Welcome to LevelUp!', date: '2025-09-06' },
        { id: 2, message: 'Your course progress was updated.', date: '2025-09-05' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      {loading ? (
        <p>Loading...</p>
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