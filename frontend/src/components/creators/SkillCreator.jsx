import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Dropdown } from 'primereact/dropdown';
import { createSkill } from '../../services/skillService';

const SkillCreator = () => {
  const [skill, setSkill] = useState({ 
    name: '', 
    baseStat: '', 
    description: '' 
  });

  const baseStats = [
    { label: 'Weapon Skill', value: 'WS' },
    { label: 'Ballistic Skill', value: 'BS' },
    { label: 'Strength', value: 'S' },
    { label: 'Toughness', value: 'T' },
    { label: 'Agility', value: 'Ag' },
    { label: 'Intelligence', value: 'Int' },
    { label: 'Will Power', value: 'WP' },
    { label: 'Fellowship', value: 'Fel' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSkill({ ...skill, [name]: value });
  };

  const handleDropdownChange = (e, name) => {
    setSkill({ ...skill, [name]: e.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSkill(skill);
      alert('Skill created successfully');
      setSkill({ name: '', baseStat: '', description: '' });
    } catch (error) {
      console.error(error.response.data.message);
      alert(error.response.data.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h3>Create Skill</h3>
      <Form.Group controlId="formSkillName">
        <Form.Label>Name</Form.Label>
        <Form.Control 
          type="text" 
          name="name" 
          placeholder="Enter skill name" 
          value={skill.name} 
          onChange={handleChange} 
          required 
        />
      </Form.Group>
      <Form.Group controlId="formSkillBaseStat">
        <Form.Label>Base Stat</Form.Label>
        <Dropdown
          aria-label="Base stat select" 
          value={skill.baseStat}
          options={baseStats}
          onChange={(e) => handleDropdownChange(e, 'baseStat')}
          placeholder="Select base stat"
          className="w-100 text-start"
          required
        />
      </Form.Group>
      <Form.Group controlId="formSkillDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control 
          type="text" 
          name="description" 
          placeholder="Enter description" 
          value={skill.description} 
          onChange={handleChange} 
          required 
        />
      </Form.Group>
      <Button variant="primary" type="submit">Create Skill</Button>
    </Form>
  );
};

export default SkillCreator;
