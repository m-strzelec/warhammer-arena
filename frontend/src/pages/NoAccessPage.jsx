import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../styles/pages/NoAccessPage.css';

const NoAccessPage = () => {
  const navigate = useNavigate();

  return (
    <Container className="noaccess-container my-5">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <h1 className="display-4 noaccess-title">Access Denied</h1>
          <p className="lead noaccess-lead">You do not have permission to access this page.</p>
          <Button variant="warning" size="lg" onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NoAccessPage;