import React from 'react';
import { Link } from 'react-router-dom';
import CharacterCreator from '../components/CharacterCreator';

const CreateCharacterPage = () => {
  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/fight">Fight Simulator</Link></li>
        </ul>
      </nav>
      <h1>Create Character</h1>
      <CharacterCreator />
    </div>
  );
};

export default CreateCharacterPage;