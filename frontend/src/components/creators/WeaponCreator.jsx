import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Dropdown } from 'primereact/dropdown';
import { createWeapon } from '../../services/weaponService';

const WeaponCreator = () => {
  const [weapon, setWeapon] = useState({ 
    name: '', 
    damageFactor: '', 
    traits: '',
    type: '',
    handedness: '' 
  });

  const weaponTypes = [
    { label: 'Melee', value: 'melee' },
    { label: 'Range', value: 'range' }
  ];

  const weaponHandedness = [
    { label: 'One-handed', value: 'one-handed' },
    { label: 'Two-handed', value: 'two-handed' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWeapon({ ...weapon, [name]: value });
  }

  const handleDropdownChange = (e, name) => {
    setWeapon({ ...weapon, [name]: e.value });
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
        <Form.Control 
          type="text" 
          name="name" 
          placeholder="Enter weapon name" 
          value={weapon.name} 
          onChange={handleChange}
          required 
        />
      </Form.Group>
      <Form.Group controlId="formWeaponDamageFactor">
        <Form.Label>Damage Factor</Form.Label>
        <Form.Control 
          type="number" 
          name="damageFactor" 
          placeholder="Enter damage factor" 
          value={weapon.damageFactor} 
          onChange={handleChange}  
          required 
        />
      </Form.Group>
      <Form.Group controlId="formWeaponTraits">
        <Form.Label>Traits</Form.Label>
        <Form.Control 
          type="text" 
          name="traits" 
          placeholder="Enter traits" 
          value={weapon.traits} 
          onChange={handleChange} 
          required 
        />
      </Form.Group>
      <Form.Group controlId="formWeaponType">
        <Form.Label>Type</Form.Label>
        <Dropdown
          aria-label="Weapon type select" 
          value={weapon.type}
          options={weaponTypes}
          onChange={(e) => handleDropdownChange(e, 'type')}
          placeholder="Select weapon type"
          className="w-100 text-start"
          required
        />
      </Form.Group>
      <Form.Group controlId="formWeaponHandedness">
        <Form.Label>Handedness</Form.Label>
        <Dropdown
          aria-label="Weapon handedness select" 
          value={weapon.handedness}
          options={weaponHandedness}
          onChange={(e) => handleDropdownChange(e, 'handedness')}
          placeholder="Select weapon handedness"
          className="w-100 text-start"
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit">Create Weapon</Button>
    </Form>
  );
};

export default WeaponCreator;
