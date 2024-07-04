import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { MultiSelect } from 'primereact/multiselect';
import { createArmor } from '../../services/armorService';

const ArmorCreator = () => {
  const [armor, setArmor] = useState({
    name: '', 
    location: [],
    protectionFactor: '',
    traits: []
  });

  const armorLocations = [
    { label: 'Head', value: 'head' },
    { label: 'Body', value: 'body' },
    { label: 'Left Arm', value: 'leftArm' },
    { label: 'Right Arm', value: 'rightArm' },
    { label: 'Left Leg', value: 'leftLeg' },
    { label: 'Right Leg', value: 'rightLeg' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArmor({ ...armor, [name]: value });
  };

  const handleMultiSelectChange = (e) => {
    setArmor({ ...armor, location: e.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createArmor(armor);
      alert('Armor created successfully');
      setArmor({ name: '', location: [''], protectionFactor: '', traits: [] });
    } catch (error) {
      console.error(error);
      alert('Failed to create armor');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h3>Create Armor</h3>
      <Form.Group controlId="formArmorName">
        <Form.Label>Name</Form.Label>
        <Form.Control 
          type="text" 
          name="name" 
          placeholder="Enter armor name" 
          value={armor.name} 
          onChange={handleChange} 
          required 
        />
      </Form.Group>
      <Form.Group controlId="formArmorLocation">
        <Form.Label>Locations</Form.Label>
        <MultiSelect
          aria-label="Armor locations select"
          value={armor.location}
          options={armorLocations}
          onChange={handleMultiSelectChange}
          placeholder="Select armor locations"
          display="chip"
          className="w-100 text-start"
          required
        />
      </Form.Group>
      <Form.Group controlId="formArmorProtectionFactor">
        <Form.Label>Protection Factor</Form.Label>
        <Form.Control 
          type="number" 
          name="protectionFactor" 
          placeholder="Enter protection factor" 
          value={armor.protectionFactor} 
          onChange={handleChange} 
          required 
        />
      </Form.Group>
      <Form.Group controlId="formArmorTraits">
        <Form.Label>Traits</Form.Label>
        <Form.Control 
          type="text" 
          name="traits" 
          placeholder="Enter traits" 
          value={armor.traits} 
          onChange={handleChange} 
          required 
        />
      </Form.Group>
      <Button variant="primary" type="submit">Create Armor</Button>
    </Form>
  );
};

export default ArmorCreator;
