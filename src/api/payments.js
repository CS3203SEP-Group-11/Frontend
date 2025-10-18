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

export async function enrollToCoursesWithSubscription(courseIds) {
  try {
    const response = await api.post('/payments/subscription-enrollment', { courseIds });
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to enroll with subscription');
    }
    throw err;
  }
};

export async function buySubscriptionPlan(subscriptionPlanId) {
  try {
    const response = await api.post('/subscriptions/create', { subscriptionPlanId });
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to create subscription');
    }
    throw err;
  }
}

