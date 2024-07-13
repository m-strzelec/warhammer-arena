import { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { createArmor } from '../../services/armorService';
import { locationFullNames } from '../utils/constants';
import { useToast } from '../../contexts/ToastContext';

const ArmorCreator = ({ traitOptions }) => {
  const { showToast } = useToast();
  const [armor, setArmor] = useState({
    name: '', 
    locations: [],
    protectionFactor: '',
    traits: []
  });

  const armorLocations = Object.entries(locationFullNames).map(([key, value]) => ({
    label: value,
    value: key,
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArmor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (armor.locations.length === 0) {
      showToast('info', 'Info', 'Please select at least one armor location');
    } else {
      try {
        await createArmor(armor);
        showToast('success', 'Success', 'Armor created successfully');
        setArmor({ name: '', locations: [], protectionFactor: '', traits: [] });
      } catch (error) {
        showToast('danger', 'Error', error.response.data.message);
        console.error(error.response.data?.error || error.response.data.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Armor</h3>
      <Row className="justify-content-center mt-4">
        <Col md={10}>
          <Row className="mb-3">
            <Col>
              <div className="p-field d-flex align-items-center">
                <label htmlFor="name" className="me-2 mb-0 create-label">Name:</label>
                <InputText 
                  id="name"
                  name="name" 
                  placeholder="Enter armor name" 
                  value={armor.name} 
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
                <label htmlFor="locations" className="me-2 mb-0 create-label">Locations:</label>
                <MultiSelect
                  id="locations"
                  name="locations"
                  aria-label="Armor locations select"
                  value={armor.locations}
                  options={armorLocations}
                  onChange={handleChange}
                  placeholder="Select armor locations"
                  display="chip"
                  showClear
                  className="w-100 text-start"
                  required
                />
              </div>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <div className="p-field d-flex align-items-center">
                <label htmlFor="protectionFactor" className="me-2 mb-0 create-label">Protection Factor:</label>
                <InputText 
                  id="protectionFactor" 
                  name="protectionFactor" 
                  placeholder="Enter protection factor" 
                  value={armor.protectionFactor} 
                  onChange={handleChange}
                  keyfilter="int"
                  className="w-100"
                  required 
                />
              </div>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <div className="p-field d-flex align-items-center">
                <label htmlFor="traits" className="me-2 mb-0 create-label">Traits:</label>
                <MultiSelect
                  id="traits"
                  name="traits"
                  aria-label="Armor traits select"
                  value={armor.traits}
                  options={traitOptions}
                  onChange={handleChange}
                  placeholder="Select traits"
                  display="chip"
                  showClear
                  filter
                  className="w-100 text-start"
                  required
                />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Button variant="primary" type="submit">Create Armor</Button>
    </form>
  );
};

export default ArmorCreator;
