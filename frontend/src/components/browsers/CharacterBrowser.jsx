import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Modal } from 'react-bootstrap';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button'; // PrimeReact Button
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { getCharacters, getCharacterById, updateCharacter, deleteCharacter } from '../../services/characterService';
import { getArmors } from '../../services/armorService'; // Needed for CharacterForm
import { getWeapons } from '../../services/weaponService'; // Needed for CharacterForm
import { getSkills } from '../../services/skillService'; // Needed for CharacterForm
import { getTalents } from '../../services/talentService'; // Needed for CharacterForm
import '../../styles/pages/BrowseCharactersPage.css';
import { useToast } from '../../contexts/ToastContext';
import LoadingPage from '../common/LoadingPage';
import CharacterForm from '../forms/CharacterForm'; // Import the refactored CharacterForm

const CharacterBrowser = () => {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [characterLoading, setCharacterLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [armors, setArmors] = useState([]);
  const [weapons, setWeapons] = useState([]);
  const [skills, setSkills] = useState([]);
  const [talents, setTalents] = useState([]);

  const { showToast } = useToast();

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await getCharacters();
        setCharacters(response.data);
      } catch (error) {
        showToast('error', 'Error', error.response.data.message);
        console.error(error.response.data?.error || error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, [showToast]);

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

  const handleCharacterChange = async (e) => {
    const characterId = e.value;
    setSelectedCharacterId(characterId);
    setCharacterLoading(true);
    try {
      const response = await getCharacterById(characterId);
      setCharacterData(response.data);
    } catch (error) {
      showToast('error', 'Error', error.response.data.message);
      console.error(error.response.data?.error || error.response.data.message);
      setCharacterData(null);
    } finally {
      setCharacterLoading(false);
    }
  };

  const confirmDelete = (characterToDelete) => {
    confirmDialog({
      message: `Are you sure you want to delete "${characterToDelete.name}"? This action cannot be undone.`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => handleDeleteCharacter(characterToDelete._id),
      reject: () => {
        showToast('info', 'Cancelled', 'Character deletion cancelled.');
      }
    });
  };

  const handleDeleteCharacter = async (id) => {
    try {
      await deleteCharacter(id);
      showToast('success', 'Deleted', 'Character deleted successfully!');
      setCharacters(prev => prev.filter(char => char._id !== id));
      setSelectedCharacterId(null);
      setCharacterData(null);
    } catch (error) {
      showToast('error', 'Error', error.response.data.message);
      console.error(error.response.data?.error || error.response.data.message);
    }
  };

  const openEditModal = () => {
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const handleSaveEdit = async (updatedCharData) => {
    try {
      const response = await updateCharacter(selectedCharacterId, updatedCharData);
      showToast('success', 'Updated', 'Character updated successfully!');

      setCharacters(prev => prev.map(char =>
        char._id === selectedCharacterId ? response.data : char
      ));
      setCharacterData(response.data);
      closeEditModal();
    } catch (error) {
      showToast('error', 'Error', error.response.data.message);
      console.error(error.response.data?.error || error.response.data.message);
    }
  };

  const characterOptions = characters.map((char) => ({
    label: char.name,
    value: char._id,
  }));

  if (loading) return <LoadingPage message="Loading characters..." />;

  return (
    <Container className="my-5">
      <ConfirmDialog />
      <Row className="mb-4">
        <Col>
          <Dropdown
            value={selectedCharacterId}
            options={characterOptions}
            onChange={handleCharacterChange}
            placeholder="Select a character"
            filter
            className="w-50"
          />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          {characterLoading ? (
            <LoadingPage message="Loading character details..." />
          ) : characterData && (
            <Card className="character-card">
              <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-center">
                  <span>{characterData.name}</span>
                  <div className="d-flex gap-2">
                    <Button
                      icon="edit-icon"
                      text
                      rounded
                      onClick={openEditModal}
                    />
                    <Button
                      icon="delete-icon"
                      text
                      rounded
                      onClick={() => confirmDelete(characterData)}
                    />
                  </div>
                </Card.Title>
                <div>
                  <strong>Primary Stats:</strong>
                  <Row>
                    {Object.keys(characterData.primaryStats).map((stat) => (
                      <Col key={stat} sm={6} md={4}>
                        <div className="stat-item">
                          <span className="stat-name">{stat}: </span>
                          <span className="stat-value">{characterData.primaryStats[stat]}</span>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
                <div>
                  <strong>Secondary Stats:</strong>
                  <Row>
                    {Object.keys(characterData.secondaryStats).map((stat) => (
                      <Col key={stat} sm={6} md={4}>
                        <div className="stat-item">
                          <span className="stat-name">{stat}: </span>
                          <span className="stat-value">{characterData.secondaryStats[stat]}</span>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
                <div>
                  <strong>Armor:</strong>
                  <Row>
                    {Object.entries(characterData.armor).map(([bodyPart, armorPart]) => (
                      <Col key={bodyPart} sm={6} md={4}>
                        <div className="stat-item">
                          <span className="stat-name">{bodyPart}: </span>
                          {armorPart ? (
                            <span className="stat-value">{armorPart.name}</span>
                          ) : (
                            <span className="no-object">No Armor</span>
                          )}
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
                <div>
                  <strong>Weapons:</strong>
                  <Row>
                    {characterData.weapons.length > 0 ? (
                      characterData.weapons.map((weapon) => (
                        <Col key={weapon._id} sm={6} md={4}>
                          <div className="stat-item">
                            <span className="stat-name">{weapon.name}</span>
                          </div>
                        </Col>
                      ))
                    ) : (
                      <span className="no-object">No Weapons</span>
                    )}
                  </Row>
                </div>
                <div>
                  <strong>Skills:</strong>
                  <Row>
                    {characterData.skills.length > 0 ? (
                      characterData.skills.map((skill) => (
                        <Col key={skill._id} sm={6} md={4}>
                          <div className="stat-item">
                            <span className="stat-name">{skill.skill.name} </span>
                            <span>+{skill.factor}</span>
                          </div>
                        </Col>
                      ))
                    ) : (
                      <span className="no-object">No Skills</span>
                    )}
                  </Row>
                </div>
                <div>
                  <strong>Talents:</strong>
                  <Row>
                    {characterData.talents.length > 0 ? (
                      characterData.talents.map((talent) => (
                        <Col key={talent._id} sm={6} md={4}>
                          <div className="stat-item">
                            <span className="stat-name">{talent.name}</span>
                          </div>
                        </Col>
                      ))
                    ) : (
                      <span className="no-object">No Talents</span>
                    )}
                  </Row>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      <Modal show={showEditModal} onHide={closeEditModal} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Edit Character</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {characterData && !optionsLoading ? (
            <CharacterForm
              initialCharacterData={characterData}
              onSave={handleSaveEdit}
              onCancel={closeEditModal}
              armors={armors}
              weapons={weapons}
              skills={skills}
              talents={talents}
              loadingOptions={optionsLoading}
            />
          ) : (
            <LoadingPage message="Loading form data..." />
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CharacterBrowser;