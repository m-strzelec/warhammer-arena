import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
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
    <Form onSubmit={handleSubmit}>
      <h3>Create Weapon</h3>
      <Form.Group controlId="formWeaponName">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" name="name" placeholder="Enter weapon name" value={weapon.name} onChange={handleChange} required />
      </Form.Group>
      <Form.Group controlId="formWeaponDamageFactor">
        <Form.Label>Damage Factor</Form.Label>
        <Form.Control type="number" name="damageFactor" placeholder="Enter damage factor" value={weapon.damageFactor} onChange={handleChange} required />
      </Form.Group>
      <Form.Group controlId="formWeaponTraits">
        <Form.Label>Traits</Form.Label>
        <Form.Control type="text" name="traits" placeholder="Enter weapon traits" value={weapon.traits} onChange={handleChange} required />
      </Form.Group>
      <Form.Group controlId="formWeaponType">
        <Form.Label>Type</Form.Label>
        <Form.Control type="text" name="type" placeholder="Enter weapon type" value={weapon.type} onChange={handleChange} required />
      </Form.Group>
      <Form.Group controlId="formWeaponHandedness">
        <Form.Label>Handedness</Form.Label>
        <Form.Control type="text" name="handedness" placeholder="Enter weapon handedness" value={weapon.handedness} onChange={handleChange} required />
      </Form.Group>
      <Button variant="primary" type="submit">Create Weapon</Button>
    </Form>
  );
};

export default WeaponCreator;
