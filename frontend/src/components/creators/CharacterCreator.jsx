import { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Dropdown } from 'primereact/dropdown';
import { createCharacter } from '../../services/characterService';

const CharacterCreator = () => {
  const [character, setCharacter] = useState({
    name: '',
    race: '',
    primaryStats: {
      WS: 0,
      BS: 0,
      S: 0,
      T: 0,
      Ag: 0,
      Int: 0,
      WP: 0,
      Fel: 0,
    },
    secondaryStats: {
      A: 0,
      W: 0,
      SB: 0,
      TB: 0,
      M: 0,
      Mag: 0,
      IP: 0,
      FP: 0,
    },
    armor: {
      head: '',
      body: '',
      leftArm: '',
      rightArm: '',
      leftLeg: '',
      rightLeg: ''
    },
    weapons: [],
    skills: [],
    talents: [],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const races = [
    { label: 'Human', value: 'human' },
    { label: 'Elf', value: 'elf' },
    { label: 'Dwarf', value: 'dwarf' },
    { label: 'Halfling', value: 'halfling' },
    { label: 'Other', value: 'other' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCharacter({ ...character, [name]: value });
  };

  const handleDropdownChange = (e, name) => {
    setCharacter({ ...character, [name]: e.value });
  };

  const handlePrimaryStatChange = (e) => {
    const { name, value } = e.target;
    setCharacter({
      ...character,
      primaryStats: { ...character.primaryStats, [name]: parseInt(value) }
    });
  };

  const handleSecondaryStatChange = (e) => {
    const { name, value } = e.target;
    setCharacter({
      ...character,
      secondaryStats: { ...character.secondaryStats, [name]: parseInt(value) }
    });
  };

  const handleArmorLocationChange = (e) => {
    const { name, value } = e.target;
    setCharacter({
      ...character,
      armor: { ...character.armor, [name]: value }
    });
  };

  const handleArrayChange = (e, type) => {
    const { name, value } = e.target;
    setCharacter({
      ...character,
      [type]: [...character[type], { [name]: value }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCharacter(character);
      setSuccess('Character created successfully');
      setError('');
    } catch (error) {
      console.error(error.response.data.message);
      setError(error.response.data.message);
      setSuccess('');
    }
  };

  return (
    <Container>
      <Row className="text-center mb-2">
        <Col>
          <p className="lead">Fill in the details to create your character.</p>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8}>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="formGridName" className="d-flex align-items-center">
                <Form.Label className="me-2 mb-0">Name:</Form.Label>
                <Form.Control 
                  type="text" 
                  name="name" 
                  placeholder="Name" 
                  onChange={handleChange} 
                  required 
                />
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="formGridRace" className="d-flex align-items-center">
                <Form.Label className="me-2 mb-0">Race:</Form.Label>
                <Dropdown
                  aria-label="Character race select" 
                  value={character.race}
                  options={races}
                  onChange={(e) => handleDropdownChange(e, 'race')}
                  placeholder="Select character race"
                  className="w-100 text-start"
                  required
                />
              </Form.Group>
            </Row>
            <h3>Primary Stats</h3>
            <Row>
              {Object.keys(character.primaryStats).map((stat) => (
                <Col md={3} key={stat} className="mb-3">
                  <Form.Group>
                    <Form.Label>{stat}</Form.Label>
                    <Form.Control
                      type="number"
                      name={stat}
                      placeholder={stat}
                      onChange={handlePrimaryStatChange}
                      required
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>
            <h3>Secondary Stats</h3>
            <Row>
              {Object.keys(character.secondaryStats).map((stat) => (
                <Col md={3} key={stat} className="mb-3">
                  <Form.Group id={stat}>
                    <Form.Label>{stat}</Form.Label>
                    <Form.Control
                      type="number"
                      name={stat}
                      placeholder={stat}
                      onChange={handleSecondaryStatChange}
                      required
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>
            <h3>Armor</h3>
            <Row>
              {Object.keys(character.armor).map((location) => (
                <Form.Group as={Col} md="12" key={location} controlId={location} className="d-flex align-items-center my-3">
                  <Col md={2}>
                    <Form.Label className="me-2 mb-0">{location}:</Form.Label>
                  </Col>
                  <Col md={10}>
                  <Form.Control
                    type="text"
                    name={location}
                    placeholder={location}
                    onChange={handleArmorLocationChange}
                    required
                  /></Col>
                </Form.Group>
              ))}
            </Row>
            <h3>Weapons</h3>
            <Form.Group className="mb-3">
              <Form.Control 
                type="text" 
                name="weapons" 
                placeholder="Weapon Name" 
                onChange={(e) => handleArrayChange(e, 'weapons')} 
              />
            </Form.Group>
            <h3>Skills</h3>
            <Form.Group className="mb-3">
              <Form.Control 
                type="text" 
                name="skills" 
                placeholder="Skill Name" 
                onChange={(e) => handleArrayChange(e, 'skills')} 
              />
            </Form.Group>
            <h3>Talents</h3>
            <Form.Group className="mb-3">
              <Form.Control 
                type="text" 
                name="talents" 
                placeholder="Talent Name" 
                onChange={(e) => handleArrayChange(e, 'talents')} 
              />
            </Form.Group>
            <Button variant="primary" type="submit">Create Character</Button>
          </Form>
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          {success && <Alert variant="success" className="mt-3">{success}</Alert>}
        </Col>
      </Row>
    </Container>
  );
};

export default CharacterCreator;
