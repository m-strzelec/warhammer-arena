import { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { createTalent } from '../../services/talentService';

const TalentCreator = () => {
  const [talent, setTalent] = useState({
    name: '', 
    description: '' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTalent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTalent(talent);
      alert('Talent created successfully');
      setTalent({ name: '', description: '' });
    } catch (error) {
      console.error(error.response.data.message);
      alert(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Talent</h3>
      <Row className="justify-content-center mt-4">
        <Col md={10}>
          <Row className="mb-3">
            <Col>
              <div className="p-field d-flex align-items-center">
                <label htmlFor="name" className="me-2 mb-0 create-label">Name:</label>
                <InputText
                  id="name" 
                  name="name" 
                  placeholder="Enter talent name" 
                  value={talent.name} 
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
                  value={talent.description} 
                  onChange={handleChange} 
                  className="w-100"
                  required 
                />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Button variant="primary" type="submit">Create Talent</Button>
    </form>
  );
};

export default TalentCreator;
