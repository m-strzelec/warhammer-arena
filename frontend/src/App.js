import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/App.css';
import HomePage from './pages/HomePage';
import CreateCharacterPage from './pages/CreateCharacterPage';
import FightPage from './pages/FightPage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <h1>Warhammer Arena</h1>
      </header>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/creator" element={<CreateCharacterPage />} />
          <Route path="/fight" element={<FightPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
