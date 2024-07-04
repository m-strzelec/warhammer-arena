import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <>
      <Container className="text-center my-5">
        <Row>
          <Col>
            <h1>Welcome to the Warhammer Arena</h1>
            <p className="lead">Create your character and test them in our fight simulator.</p>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleNavigate('/create-character')}
              className="mx-2"
              aria-label="Create Character"
            >
              Create new character
            </Button>
            <Button
              variant="success"
              size="lg"
              onClick={() => handleNavigate('/fight')}
              className="mx-2"
              aria-label="Fight Simulator"
            >
              Simulate a fight
            </Button>
            <Button
              variant="warning"
              size="lg"
              onClick={() => handleNavigate('/create-items')}
              className="mx-2"
              aria-label="Fight Simulator"
            >
              Add new items
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomePage;
