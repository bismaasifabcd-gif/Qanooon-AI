import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChange, login as firebaseLogin, signUp as firebaseSignUp, logout as firebaseLogout } from '../firebase/auth';
import { getUser, saveUser } from '../firebase/firestore';
import { useLanguage } from './LanguageContext';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { setLanguage } = useLanguage();

  const fetchUserData = useCallback(async (uid) => {
    try {
      const data = await getUser(uid);
      if (data) {
        setUserData(data);
        if (data.preferredLanguage) {
          setLanguage(data.preferredLanguage);
        }
        return data;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
    return null;
  }, [setLanguage]);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (currentUser) => {
      console.log("Auth state changed:", currentUser ? `Logged in: ${currentUser.email}` : "Logged out");
      setUser(currentUser);
      
      if (currentUser) {
        await fetchUserData(currentUser.uid);
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, [fetchUserData]);

  const login = async (email, password) => {
    console.log("Attempting login for:", email);
    try {
      const result = await firebaseLogin(email, password);
      console.log("Login success:", result.user.email);
      return result;
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error;
    }
  };

  const signup = async (email, password) => {
    console.log("Attempting signup for:", email);
    try {
      const userCredential = await firebaseSignUp(email, password);
      const newUser = userCredential.user;
      console.log("Signup success:", newUser.email);
      await saveUser(newUser.uid, '', newUser.email, 'english');
      return userCredential;
    } catch (error) {
      console.error("Signup failed:", error.message);
      throw error;
    }
  };

  const logout = async () => {
    return await firebaseLogout();
  };

  const value = {
    user,
    userData,
    loading,
    login,
    signup,
    logout,
    refreshUserData: () => user && fetchUserData(user.uid)
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
