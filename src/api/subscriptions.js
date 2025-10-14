import api from './axios';

export async function getSubscriptionPlans() {
  try {
    const response = await api.get('/subscription-plans/active');
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to fetch subscriptions');
    }
    throw err;
  }
}

export async function getMySubscriptions() {
  try {
    const response = await api.get('/subscriptions/me');
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to fetch subscriptions');
    }
    throw err;
  }
}

export async function cancelMySubscription(subscriptionId) {
  try {
    const response = await api.post(`/subscriptions/${subscriptionId}/cancel`);
    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Failed to cancel subscription');
    }
    throw err;
  }
}



