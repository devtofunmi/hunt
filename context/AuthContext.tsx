import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface User {
  twitter: any;
  github: any;
  linkedin: any;
  bluesky: any;
  id: string;
  name: string;
  email: string;
  image?: string;
  username?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User, token?: string) => void;
  logout: () => void;
  accessToken: string | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const publicRoutes = ['/', '/auth/login', '/auth/signup'];
  const isPublicRoute = publicRoutes.includes(router.pathname);

  // Load accessToken from localStorage on first mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
    } else {
      setLoading(false); // No token, mark loading complete
    }
  }, []);

  // Fetch user data only after accessToken is set
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch('https://launchhunt.up.railway.app/profile', {
          credentials: 'include',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUserState(data.user);

          if (data.accessToken) {
            setAccessToken(data.accessToken);
            localStorage.setItem('accessToken', data.accessToken);
          }
        } else {
          if (!isPublicRoute) {
            await refreshAccessToken();
          }
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
        if (!isPublicRoute) handleLogout(false);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchUserData();
    }
  }, [accessToken, isPublicRoute, router.pathname]);

  const refreshAccessToken = async () => {
    try {
      const res = await fetch('https://launchhunt.up.railway.app/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Failed to refresh access token');

      const data = await res.json();
      setAccessToken(data.accessToken);
      localStorage.setItem('accessToken', data.accessToken);
      return data.accessToken;
    } catch (err) {
      console.error('Error refreshing access token:', err);
      handleLogout(false);
    }
  };

  const setUser = (user: User, token?: string) => {
    setUserState(user);
    if (token) {
      setAccessToken(token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', token);
      }
    }
  };

  const handleLogout = (shouldRedirect = true) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    setAccessToken(null);
    setUserState(null);
    if (shouldRedirect) {
      router.push('/auth/login');
    }
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
    <AuthContext.Provider
      value={{ user, setUser, logout, accessToken, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;