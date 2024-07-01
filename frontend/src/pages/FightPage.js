import React from 'react';
import { Link } from 'react-router-dom';
import FightSimulator from '../components/FightSimulator';

const FightPage = () => {
  return (
    <div>
      <h1>Fight Simulator</h1>
      <FightSimulator />
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/creator">Create Character</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default FightPage;
