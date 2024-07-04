import { useState } from 'react';
import { createWeapon } from '../../services/weaponService';

const WeaponCreator = () => {
  const [weapon, setWeapon] = useState({ 
    name: '', 
    damageFactor: '', 
    traits: '',
    type: '',
    handedness: '' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWeapon({ ...weapon, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createWeapon(weapon);
      alert('Weapon created successfully');
      setWeapon({ name: '', damageFactor: '', traits: '', type: '', handedness: '' });
    } catch (error) {
      console.error(error);
      alert('Failed to create weapon');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Weapon</h3>
      <input type="text" name="name" placeholder="Name" value={weapon.name} onChange={handleChange} required />
      <input type="number" name="damageFactor" placeholder="Damage Factor" value={weapon.damageFactor} onChange={handleChange} required />
      <input type="text" name="traits" placeholder="Traits" value={weapon.traits} onChange={handleChange} required />
      <input type="text" name="type" placeholder="Type" value={weapon.type} onChange={handleChange} required />
      <input type="text" name="handedness" placeholder="Handedness" value={weapon.handedness} onChange={handleChange} required />
      <button type="submit">Create Weapon</button>
    </form>
  );
};

export default WeaponCreator;
