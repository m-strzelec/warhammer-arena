import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div>
      <h1>Home Page</h1>
        <Button variant="primary" onClick={() => handleNavigate('/creator')}>
          Create Character
        </Button>
        <Button variant="primary" onClick={() => handleNavigate('/fight')}>
          Fight Simulator
        </Button>
    </div>
  );
};

export default HomePage;
