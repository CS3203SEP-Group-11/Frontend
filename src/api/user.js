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
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to update user');
    }
    throw err;
  }
}

export async function getInstructorById(instructorId) {
  try {
    const response = await api.get(`/instructors/${instructorId}`);
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to fetch instructor');
    }
    throw err;
  }
}

export async function getMyInstructorProfile() {
  try {
    const response = await api.get('/instructors/me');
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to fetch instructor profile');
    }
    throw err;
  }
}

export async function updateMyInstructorProfile(profileData) {
  try {
    const response = await api.put('/instructors/me', profileData);
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to update instructor profile');
    }
    throw err;
  }
}