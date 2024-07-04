import { useState } from 'react';
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap';
import ArmorCreator from '../components/creators/ArmorCreator';
import WeaponCreator from '../components/creators/WeaponCreator';
import SkillCreator from '../components/creators/SkillCreator';
import TalentCreator from '../components/creators/TalentCreator';
import TraitCreator from '../components/creators/TraitCreator';
import '../styles/CreateItemsPage.css';
import create_items from '../assets/create_items.webp';

const CreateItemsPage = () => {
  const [key, setKey] = useState('');

  return (
    <>
      <Container className="my-5 create-items">
        <Row className="text-center mb-4">
          <Col className='items-header'>
            <h1 className="display-4" onClick={() => setKey('')}>Create Items</h1>
            <p className="lead">Design armors, weapons, skills, talents and traits for your characters</p>
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
                <Nav.Link eventKey="ability" onClick={() => setKey('ability')}>Create Ability</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="trait" onClick={() => setKey('trait')}>Create Trait</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="" active={key === ''}>
              <img 
                src={create_items}
                width="896"
                height="384"
                className="d-inline-block"
                alt="ancient dark fantasy forge"
              />
              </Tab.Pane>
              <Tab.Pane eventKey="armor" active={key === 'armor'}>
                <ArmorCreator />
              </Tab.Pane>
              <Tab.Pane eventKey="weapon" active={key === 'weapon'}>
                <WeaponCreator />
              </Tab.Pane>
              <Tab.Pane eventKey="skill" active={key === 'skill'}>
                <SkillCreator />
              </Tab.Pane>
              <Tab.Pane eventKey="ability" active={key === 'ability'}>
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
