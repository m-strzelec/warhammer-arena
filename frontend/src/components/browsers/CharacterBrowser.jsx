import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Dropdown } from 'primereact/dropdown';
import { getCharacters, getCharacterById } from '../../services/characterService';
import '../../styles/pages/BrowseCharactersPage.css';
import { useToast } from '../../contexts/ToastContext';

const CharacterBrowser = () => {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [characterData, setCharacterData] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await getCharacters();
        setCharacters(response.data);
      } catch (error) {
        showToast('error', 'Error', error.response.data.message);
        console.error(error.response.data?.error || error.response.data.message);
      }
    };
    fetchCharacters();
  }, [showToast]);

  const handleCharacterChange = async (e) => {
    const characterId = e.value;
    setSelectedCharacter(characterId);
    try {
      const response = await getCharacterById(characterId);
      setCharacterData(response.data);
    } catch (error) {
      showToast('error', 'Error', error.response.data.message);
      console.error(error.response.data?.error || error.response.data.message);
    }
  };

  const characterOptions = characters.map((char) => ({
    label: char.name,
    value: char._id,
  }));

  return(
    <Container>
      <Row>
        <Col>
          <Dropdown
            value={selectedCharacter}
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
          {characterData && (
            <Card className="character-card">
              <Card.Body>
                <Card.Title>{characterData.name}</Card.Title>
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
                            <span>No Armor</span>
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
                      <span>No Weapons</span>
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
                      <span>No Skills</span>
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
                      <span>No Talents</span>
                    )}
                  </Row>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default CharacterBrowser;