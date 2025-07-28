const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:8080/api';

export async function signup(firstName, lastName, email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Signup failed');
    }

    return await response.json();
  } catch (err) {
    throw err;
  }
}

export async function login(email, password) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return await response.json();
  } catch (err) {
    throw err;
  }
}

export async function googleAuthentication(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idToken: token
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Google authentication failed');
    }

    return await response.json();
  } catch (err) {
    throw err;
  }
}

export async function logout() {
  // This function can be used to clear any client-side session or token
}

