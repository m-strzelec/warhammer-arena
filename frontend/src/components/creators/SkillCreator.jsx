import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { createSkill } from '../../services/skillService';

const SkillCreator = () => {
  const [skill, setSkill] = useState({ 
    name: '', 
    baseStat: '', 
    description: '' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSkill({ ...skill, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSkill(skill);
      alert('Skill created successfully');
      setSkill({ name: '', baseStat: '', description: '' });
    } catch (error) {
      console.error(error);
      alert('Failed to create skill');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h3>Create Skill</h3>
      <Form.Group controlId="formSkillName">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" name="name" placeholder="Enter skill name" value={skill.name} onChange={handleChange} required />
      </Form.Group>
      <Form.Group controlId="formSkillBaseStat">
        <Form.Label>Base Stat</Form.Label>
        <Form.Control type="text" name="baseStat" placeholder="Enter skill base stat" value={skill.baseStat} onChange={handleChange} required />
      </Form.Group>
      <Form.Group controlId="formSkillDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control type="text" name="description" placeholder="Enter skill description" value={skill.description} onChange={handleChange} required />
      </Form.Group>
      <Button variant="primary" type="submit">Create Skill</Button>
    </Form>
  );
};

export default SkillCreator;
