// Save user and token with expiry
export function saveUserSession(user) {
  // user.token should be JWT, user.exp should be expiry (in seconds)
  const data = {
    user,
    token: user.token,
    exp: user.exp || getJwtExp(user.token), // fallback to parsing JWT exp
    savedAt: Date.now()
  };
  sessionStorage.setItem('userSession', JSON.stringify(data));
}

// Get user if token is valid (not expired)
export function getUserSession() {
  const raw = sessionStorage.getItem('userSession');
  if (!raw) return null;
  const data = JSON.parse(raw);
  const nowSec = Math.floor(Date.now() / 1000);
  if (data.exp && nowSec < data.exp) {
    return data.user;
  } else {
    removeUserSession();
    return null;
  }
}

// Remove user session
export function removeUserSession() {
  sessionStorage.removeItem('userSession');
}

// Helper: parse JWT and get exp claim
function getJwtExp(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp;
  } catch {
    return null;
  }
}
