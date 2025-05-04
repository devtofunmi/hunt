import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface AuthContextType {
  user: any;
  token: string | null;
  setToken: (token: string | null) => void;
  setUser: (user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch user data from the backend using the token in the cookie
    const fetchUserData = async () => {
      const res = await fetch('/profile', {
        method: 'GET',
        credentials: 'include', // Ensures cookies are sent
      });

      if (res.ok) {
        const userData = await res.json();
        setUserState(userData.user); // Assuming user data is returned
      } else {
        // Handle unauthenticated state
        setUserState(null);
      }
    };

    fetchUserData();
  }, []);

  const setToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      // Optionally, send the token to the backend (to set the cookie)
      fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: newToken }),
      });
    }
  };

  const setUser = (user: any) => {
    setUserState(user);
  };

  const logout = async () => {
    await fetch('/logout', { method: 'POST' }); // Send logout request to clear the cookie
    setToken(null);
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, setToken, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

