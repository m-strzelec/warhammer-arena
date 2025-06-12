import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/HomePage.css';
import home from '../assets/home.webp';
import { useAuth } from '../contexts/AuthContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <>
      <Container className="my-5">
        <Row>
          <Col>
            <h1>Welcome to the Warhammer Arena</h1>
            <p className="lead">Create your characters and test them in this Warhammer Fantasy 2ed simulator.</p>
          </Col>
        </Row>
        <Row className="my-4">
          <Col>
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
              variant="primary"
              size="lg"
              onClick={() => handleNavigate('/create-character')}
              className="mx-2"
              aria-label="Create Character"
            >
              Create new character
            </Button>
            { user.type === 'ADMIN' && (
              <Button
                variant="warning"
                size="lg"
                onClick={() => handleNavigate('/create-items')}
                className="mx-2"
                aria-label="Items Creator"
              >
                Add new items
              </Button>
            )}
            <Button
              variant="info"
              size="lg"
              onClick={() => handleNavigate('/browse-items')}
              className="mx-2"
              aria-label="Items Browser"
            >
              Browse available items
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleNavigate('/characters')}
              className="mx-2"
              aria-label="Characters Browser"
            >
              Browse your characters
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <Image 
              src={home}
              alt="grand arena where fantasy characters are engaged in epic battles"
              fluid
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomePage;
