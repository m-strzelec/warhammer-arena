import { useState, useEffect } from 'react';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog';
import CharacterBrowser from '../components/browsers/CharacterBrowser';
import CharacterForm from '../components/forms/CharacterForm';
import LoadingPage from '../components/common/LoadingPage';
import { useToast } from '../contexts/ToastContext';
import { getArmors } from '../services/armorService';
import { getWeapons } from '../services/weaponService';
import { getSkills } from '../services/skillService';
import { getTalents } from '../services/talentService';
import { createCharacter } from '../services/characterService';
import '../styles/pages/CharacterPage.css';

const CharacterPage = () => {
  const { showToast } = useToast();
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [armors, setArmors] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [skills, setSkills] = useState([]);
  const [talents, setTalents] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [refreshCharactersTrigger, setRefreshCharactersTrigger] = useState(0);

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

  const handleOpenCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);

  const handleCreateCharacter = async (characterData) => {
    try {
      await createCharacter(characterData);
      showToast('success', 'Success', 'Character created successfully!');
      handleCloseCreateModal();
      setRefreshCharactersTrigger(prev => prev + 1);
    } catch (error) {
      showToast('error', 'Error', error.response.data.message);
      console.error(error.response.data?.error || error.response.data.message);
      throw error;
    }
  };

  const handleCharacterDataChange = () => {
    setRefreshCharactersTrigger(prev => prev + 1);
  };

  if (optionsLoading) {
    return <LoadingPage message="Loading character options..." />;
  }

  return (
    <>
      <ConfirmDialog />
      <Container className="my-5 browse-characters">
        <Row className="text-center mb-4 align-items-center">
          <Col>
            <h1 className="display-4">Characters</h1>
            <p className="lead">Browse, create, edit, and delete characters.</p>
          </Col>
        </Row>
        <Button
          icon="add-icon"
          text
          rounded
          className="action-button"
          onClick={handleOpenCreateModal}
        />
        <Row>
          <Col>
            <CharacterBrowser
              armors={armors}
              weapons={weapons}
              skills={skills}
              talents={talents}
              optionsLoading={optionsLoading}
              refreshCharactersTrigger={refreshCharactersTrigger}
              onCharacterDataChange={handleCharacterDataChange}
            />
          </Col>
        </Row>
      </Container>

      <Modal show={showCreateModal} onHide={handleCloseCreateModal} enforceFocus={false} backdrop="static" size="xl" className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Create New Character</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CharacterForm
            onSave={handleCreateCharacter}
            onCancel={handleCloseCreateModal}
            armors={armors}
            weapons={weapons}
            skills={skills}
            talents={talents}
            loadingOptions={optionsLoading}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CharacterPage;