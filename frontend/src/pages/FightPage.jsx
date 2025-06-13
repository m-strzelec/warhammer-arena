import { Container, Row, Col } from 'react-bootstrap';
import FightSimulator from '../components/simulator/FightSimulator';
import '../styles/pages/FightPage.css';

const FightPage = () => {
  return (
    <>
      <Container className="my-5">
        <Row className="text-center">
          <Col className="page-header">
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
