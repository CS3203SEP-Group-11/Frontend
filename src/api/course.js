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

export async function getAllCategories() {
  try {
    const response = await api.get('/courses/categories');
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to fetch categories');
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

export async function getMyCourses() {
  try {
    const response = await api.get('/courses/instructor/me');
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to fetch my courses');
    }
    throw err;
  }
}

export async function updateCourseStatus(courseId, status) {
  try {
    const response = await api.put(`/courses/state/${status}/${courseId}`);
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to update course status');
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