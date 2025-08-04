import React, { createContext, useContext, useEffect, useState } from 'react';
import { getMyProfile } from '../api/user';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  const fetchUser = async () => {
    try {
      const user = await getMyProfile();
      console.log('Fetched user:', user);
      setUser(user);
      setIsLoggedIn(true);
    } catch (err) {
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  // Call this after login/signup to immediately update user data
  const refreshUser = async () => {
    await fetchUser();
  };

useEffect(() => {
  fetchUser(); // Always try once on app load
}, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
