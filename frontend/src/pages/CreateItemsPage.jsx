import { useEffect, useState } from 'react';
import { Container, Row, Col, Tab, Nav, Image } from 'react-bootstrap';
import ArmorCreator from '../components/creators/ArmorCreator';
import WeaponCreator from '../components/creators/WeaponCreator';
import SkillCreator from '../components/creators/SkillCreator';
import TalentCreator from '../components/creators/TalentCreator';
import TraitCreator from '../components/creators/TraitCreator';
import { getTraits } from '../services/traitService';
import '../styles/pages/CreateItemsPage.css';
import create_items from '../assets/create_items.webp';

const CreateItemsPage = () => {
  const [key, setKey] = useState('');
  const [traits, setTraits] = useState([]);

  useEffect(() => {
    const fetchTraits = async () => {
      try {
        const response = await getTraits();
        setTraits(response.data);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };

    fetchTraits();
  }, []);

  const traitOptions = traits.map((trait) => ({
    label: trait.name,
    value: trait._id,
  }));

  return (
    <>
      <Container className="my-5 create-items">
        <Row className="text-center mb-4">
          <Col className='items-header'>
            <h1 className="display-4" onClick={() => setKey('')}>Forge</h1>
            <p className="lead">Design armors, weapons, skills, talents, and traits for your characters.</p>
          </Col>
        </Row>
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="armor" onClick={() => setKey('armor')}>Create Armor</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="weapon" onClick={() => setKey('weapon')}>Create Weapon</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="skill" onClick={() => setKey('skill')}>Create Skill</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="talent" onClick={() => setKey('talent')}>Create Talent</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="trait" onClick={() => setKey('trait')}>Create Trait</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="" active={key === ''}>
              <Image
                src={create_items}
                alt="ancient dark fantasy forge"
                fluid
              />
              </Tab.Pane>
              <Tab.Pane eventKey="armor" active={key === 'armor'}>
                <ArmorCreator traitOptions={traitOptions} />
              </Tab.Pane>
              <Tab.Pane eventKey="weapon" active={key === 'weapon'}>
                <WeaponCreator traitOptions={traitOptions} />
              </Tab.Pane>
              <Tab.Pane eventKey="skill" active={key === 'skill'}>
                <SkillCreator />
              </Tab.Pane>
              <Tab.Pane eventKey="talent" active={key === 'talent'}>
                <TalentCreator />
              </Tab.Pane>
              <Tab.Pane eventKey="trait" active={key === 'trait'}>
                <TraitCreator />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CreateItemsPage;
