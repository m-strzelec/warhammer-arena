import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
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
  const [fightCount, setFightCount] = useState(1);
  const [fightLog, setFightLog] = useState([]);
  const [winner, setWinner] = useState('');
  const [multipleFightResults, setMultipleFightResults] = useState(null);
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
  }, [showToast, user.id, user.type]);

  const handleFight = async () => {
    setFightLog([]);
    setWinner('');
    setMultipleFightResults(null);
    if (!character1 || !character2) {
      showToast('info', 'Info', 'Please select both characters');
      return;
    }
    if (character1 === character2) {
      showToast('info', 'Info', 'A character cannot fight itself.');
      return;
    }
    if (fightCount < 1 || fightCount > 100000) {
      showToast('info', 'Info', 'Number of fights must be between 1 and 1000.');
      return;
    }

    setFightLoading(true);
    try {
      const response = await createFight(character1, character2, fightCount);
      if (fightCount === 1) {
        setFightLog(response.data.log);
        setWinner(response.data.winnerId);
      } else {
        setMultipleFightResults({
          character1Wins: response.data.character1Wins,
          character2Wins: response.data.character2Wins,
          totalFights: response.data.totalFights,
          lastWinner: response.data.lastWinner
        });
      }
    } catch (error) {
      showToast('error', 'Error', error.response.data.message);
      console.error(error.response.data?.error || error.response.data.message);
    } finally {
      setFightLoading(false);
    }
  };

  const getCharacterName = (id) => characters.find((char) => char._id === id)?.name;
  const char1Name = getCharacterName(character1);
  const char2Name = getCharacterName(character2);
  const winnerColor = winner === character1 ? 'rgba(0, 128, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)';

  if (loading) return <LoadingPage message="Loading characters..." />;
  
  return (
    <Container>
      <Row className="text-center mb-2">
        <Col>
          <p className="lead">Select characters and the number of fights to start the simulation.</p>
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
      <Row className="fight-count-row">
        <Col md={4}>
          <div className="flex-auto">
            <label htmlFor="fightCount" className="fight-count-label">Number of Fights</label>
            <InputNumber
              inputId="fightCount"
              value={fightCount}
              onValueChange={(e) => setFightCount(e.value)}
              mode="decimal"
              showButtons
              buttonLayout="horizontal"
              incrementButtonIcon="pi pi-plus"
              decrementButtonIcon="pi pi-minus"
              min={1}
              max={100000}
              className="w-100"
            />
          </div>
        </Col>
      </Row>
      <Row className="text-center my-3">
        <Col>
          <Button variant="primary" size="lg" onClick={handleFight} disabled={loading}>
            {fightLoading ? <Spinner animation="border" size="sm" /> : 'Start Simulation'}
          </Button>
        </Col>
      </Row>
      {fightCount === 1 && fightLog.length > 0 && (
        <Row className="justify-content-center">
          <Col md={8}>
            <FightLog fightLog={fightLog} char1Name={char1Name} char2Name={char2Name} />
          </Col>
        </Row>
      )}
      {fightCount === 1 && winner && (
        <Row className="justify-content-center">
          <Col md={8}>
            <Alert variant="success" style={{ backgroundColor: winnerColor, color: 'darkgreen' }}>
              <h2>Winner: {getCharacterName(winner)}</h2>
            </Alert>
          </Col>
        </Row>
      )}
      {fightCount > 1 && multipleFightResults && (
        <Row className="justify-content-center">
          <Col md={8}>
            <h3 className="text-center mb-3">Simulation Results ({multipleFightResults.totalFights} Fights)</h3>
            <Alert variant="success" className="imulation-results-alert text-center" style={{ backgroundColor: winnerColor, color: 'darkgreen' }}>
              <h2>
                {char1Name} Wins: {multipleFightResults.character1Wins} (
                {((multipleFightResults.character1Wins / multipleFightResults.totalFights) * 100).toFixed(2)}%)
              </h2>
              <h2>
                {char2Name} Wins: {multipleFightResults.character2Wins} (
                {((multipleFightResults.character2Wins / multipleFightResults.totalFights) * 100).toFixed(2)}%)
              </h2>
              <hr />
              <h3>Last Winner: {getCharacterName(multipleFightResults.lastWinner)}</h3>
            </Alert>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default FightSimulator;
