import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/HomePage.css';
import home from '../assets/home.webp';

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <>
      <Container className="my-5">
        <Row>
          <Col className="page-header">
            <h1 className="display-4">Welcome to the Warhammer Arena</h1>
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
              variant="secondary"
              size="lg"
              onClick={() => handleNavigate('/characters')}
              className="mx-2"
              aria-label="Characters Browser"
            >
              Browse characters
            </Button>
            <Button
              variant="info"
              size="lg"
              onClick={() => handleNavigate('/browse-items')}
              className="mx-2"
              aria-label="Items Browser"
            >
              Browse available items
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
