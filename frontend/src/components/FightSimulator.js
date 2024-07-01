import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner, Card } from 'react-bootstrap';
import { getCharacters } from '../services/characterService';
import { createFight } from '../services/fightService';

const FightSimulator = () => {
  const [characters, setCharacters] = useState([]);
  const [character1, setCharacter1] = useState('');
  const [character2, setCharacter2] = useState('');
  const [fightLog, setFightLog] = useState([]);
  const [winner, setWinner] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await getCharacters();
        setCharacters(response.data);
      } catch (error) {
        setError('Failed to fetch characters');
        console.error(error);
      }
    };
    fetchCharacters();
  }, []);

  const handleFight = async () => {
    if (!character1 || !character2) {
      alert('Please select both characters');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await createFight(character1, character2);
      setFightLog(response.data.log);
      setWinner(response.data.winnerId);
    } catch (error) {
      setError('Failed to start fight');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <Row className="text-center mb-4">
        <Col>
          <h1 className="display-4">Fight Simulator</h1>
          <p className="lead">Select characters and start the fight simulation</p>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md={4} className="mb-3">
          <Form.Select onChange={(e) => setCharacter1(e.target.value)} value={character1} aria-label="Select Character 1">
            <option value="">Select Character 1</option>
            {characters.map((char) => (
              <option key={char._id} value={char._id}>
                {char.name}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={4} className="mb-3">
          <Form.Select onChange={(e) => setCharacter2(e.target.value)} value={character2} aria-label="Select Character 2">
            <option value="">Select Character 2</option>
            {characters.map((char) => (
              <option key={char._id} value={char._id}>
                {char.name}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>
      <Row className="text-center mb-4">
        <Col>
          <Button variant="primary" size="lg" onClick={handleFight} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Start Fight'}
          </Button>
        </Col>
      </Row>
      {error && (
        <Row className="justify-content-center">
          <Col md={8}>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}
      {fightLog.length > 0 && (
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="mb-4">
              <Card.Body>
                {fightLog.map((log, index) => (
                  <p key={index}>{log}</p>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
      {winner && (
        <Row className="justify-content-center">
          <Col md={8}>
            <Alert variant="success">
              <h2>Winner: {characters.find((char) => char._id === winner)?.name}</h2>
            </Alert>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default FightSimulator;
