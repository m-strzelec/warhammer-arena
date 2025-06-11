import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { Dropdown } from 'primereact/dropdown';
import { getCharacters } from '../../services/characterService';
import { createFight } from '../../services/fightService';
import { useToast } from '../../contexts/ToastContext';
import FightLog from './FightLog';
import LoadingPage from '../common/LoadingPage';
import { useAuth } from '../../contexts/AuthContext';

const FightSimulator = () => {
  const [characters, setCharacters] = useState([]);
  const [character1, setCharacter1] = useState('');
  const [character2, setCharacter2] = useState('');
  const [fightLog, setFightLog] = useState([]);
  const [winner, setWinner] = useState('');
  const [loading, setLoading] = useState(true);
  const [fightLoading, setFightLoading] = useState(false);
  const { showToast } = useToast();
  const { user } = useAuth();

  const characterOptions = characters.map(char => ({
    label: char.name,
    value: char._id
  }));

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await getCharacters();
        const characterData = response.data;
        if (user.type === 'ADMIN') {
          const userCharacters = characterData.filter(char => char.userId === user.id);
          setCharacters(userCharacters);
        } else {
          setCharacters(characterData);
        }
      } catch (error) {
        showToast('error', 'Error', error.response.data.message);
        console.error(error.response.data?.error || error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, [showToast, user.id]);

  const handleFight = async () => {
    if (!character1 || !character2) {
      showToast('info', 'Info', 'Please select both characters');
      return;
    }
    setFightLoading(true);
    try {
      const response = await createFight(character1, character2);
      setFightLog(response.data.log);
      setWinner(response.data.winnerId);
    } catch (error) {
      showToast('error', 'Error', error.response.data.message);
      console.error(error.response.data?.error || error.response.data.message);
    } finally {
      setFightLoading(false);
    }
  };

  const char1Name = characters.find((char) => char._id === character1)?.name.split(' ')[0];
  const char2Name = characters.find((char) => char._id === character2)?.name.split(' ')[0];
  const winnerColor = winner === character1 ? 'rgba(0, 128, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)';

  if (loading) return <LoadingPage message="Loading characters..." />;
  
  return (
    <Container>
      <Row className="text-center mb-2">
        <Col>
          <p className="lead">Select characters and start the fight simulation.</p>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={4} className="mb-3">
          <Dropdown
            aria-label="Select first character"
            value={character1}
            options={characterOptions}
            onChange={(e) => setCharacter1(e.value)}
            placeholder="Select first character"
            className="w-100 text-start"
            required
          />
        </Col>
        <Col md={4} className="mb-3">
          <Dropdown
            aria-label="Select second character"
            value={character2}
            options={characterOptions}
            onChange={(e) => setCharacter2(e.value)}
            placeholder="Select second character"
            className="w-100 text-start"
            required
          />
        </Col>
      </Row>
      <Row className="text-center my-3">
        <Col>
          <Button variant="primary" size="lg" onClick={handleFight} disabled={loading}>
            {fightLoading ? <Spinner animation="border" size="sm" /> : 'Start Fight'}
          </Button>
        </Col>
      </Row>
      {fightLog.length > 0 && (
        <Row className="justify-content-center">
          <Col md={8}>
            <FightLog fightLog={fightLog} char1Name={char1Name} char2Name={char2Name} />
          </Col>
        </Row>
      )}
      {winner && (
        <Row className="justify-content-center">
          <Col md={8}>
            <Alert variant="success" style={{ backgroundColor: winnerColor, color: 'darkgreen' }}>
              <h2>Winner: {characters.find((char) => char._id === winner)?.name}</h2>
            </Alert>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default FightSimulator;
