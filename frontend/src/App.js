import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppNavbar from './components/AppNavbar';
import AppFooter from './components/AppFooter';
import HomePage from './pages/HomePage';
import CreateCharacterPage from './pages/CreateCharacterPage';
import FightPage from './pages/FightPage';
import './styles/App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppNavbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/creator" element={<CreateCharacterPage />} />
          <Route path="/fight" element={<FightPage />} />
        </Routes>
        <AppFooter />
      </BrowserRouter>
    </div>
  );
}

export default App;