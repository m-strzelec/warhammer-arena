import React from 'react';
import CharacterCreator from '../components/CharacterCreator';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const CreateCharacterPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div>
      <h1>Create Character</h1>
        <Button variant="primary" onClick={() => handleNavigate('/')}>
          Home
        </Button>
        <Button variant="primary" onClick={() => handleNavigate('/fight')}>
          Fight Simulator
        </Button>
      <CharacterCreator />
    </div>
  );
};

export default CreateCharacterPage;