import { useState, useEffect } from 'react';
import { Container, Row, Col, Tab, Nav, ListGroup, Image } from 'react-bootstrap';
import { getArmors } from '../services/armorService';
import { getWeapons } from '../services/weaponService';
import { getSkills } from '../services/skillService';
import { getTalents } from '../services/talentService';
import { getTraits } from '../services/traitService';
import '../styles/pages/BrowseItemsPage.css';
import browse_items from '../assets/browse_items.webp';

const BrowseItemsPage = () => {
  const [key, setKey] = useState('');
  const [armors, setArmors] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [skills, setSkills] = useState([]);
  const [talents, setTalents] = useState([]);
  const [traits, setTraits] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const armorResponse = await getArmors();
        const weaponResponse = await getWeapons();
        const skillResponse = await getSkills();
        const talentResponse = await getTalents();
        const traitResponse = await getTraits();

        setArmors(armorResponse.data);
        setWeapons(weaponResponse.data);
        setSkills(skillResponse.data);
        setTalents(talentResponse.data);
        setTraits(traitResponse.data);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };

    fetchData();
  }, []);

  return (
    <Container className="my-5 browse-items">
      <Row className="text-center mb-4">
        <Col className='items-header'>
          <h1 className="display-4" onClick={() => setKey('')}>Armory</h1>
          <p className="lead">Browse all available armors, weapons, skills, talents, and traits</p>
        </Col>
      </Row>
      <Row>
        <Col sm={3}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="armor" onClick={() => setKey('armor')}>Armors</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="weapon" onClick={() => setKey('weapon')}>Weapons</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="skill" onClick={() => setKey('skill')}>Skills</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="talent" onClick={() => setKey('talent')}>Talents</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="trait" onClick={() => setKey('trait')}>Traits</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>
        <Col sm={9}>
          <Tab.Content>
            <Tab.Pane eventKey="" active={key === ''}>
              <Image
                src={browse_items}
                alt="dark fantasy armory filled with weapons and books"
                fluid
              />
            </Tab.Pane>
            <Tab.Pane eventKey="armor" active={key === 'armor'}>
              <ListGroup>
                {armors.map((armor, index) => (
                  <ListGroup.Item key={index}>
                    <h5>{armor.name}</h5>
                    <p>Locations: {armor.location.join(', ')}</p>
                    <p>Protection Factor: {armor.protectionFactor}</p>
                    <p>Traits: {armor.traits.map(trait => trait.name).join(', ')}</p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Tab.Pane>
            <Tab.Pane eventKey="weapon" active={key === 'weapon'}>
              <ListGroup>
                {weapons.map((weapon, index) => (
                  <ListGroup.Item key={index}>
                    <h5>{weapon.name}</h5>
                    <p>Damage Factor: {weapon.damageFactor}</p>
                    <p>Traits: {weapon.traits.map(trait => trait.name).join(', ')}</p>
                    <p>Type: {weapon.type}</p>
                    <p>Handedness: {weapon.handedness}</p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Tab.Pane>
            <Tab.Pane eventKey="skill" active={key === 'skill'}>
              <ListGroup>
                {skills.map((skill, index) => (
                  <ListGroup.Item key={index}>
                    <h5>{skill.name}</h5>
                    <p>Base Stat: {skill.baseStat}</p>
                    <p>Description: {skill.description}</p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Tab.Pane>
            <Tab.Pane eventKey="talent" active={key === 'talent'}>
              <ListGroup>
                {talents.map((talent, index) => (
                  <ListGroup.Item key={index}>
                    <h5>{talent.name}</h5>
                    <p>Description: {talent.description}</p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Tab.Pane>
            <Tab.Pane eventKey="trait" active={key === 'trait'}>
              <ListGroup>
                {traits.map((trait, index) => (
                  <ListGroup.Item key={index}>
                    <h5>{trait.name}</h5>
                    <p>Description: {trait.description}</p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Container>
  );
};

export default BrowseItemsPage;
