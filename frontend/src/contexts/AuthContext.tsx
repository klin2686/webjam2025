import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authAPI, storage, APIError, type AuthResponse, type LoginCredentials, type RegisterCredentials } from '../utils/api';

interface User {
  id: number;
  email: string;
  name: string | null;
  email_verified: boolean;
  profile_picture: string | null;
  created_at: string;
  has_password: boolean;
  has_google_auth: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  loginWithGoogle: (token: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      const accessToken = storage.getAccessToken();
      const storedUser = storage.getUser();

      if (accessToken && storedUser) {
        try {
          const { user: currentUser } = await authAPI.getCurrentUser(accessToken);
          setUser(currentUser);
          storage.setUser(currentUser);
        } catch {
          const refreshToken = storage.getRefreshToken();
          if (refreshToken) {
            try {
              const { access_token } = await authAPI.refreshToken(refreshToken);
              storage.setTokens(access_token, refreshToken);
              const { user: currentUser } = await authAPI.getCurrentUser(access_token);
              setUser(currentUser);
              storage.setUser(currentUser);
            } catch {
              storage.clearAll();
              setUser(null);
            }
          } else {
            storage.clearAll();
            setUser(null);
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const handleAuthResponse = (response: AuthResponse) => {
    setUser(response.user);
    storage.setTokens(response.access_token, response.refresh_token);
    storage.setUser(response.user);
    setError(null);
  };

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(credentials);
      handleAuthResponse(response);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(credentials);
      handleAuthResponse(response);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (token: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authAPI.googleAuth(token);
      handleAuthResponse(response);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    storage.clearAll();
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
