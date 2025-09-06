import api from './axios';

// Fetch all notifications for the current user
export async function getNotifications() {
  try {
    const response = await api.get('/notifications/me');
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to fetch notifications');
    }
    throw err;
  }
}

// Mark a notification as read
export async function markNotificationRead(notificationId) {
  try {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to mark notification as read');
    }
    throw err;
  }
}

// Delete a notification
export async function deleteNotification(notificationId) {
  try {
    await api.delete(`/notifications/${notificationId}`);
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to delete notification');
    }
    throw err;
  }
}