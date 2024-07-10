import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
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
      console.error(error.response.data.message);
      alert(error.response.data.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h3>Create Trait</h3>
      <Form.Group controlId="formTraitName">
        <Form.Label>Name</Form.Label>
        <Form.Control 
          type="text" 
          name="name" 
          placeholder="Enter trait name" 
          value={trait.name} 
          onChange={handleChange} 
          required 
        />
      </Form.Group>
      <Form.Group controlId="formTraitEffect">
        <Form.Label>Description</Form.Label>
        <Form.Control 
          type="text" 
          name="description" 
          placeholder="Enter description" 
          value={trait.description} 
          onChange={handleChange} 
          required 
        />
      </Form.Group>
      <Button variant="primary" type="submit">Create Trait</Button>
    </Form>
  );
};

export default TraitCreator;
