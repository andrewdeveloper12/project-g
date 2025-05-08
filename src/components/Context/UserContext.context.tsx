// src/Contexts/UserContext/userContext.context.tsx

import React, { createContext, useContext, useState } from 'react';

interface User {
  id?: string;
  name?: string;
  email?: string;
  // Add more user fields as needed
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  token: string | null;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const defaultContextValue: UserContextType = {
  user: null,
  setUser: () => {},
  token: null,
  setToken: () => {},
};

export const UserContext = createContext<UserContextType>(defaultContextValue);

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('userToken'); // Load token from storage
  });

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
