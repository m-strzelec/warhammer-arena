import React, { useState, useEffect } from 'react';
import { getCharacters } from '../services/characterService';
import { createFight } from '../services/fightService';

const FightSimulator = () => {
  const [characters, setCharacters] = useState([]);
  const [character1, setCharacter1] = useState('');
  const [character2, setCharacter2] = useState('');
  const [fightLog, setFightLog] = useState([]);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await getCharacters();
        setCharacters(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCharacters();
  }, []);

  const handleFight = async () => {
    try {
      const response = await createFight(character1, character2);
      setFightLog(response.data.log);
    } catch (error) {
      console.error(error);
      alert('Failed to start fight');
    }
  };

  return (
    <div>
      <select onChange={(e) => setCharacter1(e.target.value)} value={character1}>
        <option value="">Select Character 1</option>
        {characters.map((char) => (
          <option key={char._id} value={char._id}>
            {char.name}
          </option>
        ))}
      </select>

      <select onChange={(e) => setCharacter2(e.target.value)} value={character2}>
        <option value="">Select Character 2</option>
        {characters.map((char) => (
          <option key={char._id} value={char._id}>
            {char.name}
          </option>
        ))}
      </select>

      <button onClick={handleFight}>Start Fight</button>

      <div>
        {fightLog.map((log, index) => (
          <p key={index}>{log}</p>
        ))}
      </div>
    </div>
  );
};

export default FightSimulator;
