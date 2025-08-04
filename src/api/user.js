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
    const response = await axios.get(`${API_BASE_URL}/users/${userId}`);
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
    const response = await axios.put(`${API_BASE_URL}/users/${userId}`, userData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to update user');
    }
    throw err;
  }
}
