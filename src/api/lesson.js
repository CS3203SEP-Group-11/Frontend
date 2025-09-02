import api from './axios';

export async function getLessonByCourseId(courseId) {
  try {
    const response = await api.get(`/lessons/course/${courseId}`);
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to fetch lessons');
    }
    throw err;
  }
}

export async function getLessonById(lessonId) {
  try {
    const response = await api.get(`/lessons/${lessonId}`);
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to fetch lesson');
    }
    throw err;
  }
}

export async function createLesson(lessonData) {
  try {
    const response = await api.post('/lessons', lessonData);
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to create lesson');
    }
    throw err;
  }
}

export async function updateLesson(lessonId, lessonData) {
  try {
    const response = await api.put(`/lessons/${lessonId}`, lessonData);
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to update lesson');
    }
    throw err;
  }
}

export async function deleteLesson(lessonId) {
  try {
    await api.delete(`/lessons/${lessonId}`);
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to delete lesson');
    }
    throw err;
  }
}

export async function changeLessonState(lessonId, status) {
  try {
    const response = await api.put(`/lessons/state/${lessonId}`, status);
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to change lesson state');
    }
    throw err;
  }
}
