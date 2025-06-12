import { Container, Row, Col } from 'react-bootstrap';
import CharacterForm from '../components/forms/CharacterForm';
import { getArmors } from '../services/armorService';
import { getWeapons } from '../services/weaponService';
import { getSkills } from '../services/skillService';
import { getTalents } from '../services/talentService';
import { createCharacter } from '../services/characterService';
import { useToast } from '../contexts/ToastContext';
import { useEffect, useState } from 'react';
import LoadingPage from '../components/common/LoadingPage';
import '../styles/pages/CreateCharacterPage.css';

const CreateCharacterPage = () => {
  const { showToast } = useToast();
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [armors, setArmors] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [skills, setSkills] = useState([]);
  const [talents, setTalents] = useState([]);

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
        setOptionsLoading(false);
      }
    };
    fetchOptions();
  }, [showToast]);

  const handleCreateCharacter = async (characterData) => {
    try {
      await createCharacter(characterData);
      showToast('success', 'Success', 'Character created successfully!');
      // You might want to redirect the user or clear the form here
    } catch (error) {
      showToast('error', 'Error', error.response.data.message);
      console.error(error.response.data?.error || error.response.data.message);
      throw error;
    }
  };

  if (optionsLoading) {
    return <LoadingPage message="Loading character creation options..." />;
  }

  return (
    <>
      <Container className="my-5">
        <Row className="text-center">
          <Col>
            <h1 className="display-4">Create Character</h1>
            <p className="lead">Design a character according to your needs.</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <CharacterForm
              onSave={handleCreateCharacter}
              onCancel={() => { /* Handle cancel, e.g., redirect or clear form */ }}
              armors={armors}
              weapons={weapons}
              skills={skills}
              talents={talents}
              loadingOptions={optionsLoading}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CreateCharacterPage;
