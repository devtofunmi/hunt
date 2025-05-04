'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface AuthContextType {
  user: any;
  setUser: (user: any, token?: string) => void;
  logout: () => void;
  accessToken: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('https://launchhunt.up.railway.app/profile', {
          credentials: 'include', // 👈 required to send cookies
        });
  
        if (res.ok) {
          const data = await res.json();
          setUserState(data.user);
  
          // Save new access token to localStorage if you still want to use it elsewhere
          if (data.accessToken) {
            setAccessToken(data.accessToken);
            localStorage.setItem('accessToken', data.accessToken);
          }
        } else {
          handleLogout();
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
        handleLogout();
      }
    };
  
    fetchUserData();
  }, []);
  

  const setUser = (user: any, token?: string) => {
    setUserState(user);
    if (token) {
      setAccessToken(token);
      localStorage.setItem('accessToken', token);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setAccessToken(null);
    setUserState(null);
    router.push('/auth/login');
  };

  const logout = async () => {
    try {
      await fetch('https://launchhunt.up.railway.app/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      handleLogout();
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, accessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
