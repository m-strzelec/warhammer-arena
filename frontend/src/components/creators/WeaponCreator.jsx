import { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { createWeapon } from '../../services/weaponService';
import { weaponHandedness, weaponTypes } from '../utils/constants';
import { useToast } from '../../contexts/ToastContext';

const WeaponCreator = ({ traitOptions }) => {
  const { showToast } = useToast();
  const [weapon, setWeapon] = useState({ 
    name: '', 
    damageFactor: '', 
    traits: [],
    type: '',
    handedness: '' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWeapon((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createWeapon(weapon);
      showToast('success', 'Success', 'Weapon created successfully');
      setWeapon({ name: '', damageFactor: '', traits: [], type: '', handedness: '' });
    } catch (error) {
      showToast('danger', 'Error', error.response.data.message);
      console.error(error.response.data?.error || error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Weapon</h3>
      <Row className="justify-content-center mt-4">
        <Col md={10}>
          <Row className="mb-3">
            <Col>
              <div className="p-field d-flex align-items-center">
                <label htmlFor="name" className="me-2 mb-0 create-label">Name:</label>
                <InputText 
                  id="name" 
                  name="name" 
                  placeholder="Enter weapon name" 
                  value={weapon.name} 
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
                <label htmlFor="damageFactor" className="me-2 mb-0 create-label">Damage Factor:</label>
                <InputText
                  id="damageFactor"
                  name="damageFactor" 
                  placeholder="Enter damage factor" 
                  value={weapon.damageFactor} 
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
                  aria-label="Weapon traits select"
                  value={weapon.traits}
                  options={traitOptions}
                  onChange={handleChange}
                  placeholder="Select traits"
                  display="chip"
                  showClear
                  filter
                  className="w-100 text-start"
                />
              </div>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <div className="p-field d-flex align-items-center">
                <label htmlFor="type" className="me-2 mb-0 create-label">Type:</label>
                <Dropdown
                  id="type"
                  name="type"
                  aria-label="Weapon type select" 
                  value={weapon.type}
                  options={weaponTypes}
                  onChange={handleChange}
                  placeholder="Select weapon type"
                  className="w-100 text-start"
                  required
                />
              </div>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col>
              <div className="p-field d-flex align-items-center">
                <label htmlFor="handedness" className="me-2 mb-0 create-label">Handedness:</label>
                <Dropdown
                  id="handedness"
                  name="handedness"
                  aria-label="Weapon handedness select" 
                  value={weapon.handedness}
                  options={weaponHandedness}
                  onChange={handleChange}
                  placeholder="Select weapon handedness"
                  className="w-100 text-start"
                  required
                />
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Button variant="primary" type="submit">Create Weapon</Button>
    </form>
  );
};

export default WeaponCreator;
