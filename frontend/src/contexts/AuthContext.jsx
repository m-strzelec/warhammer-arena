import { createContext, useContext, useState, useEffect } from 'react';
import { login, register, logout, getSelf } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await getSelf();
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogin = async (username, password) => {
    await login({ username, password });
    await fetchUser();
  };

  const handleRegister = async (username, password) => {
    await register({ username, password });
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, handleLogin, handleLogout, handleRegister }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);