import api from './axios';

export async function getMyProfile() {
  try {
    const response = await api.get('/users/me');
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to fetch profile');
    }
    throw err;
  }
}

export async function getUserById(userId) {
  try {
    // Fixed: Use 'api' instead of 'axios' and remove API_BASE_URL
    const response = await api.get(`/users/${userId}`);
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to fetch user');
    }
    throw err;
  }
}

export async function updateUserById(userId, userData) {
  try {
    // Fixed: Use 'api' instead of 'axios' and remove API_BASE_URL
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to update user');
    }
    throw err;
  }
}