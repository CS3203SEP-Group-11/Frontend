import api from './axios';

// Fetch all notifications for a specific user
export async function getNotifications(userId) {
  try {
    const response = await api.get(`/notifications/user/${userId}`);
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

// Create an email notification
export async function createEmailNotification(data) {
  try {
    const response = await api.post('/notifications/email', data);
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to create email notification');
    }
    throw err;
  }
}

// Create an in-app notification
export async function createInAppNotification(data) {
  try {
    const response = await api.post('/notifications/in-app', data);
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to create in-app notification');
    }
    throw err;
  }
}