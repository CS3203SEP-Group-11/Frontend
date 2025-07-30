import api from './axios';

export async function getAllCourses() {
  try {
    const response = await api.get('/courses');
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to fetch courses');
    }
    throw err;
  }
}

export async function getCourseById(courseId) {
  try {
    const response = await api.get(`/courses/${courseId}`);
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to fetch course');
    }
    throw err;
  }
}

