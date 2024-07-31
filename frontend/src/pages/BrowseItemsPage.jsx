import { useState, useEffect } from 'react';
import { Container, Row, Col, Tab, Nav, Image } from 'react-bootstrap';
import { getArmors } from '../services/armorService';
import { getWeapons } from '../services/weaponService';
import { getSkills } from '../services/skillService';
import { getTalents } from '../services/talentService';
import { getTraits } from '../services/traitService';
import '../styles/pages/BrowseItemsPage.css';
import browse_items from '../assets/browse_items.webp';
import { useToast } from '../contexts/ToastContext';
import ArmorBrowser from '../components/browsers/ArmorBrowser';
import SkillBrowser from '../components/browsers/SkillBrowser';
import TalentBrowser from '../components/browsers/TalentBrowser';
import TraitBrowser from '../components/browsers/TraitBrowser';
import WeaponBrowser from '../components/browsers/WeaponBrowser';

const BrowseItemsPage = () => {
  const [key, setKey] = useState('');
  const [armors, setArmors] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [skills, setSkills] = useState([]);
  const [talents, setTalents] = useState([]);
  const [traits, setTraits] = useState([]);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [armorsResponse, weaponsResponse, skillsResponse, talentsResponse, traitsResponse] = await Promise.all([
          getArmors(), getWeapons(), getSkills(), getTalents(), getTraits()
        ]);
        setArmors(armorsResponse.data);
        setWeapons(weaponsResponse.data);
        setSkills(skillsResponse.data);
        setTalents(talentsResponse.data);
        setTraits(traitsResponse.data);
      } catch (error) {
        showToast('error', 'Error', error.response.data.message);
        console.error(error.response.data?.error || error.response.data.message);
      }
    };
    fetchData();
  }, [showToast]);

  return (
    <>
      <Container className="my-5 browse-items">
        <Row className="text-center mb-4">
          <Col className='items-header'>
            <h1 className="display-4" onClick={() => setKey('')}>Armory</h1>
            <p className="lead">Browse all available armors, weapons, skills, talents, and traits.</p>
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
                <ArmorBrowser armorsData={armors} traitOptions={traits} />
              </Tab.Pane>
              <Tab.Pane eventKey="weapon" active={key === 'weapon'}>
                <WeaponBrowser weaponsData={weapons} traitOptions={traits} />
              </Tab.Pane>
              <Tab.Pane eventKey="skill" active={key === 'skill'}>
                <SkillBrowser skillsData={skills} />
              </Tab.Pane>
              <Tab.Pane eventKey="talent" active={key === 'talent'}>
                <TalentBrowser talentsData={talents} />
              </Tab.Pane>
              <Tab.Pane eventKey="trait" active={key === 'trait'}>
                <TraitBrowser traitsData={traits} />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default BrowseItemsPage;
