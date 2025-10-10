import React, { createContext, useContext, useEffect, useState } from 'react';
import { getMyProfile } from '../api/user';
import { setCurrentUserId } from '../api/axios';

/**
 * @typedef {import('../types/user').User} User
 */

/**
 * @typedef {Object} AuthContextValue
 * @property {User|null} user
 * @property {(user: User|null) => void} setUser
 * @property {boolean} isLoggedIn
 * @property {(isLoggedIn: boolean) => void} setIsLoggedIn
 * @property {isSubscribed: boolean} isSubscribed
 * @property {() => Promise<void>} refreshUser
 */

/** @type {React.Context<AuthContextValue>} */

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchUser = async () => {
    try {
      const user = await getMyProfile();
      setUser(user);
      setIsLoggedIn(true);
      setCurrentUserId(user?.id || null);
    } catch (err) {
      setUser(null);
      setIsLoggedIn(false);
      setCurrentUserId(null);
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * @returns {AuthContextValue}
 */
export const useAuth = () => useContext(AuthContext);