import api from './axios';

export async function applyForInstructor(data) {
  try {
    const response = await api.post('/instructors/apply', data);
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to apply for instructor');
    }
    throw err;
  }
}

export async function getInstructorApplicationStatus(userId) {
  try {
    const response = await api.get(`/instructors/application-status/${userId}`);
    return response.data.status; // 'pending', 'approved', or null
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to fetch application status');
    }
    throw err;
  }
}