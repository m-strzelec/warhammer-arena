import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/NotFoundPage.css';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <Container className="notfound-container my-5">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <h1 className="display-4 notfound-title">404</h1>
          <p className="lead notfound-lead">The page you are looking for does not exist.</p>
          <Button variant="warning" size="lg" onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;