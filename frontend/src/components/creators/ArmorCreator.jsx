import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { MultiSelect } from 'primereact/multiselect';
import { createArmor } from '../../services/armorService';

const ArmorCreator = ({ traitOptions }) => {
  const [error, setError] = useState('');
  const [armor, setArmor] = useState({
    name: '', 
    locations: [],
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

  const handleMultiSelectChange = (e, name) => {
    setArmor({ ...armor, [name]: e.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (armor.locations.length === 0) {
      setError('Please select at least one armor location.')
    } else {
      setError('');
      try {
        await createArmor(armor);
        alert('Armor created successfully');
        setArmor({ name: '', locations: [], protectionFactor: '', traits: [] });
      } catch (error) {
        console.error(error.response.data.message);
        alert(error.response.data.message);
      }
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
          value={armor.locations}
          options={armorLocations}
          onChange={(e) => handleMultiSelectChange(e, 'locations')}
          placeholder="Select armor locations"
          display="chip"
          showClear
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
        <MultiSelect
          aria-label="Armor traits select"
          value={armor.traits}
          options={traitOptions}
          onChange={(e) => handleMultiSelectChange(e, 'traits')}
          placeholder="Select traits"
          display="chip"
          showClear
          filter
          className="w-100 text-start"
          required
        />
      </Form.Group>
      {error && <small style={{ color: 'red' }}>{error}</small>}
      <br />
      <Button variant="primary" type="submit">Create Armor</Button>
    </Form>
  );
};

export default ArmorCreator;
