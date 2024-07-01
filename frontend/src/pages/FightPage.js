import React from 'react';
import { Link } from 'react-router-dom';
import FightSimulator from '../components/FightSimulator';

const FightPage = () => {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/creator">Create Character</Link></li>
        </ul>
      </nav>
      <h1>Fight Simulator</h1>
      <FightSimulator />
    </div>
  );
};

export default FightPage;
