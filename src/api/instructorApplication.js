import api from './axios';

export async function submitInstructorApplication(data) {
  const res = await api.post('/instructor-applications/', data);
  return res.data;
}

export async function getMyLatestInstructorApplication() {
  const res = await api.get('/instructor-applications/me/latest');
  return res.data; // may be null
}
