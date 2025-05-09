import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface UserContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
  userEmail: string | null;
  setUserEmail: (email: string | null) => void;
  isEmailVerified: boolean;
  setIsEmailVerified: (verified: boolean) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [token, setTokenState] = useState<string | null>(() => {
    return localStorage.getItem('userToken');
  });
  const [userEmail, setUserEmailState] = useState<string | null>(() => {
    return localStorage.getItem('userEmail');
  });
  const [isEmailVerified, setIsEmailVerifiedState] = useState<boolean>(() => {
    return localStorage.getItem('isEmailVerified') === 'true';
  });

  // Sync state with localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const storedToken = localStorage.getItem('userToken');
      const storedEmail = localStorage.getItem('userEmail');
      const storedVerified = localStorage.getItem('isEmailVerified') === 'true';
      
      if (storedToken !== token) {
        setTokenState(storedToken);
      }
      if (storedEmail !== userEmail) {
        setUserEmailState(storedEmail);
      }
      if (storedVerified !== isEmailVerified) {
        setIsEmailVerifiedState(storedVerified);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [token, userEmail, isEmailVerified]);

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem('userToken', newToken);
    } else {
      localStorage.removeItem('userToken');
    }
  };

  const setUserEmail = (email: string | null) => {
    setUserEmailState(email);
    if (email) {
      localStorage.setItem('userEmail', email);
    } else {
      localStorage.removeItem('userEmail');
    }
  };

  const setIsEmailVerified = (verified: boolean) => {
    setIsEmailVerifiedState(verified);
    localStorage.setItem('isEmailVerified', verified ? 'true' : 'false');
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isEmailVerified');
    setTokenState(null);
    setUserEmailState(null);
    setIsEmailVerifiedState(false);
  };

  const value = {
    token,
    setToken,
    isAuthenticated: !!token,
    logout,
    userEmail,
    setUserEmail,
    isEmailVerified,
    setIsEmailVerified,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};