import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  saveFestival: (festivalId: string) => void;
  removeSavedFestival: (festivalId: string) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      // Mock login for now
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo purposes, any email with a password will work
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name: email.split('@')[0],
        email: email,
        savedFestivals: []
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      console.error('Login error', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      // Mock registration for now
      setIsLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name,
        email,
        savedFestivals: []
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      console.error('Registration error', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const saveFestival = (festivalId: string) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      savedFestivals: user.savedFestivals.includes(festivalId)
        ? user.savedFestivals
        : [...user.savedFestivals, festivalId]
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const removeSavedFestival = (festivalId: string) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      savedFestivals: user.savedFestivals.filter(id => id !== festivalId)
    };
    
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        saveFestival,
        removeSavedFestival,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};