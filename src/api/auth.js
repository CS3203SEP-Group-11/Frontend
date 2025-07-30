import api from './axios';

export async function signup(firstName, lastName, email, password) {
  try {
    const response = await api.post('/auth/register', {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    });

    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Signup failed');
    }
    throw err;
  }
}

export async function login(email, password) {
  try {
    const response = await api.post('/auth/login', {
      email: email,
      password: password
    });

    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Login failed');
    }
    throw err;
  }
}

export async function googleLogin(token) {
  try {
    const response = await api.post('/auth/google/login', {
      token: token
     });

    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Google authentication failed');
    }
    throw err;
  }
}

export async function googleSignup(token) {
  try {
    const response = await api.post('/auth/google/register', {
      token: token
     });

    return response.data;
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Google authentication failed');
    }
    throw err;
  }
}

export async function logout() {
  try {
    await api.get('/auth/logout');
  } catch (err) {
    if (err.response?.data) {
      throw new Error(err.response.data.message || 'Logout failed');
    }
    throw err;
  }
}

