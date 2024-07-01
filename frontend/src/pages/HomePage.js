import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div>
      <h1>Home Page</h1>
      <nav>
        <ul>
          <li><Link to="/creator">Create Character</Link></li>
          <li><Link to="/fight">Fight Simulator</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default HomePage;
