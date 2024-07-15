import { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { createTrait } from '../../services/traitService';
import { useToast } from '../../contexts/ToastContext';

const TraitCreator = () => {
  const { showToast } = useToast();
  const [trait, setTrait] = useState({ 
    name: '', 
    description: '' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTrait((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTrait(trait);
      showToast('success', 'Success', 'Trait created successfully');
      setTrait({ name: '', description: '' });
    } catch (error) {
      showToast('error', 'Error', error.response.data.message);
      console.error(error.response.data?.error || error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Trait</h3>
      <Row className="justify-content-center mt-4">
        <Col md={10}>
          <Row className="mb-3">
            <Col>
              <div className="p-field d-flex align-items-center">
                <label htmlFor="name" className="me-2 mb-0 create-label">Name:</label>
                <InputText
                  id="name" 
                  name="name" 
                  placeholder="Enter trait name" 
                  value={trait.name} 
                  onChange={handleChange}
                  className="w-100"
                  required 
                />
              </div>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <div className="p-field d-flex align-items-center">
                <label htmlFor="description" className="me-2 mb-0 create-label">Description:</label>
                <InputText 
                  id="description" 
                  name="description" 
                  placeholder="Enter description" 
                  value={trait.description} 
                  onChange={handleChange}
                  className="w-100"
                  required 
                />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Button variant="primary" type="submit">Create Trait</Button>
    </form>
  );
};

export default TraitCreator;
