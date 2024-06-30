import React, { useState } from 'react';
import { createCharacter } from '../services/characterService';

const CharacterCreator = () => {
    const [character, setCharacter] = useState({
        name: '',
        race: '',
        primaryStats: {
          WS: 0,
          BS: 0,
          S: 0,
          T: 0,
          Ag: 0,
          Int: 0,
          WP: 0,
          Fel: 0
        },
        secondaryStats: {
          A: 0,
          W: 0,
          SB: 0,
          TB: 0,
          M: 0,
          Mag: 0,
          IP: 0,
          FP: 0
        },
        armor: [],
        weapons: [],
        skills: [],
        abilities: []
      });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCharacter({ ...character, [name]: value });
  };

  const handlePrimaryStatChange = (e) => {
    const { name, value } = e.target;
    setCharacter({ ...character, primaryStats: { ...character.primaryStats, [name]: value } });
  };

  const handleSecondaryStatChange = (e) => {
    const { name, value } = e.target;
    setCharacter({ ...character, secondaryStats: { ...character.secondaryStats, [name]: value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCharacter(character);
      alert('Character created successfully');
    } catch (error) {
      console.error(error);
      alert('Failed to create character');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
      <input type="text" name="race" placeholder="Race" onChange={handleChange} required />
      <h3>Primary Stats</h3>
      {Object.keys(character.primaryStats).map(stat => (
        <input key={stat} type="number" name={stat} placeholder={stat} onChange={handlePrimaryStatChange} required />
      ))}
      <h3>Secondary Stats</h3>
      {Object.keys(character.secondaryStats).map(stat => (
        <input key={stat} type="number" name={stat} placeholder={stat} onChange={handleSecondaryStatChange} required />
      ))}
      <button type="submit">Create Character</button>
    </form>
  );
};

export default CharacterCreator;
