import { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { createCharacter } from '../../services/characterService';
import { getWeapons } from '../../services/weaponService';
import { getSkills } from '../../services/skillService';
import { getTalents } from '../../services/talentService';
import { getArmors } from '../../services/armorService';

const CharacterCreator = () => {
  const [armors, setArmors] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [skills, setSkills] = useState([]);
  const [talents, setTalents] = useState([]);
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
  const [armorSelection, setArmorSelection] = useState({
    selectedArmorIds: [],
    selectedArmors: [],
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [armorsData, weaponsData, skillsData, talentsData] = await Promise.all([
          getArmors(), getWeapons(), getSkills(), getTalents()
        ]);
        setArmors(armorsData.data);
        setWeapons(weaponsData.data);
        setSkills(skillsData.data);
        setTalents(talentsData.data);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCharacter((prev) => ({ ...prev, [name]: value }));
  };

  const handleDropdownChange = (e, name) => {
    setCharacter((prev) => ({ ...prev, [name]: e.value }));
  };

  const handleStatChange = (e, statType) => {
    const { name, value } = e.target;
    setCharacter((prev) => ({
      ...prev,
      [statType]: { ...prev[statType], [name]: parseInt(value, 10) }
    }));
  };

  const handleArmorChange = (e) => {
    const selectedIds = e.value.filter((armor) => armor !== '');
    const selectedArmors = armors.filter((armor) => selectedIds.includes(armor._id));
    setArmorSelection({
      selectedArmorIds: selectedIds,
      selectedArmors: selectedArmors,
    });
  
    const newArmor = selectedArmors.reduce((acc, armor) => {
      armor.locations.forEach((location) => {
        acc[location] = armor._id;
      });
      return acc;
    }, { head: '', body: '', leftArm: '', rightArm: '', leftLeg: '', rightLeg: '' });
  
    setCharacter((prev) => ({ ...prev, armor: newArmor }));
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

  const getArmorNameById = (id) => {
    const armor = armors.find(a => a._id === id);
    return armor ? armor.name : 'No armor';
  };

  const coveredLocations = armorSelection.selectedArmors.flatMap(armor => armor.locations);
  const availableArmors = armors.filter((armor) => 
    armor.locations.every((location) => !coveredLocations.includes(location))
  );
  

  const raceOptions = useMemo(() => [
    { label: 'Human', value: 'human' },
    { label: 'Elf', value: 'elf' },
    { label: 'Dwarf', value: 'dwarf' },
    { label: 'Halfling', value: 'halfling' },
    { label: 'Other', value: 'other' },
  ], []);

  const armorOptions = useMemo(() => {
    const displayedArmors = [...armorSelection.selectedArmors, ...availableArmors];
    return displayedArmors.map((armor) => ({
      label: armor.name,
      value: armor._id,
    }));
 }, [armorSelection.selectedArmors, availableArmors]);
  
  const weaponOptions = useMemo(() => weapons.map((weapon) => ({
    label: weapon.name,
    value: weapon._id,
  })), [weapons]);
  
  const skillOptions = useMemo(() => skills.map((skill) => ({
    label: skill.name,
    value: skill._id,
  })), [skills]);
  
  const talentOptions = useMemo(() => talents.map((talent) => ({
    label: talent.name,
    value: talent._id,
  })), [talents]);

  const StatFormGroup = ({ statsType }) => (
    <>
      {Object.entries(character[statsType]).map(([stat, value]) => (
        <Col md={3} key={stat} className="mb-3">
          <Form.Group>
            <Form.Label>{stat}</Form.Label>
            <Form.Control
              type="number"
              name={stat}
              value={value}
              onChange={(e) => handleStatChange(e, statsType)}
              required
            />
          </Form.Group>
        </Col>
      ))}
    </>
  );

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
                  options={raceOptions}
                  onChange={(e) => handleDropdownChange(e, 'race')}
                  placeholder="Select character race"
                  className="w-100 text-start"
                  required
                />
              </Form.Group>
            </Row>
            <h3>Primary Stats</h3>
            <Row>
              <StatFormGroup statsType="primaryStats" />
            </Row>
            <h3>Secondary Stats</h3>
            <Row>
              <StatFormGroup statsType="secondaryStats" />
            </Row>
            <h3>Armor</h3>
            <Row>
              <Col>
                <MultiSelect
                  aria-label="Armor select"
                  value={armorSelection.selectedArmorIds}
                  options={armorOptions}
                  onChange={handleArmorChange}
                  placeholder="Select armors"
                  display="chip"
                  showClear
                  filter
                  className="w-100 text-start"
                  showSelectAll={false}
                />
              </Col>
            </Row>
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
                      value={getArmorNameById(character.armor[location])}
                      readOnly
                    />
                  </Col>
                </Form.Group>
              ))}
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Weapons</Form.Label>
              <MultiSelect
                aria-label="Weapons select"
                value={character.weapons}
                options={weaponOptions}
                onChange={(e) => handleDropdownChange(e, 'weapons')}
                placeholder="Select weapons"
                display="chip"
                showClear
                filter
                className="w-100 text-start"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Skills</Form.Label>
              <MultiSelect
                aria-label="Skills select"
                value={character.skills}
                options={skillOptions}
                onChange={(e) => handleDropdownChange(e, 'skills')}
                placeholder="Select skills"
                display="chip"
                showClear
                filter
                className="w-100 text-start"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Talents</Form.Label>
              <MultiSelect
                aria-label="Talents select"
                value={character.talents}
                options={talentOptions}
                onChange={(e) => handleDropdownChange(e, 'talents')}
                placeholder="Select talents"
                display="chip"
                showClear
                filter
                className="w-100 text-start"
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
