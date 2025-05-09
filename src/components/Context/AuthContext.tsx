import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
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
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  setAuthToken: (token: string, remember?: boolean) => void;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
  }) => Promise<void>;
  logout: () => void;
  sendPasswordResetEmail: (email: string) => Promise<void>;
  verifyEmail: (email: string, otp: string) => Promise<{ token?: string }>;
  resendVerificationEmail: (email: string) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const setAuthToken = useCallback((newToken: string, remember = true) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('token', newToken);
    setToken(newToken);

    // Update token in current user if exists
    if (user) {
      const storageUser = storage.getItem('currentUser');
      if (storageUser) {
        const currentUser = JSON.parse(storageUser);
        storage.setItem('currentUser', JSON.stringify({ ...currentUser }));
      }
    }
  }, [user]);

  const clearError = useCallback(() => setError(null), []);

  const getDefaultPermissions = useCallback((role: string = 'user'): string[] => {
    const permissionsMap: Record<string, string[]> = {
      admin: ['manage_users', 'edit_content', 'view_reports', 'delete_content'],
      editor: ['edit_content', 'view_reports'],
      user: ['view_content']
    };
    return permissionsMap[role] || permissionsMap.user;
  }, []);

  const hasPermission = useCallback((permission: string): boolean => {
    return !!user?.permissions?.includes(permission);
  }, [user]);

  const hasRole = useCallback((role: string): boolean => {
    return user?.role === role;
  }, [user]);

  const persistAuthData = useCallback((userData: User, authToken: string, remember: boolean) => {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem('token', authToken);
    storage.setItem('currentUser', JSON.stringify(userData));
    setToken(authToken);
    setUser(userData);
  }, []);

  const clearAuthData = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('currentUser');
    setToken(null);
    setUser(null);
  }, []);

  const verifyToken = useCallback(async () => {
    const storedToken = localStorage.getItem('token') || sessionStorage.getItem('token');
    const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    
    if (storedToken && storedUser) {
      try {
        setLoading(true);
        clearError();
        
        await new Promise(resolve => setTimeout(resolve, 500));

        const parsedUser: User = JSON.parse(storedUser);
        if (!parsedUser.permissions) {
          parsedUser.permissions = getDefaultPermissions(parsedUser.role);
        }
        
        setUser(parsedUser);
        setToken(storedToken);
      } catch (err) {
        console.error('Token verification failed:', err);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    }
  }, [clearAuthData, clearError, getDefaultPermissions]);

  useEffect(() => {
    verifyToken();
  }, [verifyToken]);

  const login = useCallback(async (email: string, password: string, remember = false) => {
    setLoading(true);
    clearError();
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      await new Promise(resolve => setTimeout(resolve, 800));

      const registeredUsers: User[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const foundUser = registeredUsers.find(
        (u) => u.email === email && u.password === password
      );

      if (!foundUser) {
        throw new Error('Invalid email or password');
      }

      if (!foundUser.isVerified) {
        throw new Error('Please verify your email first');
      }

      const userWithPermissions = {
        ...foundUser,
        permissions: foundUser.permissions || getDefaultPermissions(foundUser.role)
      };

      const mockToken = `mock-jwt-token-${Date.now()}`;
      persistAuthData(userWithPermissions, mockToken, remember);
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError, getDefaultPermissions, navigate, persistAuthData]);

  const loginWithGoogle = useCallback(async () => {
    setLoading(true);
    clearError();
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockGoogleUser: User = {
        id: `google-${Date.now()}`,
        name: 'Google User',
        email: `google.user.${Date.now()}@example.com`,
        password: '',
        avatar: 'https://ui-avatars.com/api/?name=Google+User',
        role: 'user',
        permissions: getDefaultPermissions('user'),
        provider: 'google',
        isVerified: true
      };

      const mockToken = `mock-google-token-${Date.now()}`;
      persistAuthData(mockGoogleUser, mockToken, true);
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError, getDefaultPermissions, navigate, persistAuthData]);

  const loginWithFacebook = useCallback(async () => {
    setLoading(true);
    clearError();
    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const mockFacebookUser: User = {
        id: `facebook-${Date.now()}`,
        name: 'Facebook User',
        email: `facebook.user.${Date.now()}@example.com`,
        password: '',
        avatar: 'https://ui-avatars.com/api/?name=Facebook+User',
        role: 'user',
        permissions: getDefaultPermissions('user'),
        provider: 'facebook',
        isVerified: true
      };

      const mockToken = `mock-facebook-token-${Date.now()}`;
      persistAuthData(mockFacebookUser, mockToken, true);
      navigate('/');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Facebook login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError, getDefaultPermissions, navigate, persistAuthData]);

  const register = useCallback(async (userData: {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
  }) => {
    setLoading(true);
    clearError();
    try {
      if (!userData.email || !userData.password || !userData.name) {
        throw new Error('All fields are required');
      }

      if (userData.password !== userData.passwordConfirmation) {
        throw new Error('Passwords do not match');
      }

      await new Promise(resolve => setTimeout(resolve, 800));

      const registeredUsers: User[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

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
        provider: 'email',
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      registeredUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

      console.log(`Verification email sent to ${newUser.email}`);
      
      navigate('/verify-email', { state: { email: newUser.email } });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError, getDefaultPermissions, navigate]);

  const verifyEmail = useCallback(async (email: string, otp: string) => {
    setLoading(true);
    clearError();
    try {
      if (!email || !otp) {
        throw new Error('Email and OTP are required');
      }

      await new Promise(resolve => setTimeout(resolve, 800));

      const registeredUsers: User[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userIndex = registeredUsers.findIndex((u) => u.email === email);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      if (otp !== '123456') {
        throw new Error('Invalid verification code');
      }

      registeredUsers[userIndex] = {
        ...registeredUsers[userIndex],
        isVerified: true
      };

      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

      const mockToken = `mock-verified-token-${Date.now()}`;
      
      return { token: mockToken };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Email verification failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const resendVerificationEmail = useCallback(async (email: string) => {
    setLoading(true);
    clearError();
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      await new Promise(resolve => setTimeout(resolve, 800));

      const registeredUsers: User[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userExists = registeredUsers.some((u) => u.email === email);

      if (!userExists) {
        throw new Error('No user found with this email');
      }

      console.log(`Verification email resent to ${email}`);
      return Promise.resolve();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to resend verification email';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [clearError]);

  const sendPasswordResetEmail = useCallback(async (email: string) => {
    setLoading(true);
    clearError();
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      await new Promise(resolve => setTimeout(resolve, 800));

      const registeredUsers: User[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
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
  }, [clearError]);

  const updateUserProfile = useCallback(async (updates: Partial<User>) => {
    setLoading(true);
    clearError();
    try {
      if (!user) {
        throw new Error('Not authenticated');
      }

      await new Promise(resolve => setTimeout(resolve, 800));

      const registeredUsers: User[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userIndex = registeredUsers.findIndex((u) => u.id === user.id);

      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const updatedUser = {
        ...registeredUsers[userIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      registeredUsers[userIndex] = updatedUser;
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

      const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
      storage.setItem('currentUser', JSON.stringify(updatedUser));

      setUser(updatedUser);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Profile update failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user, clearError]);

  const logout = useCallback(() => {
    clearAuthData();
    navigate('/login');
  }, [clearAuthData, navigate]);

  const value = {
    user,
    token,
    setAuthToken,
    login,
    loginWithGoogle,
    loginWithFacebook,
    register,
    logout,
    sendPasswordResetEmail,
    verifyEmail,
    resendVerificationEmail,
    isAuthenticated: !!token,
    loading,
    error,
    clearError,
    hasPermission,
    hasRole,
    updateUserProfile
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

export default AuthContext;