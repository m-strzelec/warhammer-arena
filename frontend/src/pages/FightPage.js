import { Container, Row, Col } from 'react-bootstrap';
import FightSimulator from '../components/FightSimulator';

const FightPage = () => {
  return (
    <>
      <Container className="my-2">
        <Row className="text-center">
          <Col>
            <h1 className="display-4">Fight Simulator</h1>
            <p className="lead">Test your characters in the ultimate fight simulation.</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <FightSimulator />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default FightPage;
