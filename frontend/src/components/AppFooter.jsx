import { Container, Row, Col } from 'react-bootstrap';
import '../styles/AppFooter.css';

const AppFooter = () => {
    return (
      <footer className="bg-dark text-white text-center py-3">
        <Container>
          <Row>
            <Col>
              <p>&copy; {new Date().getFullYear()} Warhammer Arena. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </footer>
    );
};

export default AppFooter