import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppNavbar from './components/common/AppNavbar';
import AppFooter from './components/common/AppFooter';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FightPage from './pages/FightPage';
import CreateItemsPage from './pages/CreateItemsPage';
import BrowseItemsPage from './pages/BrowseItemsPage';
import CharacterPage from './pages/CharacterPage';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <AppNavbar />
            <Routes>
              <Route 
                path="/" 
                element={<HomePage />} 
              />
              <Route 
                path="/login" 
                element={<ProtectedRoute onlyGuest><LoginPage /></ProtectedRoute>}
              />
              <Route
                path="/register"
                element={<ProtectedRoute onlyGuest><RegisterPage /></ProtectedRoute>}
              />
              <Route
                path="/characters"
                element={<ProtectedRoute><CharacterPage /></ProtectedRoute>}
              />
              <Route
                path="/fight"
                element={<ProtectedRoute><FightPage /></ProtectedRoute>}
              />
              <Route
                path="/create-items"
                element={<ProtectedRoute adminOnly><CreateItemsPage /></ProtectedRoute>}
              />
              <Route
                path="/browse-items"
                element={<ProtectedRoute><BrowseItemsPage /></ProtectedRoute>}
              />
              <Route 
                path="*" 
                element={<NotFoundPage />} 
              />
            </Routes>
            <AppFooter />
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;