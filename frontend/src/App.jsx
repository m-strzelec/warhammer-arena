import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppNavbar from './components/common/AppNavbar';
import AppFooter from './components/common/AppFooter';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateCharacterPage from './pages/CreateCharacterPage';
import FightPage from './pages/FightPage';
import CreateItemsPage from './pages/CreateItemsPage';
import BrowseItemsPage from './pages/BrowseItemsPage';
import BrowseCharactersPage from './pages/BrowseCharactersPage';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ToastProvider>
          <AuthProvider>
            <AppNavbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create-character" element={<CreateCharacterPage />} />
              <Route path="/fight" element={<FightPage />} />
              <Route path="/create-items" element={<CreateItemsPage />} />
              <Route path="/browse-items" element={<BrowseItemsPage />} />
              <Route path="/characters" element={<BrowseCharactersPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
            <AppFooter />
          </AuthProvider>
        </ToastProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;