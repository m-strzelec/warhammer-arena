import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { createTalent } from '../../services/talentService';

const TalentCreator = () => {
  const [talent, setTalent] = useState({
    name: '', 
    description: '' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTalent({ ...talent, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTalent(talent);
      alert('Talent created successfully');
      setTalent({ name: '', description: '' });
    } catch (error) {
      console.error(error);
      alert('Failed to create talent');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h3>Create Talent</h3>
      <Form.Group controlId="formTalentName">
        <Form.Label>Name</Form.Label>
        <Form.Control 
          type="text" 
          name="name" 
          placeholder="Enter talent name" 
          value={talent.name} 
          onChange={handleChange} 
          required 
        />
      </Form.Group>
      <Form.Group controlId="formTalentDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control 
          type="text" 
          name="description" 
          placeholder="Enter description" 
          value={talent.conditions} 
          onChange={handleChange} 
          required 
        />
      </Form.Group>
      <Button variant="primary" type="submit">Create Talent</Button>
    </Form>
  );
};

export default TalentCreator;
