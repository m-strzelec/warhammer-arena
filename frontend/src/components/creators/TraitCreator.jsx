import { useState } from 'react';
import { createTrait } from '../../services/traitService';

const TraitCreator = () => {
  const [trait, setTrait] = useState({ 
    name: '', 
    description: '' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrait({ ...trait, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTrait(trait);
      alert('Trait created successfully');
      setTrait({ name: '', description: '' });
    } catch (error) {
      console.error(error);
      alert('Failed to create trait');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Trait</h3>
      <input type="text" name="name" placeholder="Name" value={trait.name} onChange={handleChange} required />
      <input type="text" name="description" placeholder="Description" value={trait.description} onChange={handleChange} required />
      <button type="submit">Create Trait</button>
    </form>
  );
};

export default TraitCreator;
