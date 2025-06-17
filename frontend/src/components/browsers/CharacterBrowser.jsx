import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Modal } from 'react-bootstrap';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { Tooltip } from 'primereact/tooltip';
import { getCharacters, getCharacterById, updateCharacter, deleteCharacter } from '../../services/characterService';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { primaryStatFullNames, secondaryStatFullNames, locationFullNames } from '../utils/constants';
import LoadingPage from '../common/LoadingPage';
import CharacterForm from '../forms/CharacterForm';

const CharacterBrowser = ({ armors, weapons, skills, talents, optionsLoading, refreshCharactersTrigger, onCharacterDataChange }) => {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [characterLoading, setCharacterLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const editButtonRef = useRef(null);
  const tooltipRef = useRef(null);

  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.type === 'ADMIN';

  useEffect(() => {
    const fetchCharacters = async () => {
      setLoading(true);
      try {
        const response = await getCharacters();
        setCharacters(response.data);
        if (selectedCharacterId && !response.data.some(char => char._id === selectedCharacterId)) {
          setSelectedCharacterId(null);
          setCharacterData(null);
        }
      } catch (error) {
        showToast('error', 'Error', error.response.data.message);
        console.error(error.response.data?.error || error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, [showToast, refreshCharactersTrigger]);

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
      message: `Are you sure you want to delete "${characterToDelete.name}"?`,
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      acceptClassName: 'p-button-danger',
      accept: () => handleDeleteCharacter(characterToDelete._id),
      reject: () => { }
    });
  };

  const handleDeleteCharacter = async (id) => {
    try {
      await deleteCharacter(id);
      showToast('success', 'Success', 'Character deleted successfully!');
      onCharacterDataChange();
      setSelectedCharacterId(null);
      setCharacterData(null);
    } catch (error) {
      showToast('error', 'Error', error.response.data.message);
      console.error(error.response.data?.error || error.response.data.message);
    }
  };

  const openEditModal = () => {
    if (tooltipRef.current) {
      tooltipRef.current.hide()
    }
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const handleSaveEdit = async (updatedCharData) => {
    try {
      await updateCharacter(selectedCharacterId, updatedCharData);
      showToast('success', 'Updated', 'Character updated successfully!');
      const response = await getCharacterById(selectedCharacterId);
      setCharacters(prev => prev.map(char =>
        char._id === selectedCharacterId ? response.data : char
      ));
      setCharacterData(response.data);
      closeEditModal();
      onCharacterDataChange();
    } catch (error) {
      showToast('error', 'Error', error.response.data.message);
      console.error(error.response.data?.error || error.response.data.message);
    }
  };

  const handleViewCharacterFights = (characterId) => {
    navigate(`/fight-history?characterId=${characterId}`);
  };

  const characterOptions = characters.map((char) => ({
    label: char.name,
    value: char._id,
  }));

  if (loading) return <LoadingPage message="Loading characters..." />;

  return (
    <Container className="my-5">
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
                  <h2>{characterData.name}</h2>
                  {(isAdmin || (user && characterData.userId === user.id)) && (
                    <div className="d-flex gap-2">
                      <Button
                        ref={editButtonRef}
                        icon="edit-icon"
                        text
                        rounded
                        onClick={openEditModal}
                        className="action-button"
                      />
                      <Tooltip 
                        ref={tooltipRef}
                        target={editButtonRef}
                        content="Edit this character"
                        position="bottom"
                      />
                      <Button
                        icon="delete-icon"
                        text
                        rounded
                        onClick={() => confirmDelete(characterData)}
                        tooltip="Delete this character"
                        tooltipOptions={{ position: 'bottom' }}
                        className="action-button"
                      />
                      <Button
                        icon="fight-icon"
                        text
                        rounded
                        onClick={() => handleViewCharacterFights(characterData._id)}
                        tooltip="View fights involving this character"
                        tooltipOptions={{ position: 'bottom' }}
                        className="action-button"
                      />
                    </div>
                  )}
                </Card.Title>
                <div className="text-start">
                  <span className="stat-name">Race: </span>
                  <span className="stat-value">{characterData.race}</span>
                </div>
                <h3 className="mt-2">Primary Stats</h3>
                <Row>
                  {Object.keys(characterData.primaryStats).map((stat) => (
                    <Col key={stat} xs={6} sm={4} lg={3}>
                      <div className="stat-item">
                        <span className="stat-name">{primaryStatFullNames[stat]}: </span>
                        <span className="stat-value">{characterData.primaryStats[stat]}</span>
                      </div>
                    </Col>
                  ))}
                </Row>
                <h3 className="mt-2">Secondary Stats</h3>
                <Row>
                  {Object.keys(characterData.secondaryStats).map((stat) => (
                    <Col key={stat} xs={6} sm={4} lg={3}>
                      <div className="stat-item">
                        <span className="stat-name">{secondaryStatFullNames[stat]}: </span>
                        <span className="stat-value">{characterData.secondaryStats[stat]}</span>
                      </div>
                    </Col>
                  ))}
                </Row>
                <h3 className="mt-2">Armor</h3>
                <Row>
                  {Object.entries(characterData.armor).map(([bodyPart, armorPart]) => (
                    <Col key={bodyPart} sm={6} md={4}>
                      <div className="stat-item">
                        <span className="stat-name">{locationFullNames[bodyPart]}: </span>
                        {armorPart ? (
                          <span className="stat-value">{armorPart.name}</span>
                        ) : (
                          <span className="no-object">None</span>
                        )}
                      </div>
                    </Col>
                  ))}
                </Row>
                <h3 className="mt-2">Weapons</h3>
                <Row>
                  {characterData.weapons && characterData.weapons.length > 0 ? (
                    characterData.weapons.map((weapon) => (
                      <Col key={weapon._id} sm={6} md={4}>
                        <div className="stat-item">
                          <span className="stat-name">{weapon.name}</span>
                        </div>
                      </Col>
                    ))
                  ) : (
                    <Col><span className="no-object">No Weapons</span></Col>
                  )}
                </Row>
                <h3 className="mt-2">Skills</h3>
                <Row>
                  {characterData.skills && characterData.skills.length > 0 ? (
                    characterData.skills.map((skill) => (
                      <Col key={skill._id} sm={6} md={4}>
                        <div className="stat-item">
                          <span className="stat-name">{skill.skill.name} </span>
                          <span>+{skill.factor}</span>
                        </div>
                      </Col>
                    ))
                  ) : (
                    <Col><span className="no-object">No Skills</span></Col>
                  )}
                </Row>
                <h3 className="mt-2">Talents</h3>
                <Row>
                  {characterData.talents && characterData.talents.length > 0 ? (
                    characterData.talents.map((talent) => (
                      <Col key={talent._id} sm={6} md={4}>
                        <div className="stat-item">
                          <span className="stat-name">{talent.name}</span>
                        </div>
                      </Col>
                    ))
                  ) : (
                    <Col><span className="no-object">No Talents</span></Col>
                  )}
                </Row>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      <Modal show={showEditModal} onHide={closeEditModal} enforceFocus={false} backdrop="static" size="xl" className="custom-modal">
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