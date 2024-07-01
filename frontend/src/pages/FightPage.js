import React from 'react';
import { useNavigate } from 'react-router-dom';
import FightSimulator from '../components/FightSimulator';
import { Button } from 'react-bootstrap';

const FightPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div>
      <h1>Fight Simulator</h1>
        <Button variant="primary" onClick={() => handleNavigate('/')}>
          Home
        </Button>
        <Button variant="primary" onClick={() => handleNavigate('/creator')}>
          Create Character
        </Button>
      <FightSimulator />
    </div>
  );
};

export default FightPage;
