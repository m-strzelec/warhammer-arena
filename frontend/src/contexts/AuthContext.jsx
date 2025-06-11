import { createContext, useContext, useState, useEffect } from 'react';
import { login, register, logout, getSelf } from '../services/authService';
import { useToast } from './ToastContext';
import LoadingPage from '../components/common/LoadingPage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const handleSessionExpired = () => {
      showToast('error', 'Session Expired', 'Your session has expired. Please log in again.');
      handleLogout();
    };
    window.addEventListener('auth:sessionExpired', handleSessionExpired);
    return () => {
      window.removeEventListener('auth:sessionExpired', handleSessionExpired);
    };
  }, [showToast]);

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
    window.location.href = '/login';
    await logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      handleLogin,
      handleLogout,
      handleRegister
    }}>
      {loading ? <LoadingPage message="Checking authentication..." /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);