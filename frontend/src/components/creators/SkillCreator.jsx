import { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { createSkill } from '../../services/skillService';
import { primaryStatFullNames } from '../utils/constants';

const SkillCreator = () => {
  const [skill, setSkill] = useState({ 
    name: '', 
    baseStat: '', 
    description: '' 
  });

  const baseStats = Object.entries(primaryStatFullNames).map(([key, value]) => ({
    label: value,
    value: key,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSkill((prev) => ({ ...prev, [name]: value }));
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
    <form onSubmit={handleSubmit}>
      <h3>Create Skill</h3>
      <Row className="justify-content-center mt-4">
        <Col md={10}>
          <Row className="mb-3">
            <Col>
              <div className="p-field d-flex align-items-center">
                <label htmlFor="name" className="me-2 mb-0 create-label">Name:</label>
                <InputText
                  id="name" 
                  name="name" 
                  placeholder="Enter skill name" 
                  value={skill.name} 
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
                <label htmlFor="baseStat" className="me-2 mb-0 create-label">Base Stat:</label>
                <Dropdown
                  id="baseStat" 
                  name="baseStat" 
                  aria-label="Base stat select" 
                  value={skill.baseStat}
                  options={baseStats}
                  onChange={handleChange}
                  placeholder="Select base stat"
                  className="w-100 text-start"
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
                  value={skill.description} 
                  onChange={handleChange}
                  className="w-100"
                  required 
                />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Button variant="primary" type="submit">Create Skill</Button>
    </form>
  );
};

export default SkillCreator;
