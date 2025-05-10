import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  role: string;
  permissions: string[];
  provider?: 'email' | 'google' | 'facebook';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  register: (userData: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const clearError = () => setError(null);

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    return user.role === role;
  };

  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
      const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
      
      if (storedToken && storedUser) {
        try {
          setLoading(true);
          clearError();
          await new Promise(resolve => setTimeout(resolve, 500));

          const parsedUser = JSON.parse(storedUser);
          if (!parsedUser.permissions) {
            parsedUser.permissions = getDefaultPermissions(parsedUser.role);
          }
          
          setUser(parsedUser);
          setToken(storedToken);
        } catch (err) {
          setError('Session verification failed');
          localStorage.removeItem('token');
          localStorage.removeItem('currentUser');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('currentUser');
        } finally {
          setLoading(false);
        }
      }
    };

    verifyToken();
  }, []);

  const getDefaultPermissions = (role: string = 'user'): string[] => {
    const permissionsMap: Record<string, string[]> = {
      admin: ['manage_users', 'edit_content', 'view_reports'],
      editor: ['edit_content', 'view_reports'],
      user: ['view_content']
    };
    return permissionsMap[role] || permissionsMap.user;
  };

  const login = async (email: string, password: string, remember = false) => {
    setLoading(true);
    clearError();
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      await new Promise(resolve => setTimeout(resolve, 800));

      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]') as User[];

      const foundUser = registeredUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      const userWithPermissions = {
        ...foundUser,
        permissions: foundUser.permissions || getDefaultPermissions(foundUser.role)
      };

      const mockToken = 'mock-jwt-token';

      if (remember) {
        localStorage.setItem('token', mockToken);
        localStorage.setItem('currentUser', JSON.stringify(userWithPermissions));
      } else {
        sessionStorage.setItem('token', mockToken);
        sessionStorage.setItem('currentUser', JSON.stringify(userWithPermissions));
      }

      setToken(mockToken);
      setUser(userWithPermissions);
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    clearError();
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockGoogleUser = {
        id: 'google-' + Date.now(),
        name: 'Google User',
        email: 'google.user@example.com',
        password: '',
        avatar: 'https://ui-avatars.com/api/?name=Google+User',
        role: 'user',
        permissions: getDefaultPermissions('user'),
        provider: 'google' as const
      };

      const mockToken = 'mock-google-token';
      localStorage.setItem('token', mockToken);
      localStorage.setItem('currentUser', JSON.stringify(mockGoogleUser));

      setToken(mockToken);
      setUser(mockGoogleUser);
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithFacebook = async () => {
    setLoading(true);
    clearError();
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockFacebookUser = {
        id: 'facebook-' + Date.now(),
        name: 'Facebook User',
        email: 'facebook.user@example.com',
        password: '',
        avatar: 'https://ui-avatars.com/api/?name=Facebook+User',
        role: 'user',
        permissions: getDefaultPermissions('user'),
        provider: 'facebook' as const
      };

      const mockToken = 'mock-facebook-token';
      localStorage.setItem('token', mockToken);
      localStorage.setItem('currentUser', JSON.stringify(mockFacebookUser));

      setToken(mockToken);
      setUser(mockFacebookUser);
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Facebook login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: { name: string; email: string; password: string }) => {
    setLoading(true);
    clearError();
    try {
      if (!userData.email || !userData.password || !userData.name) {
        throw new Error('All fields are required');
      }

      await new Promise(resolve => setTimeout(resolve, 800));

      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]') as User[];

      const existingUser = registeredUsers.find((u) => u.email === userData.email);
      if (existingUser) {
        throw new Error('User already exists');
      }

      const newUser: User = {
        id: (registeredUsers.length + 1).toString(),
        name: userData.name,
        email: userData.email,
        password: userData.password,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}`,
        role: 'user',
        permissions: getDefaultPermissions('user'),
        provider: 'email'
      };
      registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

      navigate('/login');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendPasswordResetEmail = async (email: string) => {
    setLoading(true);
    clearError();
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      await new Promise(resolve => setTimeout(resolve, 800));

      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]') as User[];
      const userExists = registeredUsers.some((u) => u.email === email);

      if (!userExists) {
        throw new Error('No user found with this email');
      }

      console.log(`Password reset email sent to ${email}`);
      return Promise.resolve();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send reset email';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('currentUser');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    token,
    login,
    loginWithGoogle,
    loginWithFacebook,
    register,
    logout,
    sendPasswordResetEmail,
    isAuthenticated: !!token,
    loading,
    error,
    clearError,
    hasPermission,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;