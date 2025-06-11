import { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { SelectButton } from 'primereact/selectbutton';
import { createCharacter } from '../../services/characterService';
import { getWeapons } from '../../services/weaponService';
import { getSkills } from '../../services/skillService';
import { getTalents } from '../../services/talentService';
import { getArmors } from '../../services/armorService';
import { raceOptions, primaryStatFullNames, secondaryStatFullNames, locationFullNames } from '../utils/constants';
import { useToast } from '../../contexts/ToastContext';
import LoadingPage from '../common/LoadingPage';

const CharacterCreator = () => {
  const [armors, setArmors] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [skills, setSkills] = useState([]);
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [character, setCharacter] = useState({
    name: '',
    race: '',
    primaryStats: {
      WS: 30,
      BS: 30,
      S: 30,
      T: 30,
      Ag: 30,
      Int: 30,
      WP: 30,
      Fel: 30,
    },
    secondaryStats: {
      A: 1,
      W: 10,
      SB: 3,
      TB: 3,
      M: 4,
      Mag: 0,
      IP: 0,
      FP: 0,
    },
    armor: {
      head: null,
      body: null,
      leftArm: null,
      rightArm: null,
      leftLeg: null,
      rightLeg: null
    },
    weapons: [],
    skills: [],
    talents: [],
  });
  const [armorSelection, setArmorSelection] = useState({
    selectedArmorIds: [],
    selectedArmors: [],
  });
  const { showToast } = useToast();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [armorsRes, weaponsRes, skillsRes, talentsRes] = await Promise.all([
          getArmors(), getWeapons(), getSkills(), getTalents()
        ]);
        setArmors(armorsRes.data);
        setWeapons(weaponsRes.data);
        setSkills(skillsRes.data);
        setTalents(talentsRes.data);
      } catch (error) {
        showToast('error', 'Error', error.response.data.message);
        console.error(error.response.data?.error || error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, [showToast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCharacter((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatChange = (e, statType) => {
    const { name, value } = e.target;
    setCharacter((prev) => ({
      ...prev,
      [statType]: { ...prev[statType], [name]: value }
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
    }, { head: null, body: null, leftArm: null, rightArm: null, leftLeg: null, rightLeg: null });

    setCharacter((prev) => ({ ...prev, armor: newArmor }));
  };

  const handleSkillChange = (e) => {
    const selectedSkills = e.value;
    const updatedSkills = selectedSkills.map(skillId => {
      const existingSkill = character.skills.find(s => s.skill === skillId);
      return existingSkill ? existingSkill : { skill: skillId, factor: 0 };
    });
    setCharacter((prev) => ({ ...prev, skills: updatedSkills }));
  };

  const handleFactorChange = (e, skillId) => {
    const { value } = e.target;
    const numericValue = parseInt(value, 10) || 0;
    setCharacter((prev) => {
      const updatedSkills = prev.skills.map(skill => {
        if (skill.skill === skillId) {
          return { ...skill, factor: numericValue };
        }
        return skill;
      });
      return { ...prev, skills: updatedSkills };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCharacter(character);
      showToast('success', 'Success', 'Character created successfully');
    } catch (error) {
      showToast('error', 'Error', error.response.data.message);
      console.error(error.response.data?.error || error.response.data.message);
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

  if (loading) return <LoadingPage message="Loading character options..." />;

  return (
    <Container>
      <Row>
        <Col>
          <p className="lead">Fill in the details to create your character.</p>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={8}>
          <form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6} className="mb-3">
                <div className="p-field">
                  <label htmlFor="name" className="me-2 mb-0">Name</label>
                  <InputText
                    id="name"
                    name="name"
                    placeholder="Name"
                    value={character.name}
                    onChange={handleChange}
                    className="w-100"
                    required
                  />
                </div>
              </Col>
              <Col md={6} className="mb-3">
                <div className="p-field">
                  <label htmlFor="race" className="me-2 mb-0">Race</label>
                  <Dropdown
                    id="race"
                    name="race"
                    aria-label="Character race select"
                    value={character.race}
                    options={raceOptions}
                    onChange={handleChange}
                    placeholder="Select character race"
                    className="w-100 text-start"
                    required
                  />
                </div>
              </Col>
            </Row>
            <h3>Primary Stats</h3>
            <Row>
              {Object.entries(character.primaryStats).map(([stat, value]) => (
                <Col xs={6} sm={4} lg={3} key={stat} className="mb-3">
                  <div className="p-field">
                    <label htmlFor={stat}>{primaryStatFullNames[stat]}</label>
                    <InputText
                      id={stat}
                      name={stat}
                      value={character.primaryStats[stat]}
                      onChange={(e) => handleStatChange(e, 'primaryStats')}
                      keyfilter="pint"
                      className="w-100"
                      required
                    />
                  </div>
                </Col>
              ))}
            </Row>
            <h3>Secondary Stats</h3>
            <Row>
              {Object.entries(character.secondaryStats).map(([stat, value]) => (
                <Col xs={6} sm={4} lg={3} key={stat} className="mb-3">
                  <div className="p-field">
                    <label htmlFor={stat}>{secondaryStatFullNames[stat]}</label>
                    <InputText
                      id={stat}
                      name={stat}
                      value={character.secondaryStats[stat]}
                      onChange={(e) => handleStatChange(e, 'secondaryStats')}
                      keyfilter="pint"
                      className="w-100"
                      required
                    />
                  </div>
                </Col>
              ))}
            </Row>
            <h3>Armor</h3>
            <Row>
              <Col>
                <MultiSelect
                  id="armor"
                  name="armor"
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
                <Col md={12} lg={6} key={location} className="my-3">
                  <div className="p-field d-flex align-items-center">
                    <label htmlFor={location} className="armor-label me-2 mb-0">{locationFullNames[location]}:</label>
                    <InputText
                      id={location}
                      name={location}
                      value={getArmorNameById(character.armor[location])}
                      variant="filled"
                      className="w-100"
                      readOnly
                    />
                  </div>
                </Col>
              ))}
            </Row>
            <h3>Weapons</h3>
            <div className="p-field mb-3">
              <MultiSelect
                id="weapons"
                name="weapons"
                aria-label="Weapons select"
                value={character.weapons}
                options={weaponOptions}
                onChange={handleChange}
                placeholder="Select weapons"
                display="chip"
                showClear
                filter
                className="w-100 text-start"
              />
            </div>
            <h3>Skills</h3>
            <div className="p-field mb-3">
              <MultiSelect
                id="skills"
                name="skills"
                aria-label="Skills select"
                value={character.skills.map(skill => skill.skill)}
                options={skillOptions}
                onChange={handleSkillChange}
                placeholder="Select skills"
                display="chip"
                showClear
                filter
                className="w-100 text-start"
              />
            </div>
            {character.skills.map((skill, index) => (
              <Row key={skill.skill}>
                <Col md={10} className="mb-3">
                  <div className="p-field d-flex align-items-center">
                    <label htmlFor={`factor-${skill.skill}`} className="me-2 mb-0 factor-label">
                      {skills.find(s => s._id === skill.skill)?.name} Factor
                    </label>
                    <SelectButton
                      id={`factor-${skill.skill}`}
                      name={`factor-${skill.skill}`}
                      value={skill.factor}
                      options={[{ label: '0', value: 0 }, { label: '10', value: 10 }, { label: '20', value: 20 }]}
                      onChange={(e) => handleFactorChange(e, skill.skill)}
                      className="w-100"
                    />
                  </div>
                </Col>
              </Row>
            ))}
            <h3>Talents</h3>
            <div className="p-field mb-3">
              <MultiSelect
                id="talents"
                name="talents"
                aria-label="Talents select"
                value={character.talents}
                options={talentOptions}
                onChange={handleChange}
                placeholder="Select talents"
                display="chip"
                showClear
                filter
                className="w-100 text-start"
              />
            </div>
            <Button variant="primary" type="submit">Create Character</Button>
          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default CharacterCreator;
