import api from './axios';

export async function buyCourses(courseIds) {
  try {
    const response = await api.post('/payments/purchase-courses', { courseIds });
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to purchase courses');
    }
    throw err;
  }
}


