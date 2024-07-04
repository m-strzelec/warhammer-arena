import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AppNavbar from './components/common/AppNavbar';
import AppFooter from './components/common/AppFooter';
import HomePage from './pages/HomePage';
import CreateCharacterPage from './pages/CreateCharacterPage';
import FightPage from './pages/FightPage';
import CreateItemsPage from './pages/CreateItemsPage';
import './styles/App.css';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppNavbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create-character" element={<CreateCharacterPage />} />
          <Route path="/fight" element={<FightPage />} />
          <Route path="/create-items" element={<CreateItemsPage />} />
        </Routes>
        <AppFooter />
      </BrowserRouter>
    </div>
  );
}

export default App;