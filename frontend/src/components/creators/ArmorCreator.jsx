import { useState } from 'react';
import { createArmor } from '../../services/armorService';

const ArmorCreator = () => {
  const [armor, setArmor] = useState({
    name: '', 
    location: '',
    protectionFactor: '',
    traits: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArmor({ ...armor, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createArmor(armor);
      alert('Armor created successfully');
      setArmor({ name: '', buffs: '', protectionFactor: '', traits: [] });
    } catch (error) {
      console.error(error);
      alert('Failed to create armor');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Armor</h3>
      <input type="text" name="name" placeholder="Name" value={armor.name} onChange={handleChange} required />
      <input type="text" name="location" placeholder="Location" value={armor.location} onChange={handleChange} required />
      <input type="number" name="protectionFactor" placeholder="Protection Factor" value={armor.protectionFactor} onChange={handleChange} required />
      <input type="text" name="traits" placeholder="Traits" value={armor.traits} onChange={handleChange} required />
      <button type="submit">Create Armor</button>
    </form>
  );
};

export default ArmorCreator;
