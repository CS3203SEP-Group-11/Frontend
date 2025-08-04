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

export async function createCourse(courseData) {
  try {
    const response = await api.post('/courses', courseData);
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to create course');
    }
    throw err;
  }
}

export async function updateCourse(courseId, courseData) {
  try {
    const response = await api.put(`/courses/${courseId}`, courseData);
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to update course');
    }
    throw err;
  }
}

export async function deleteCourse(courseId) {
  try {
    const response = await api.delete(`/courses/${courseId}`);
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to delete course');
    }
    throw err;
  }
}