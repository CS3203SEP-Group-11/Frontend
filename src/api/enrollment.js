import api from './axios';
import { getCourseById } from './course';

export async function getUserEnrollmentsWithCourse(userId) {
  try {
    const response = await api.get(`/enrollments/user/${userId}`);
    const enrollments = response.data;

    const results = await Promise.allSettled(
      enrollments.map(async (enrollment) => {
        const course = await getCourseById(enrollment.courseId);
        return {
          ...course,
          ...enrollment,
        };
      })
    );

    return results.map((res, idx) =>
      res.status === 'fulfilled' ? res.value : { ...enrollments[idx], course: null }
    );
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to fetch enrollments');
    }
    throw err;
  }
}

export async function getMyCertificates() {
  try {
    const response = await api.get('/enrollments/certificate/me');
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to fetch my certificates');
    }
    throw err;
  }
}

export async function requestForCertificate(enrollmentId) {
  try {
    const response = await api.get(`/enrollments/certificate/${enrollmentId}/request`);
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to request certificate');
    }
    throw err;
  }
}

export async function markLessonCompleted(enrollmentId, lessonId) {
  try {
    const response = await api.post(`/enrollments/${enrollmentId}/lesson/${lessonId}/complete`);
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to mark lesson as complete');
    }
    throw err;
  }
}
