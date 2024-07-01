import React from 'react';
import { Container, Row, Col, Button, Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
        <Container>
          <Navbar.Brand href="/">Fight Simulator</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link onClick={() => handleNavigate('/')}>Home</Nav.Link>
              <Nav.Link onClick={() => handleNavigate('/creator')}>Create Character</Nav.Link>
              <Nav.Link onClick={() => handleNavigate('/fight')}>Fight Simulator</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="text-center my-5">
        <Row>
          <Col>
            <h1 className="display-4">Welcome to the Fight Simulator</h1>
            <p className="lead">Create your character and test them in our fight simulator.</p>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleNavigate('/creator')}
              className="mx-2"
              aria-label="Create Character"
            >
              Create Character
            </Button>
            <Button
              variant="success"
              size="lg"
              onClick={() => handleNavigate('/fight')}
              className="mx-2"
              aria-label="Fight Simulator"
            >
              Fight Simulator
            </Button>
          </Col>
        </Row>
      </Container>
      <footer className="bg-dark text-white text-center py-3">
        <Container>
          <Row>
            <Col>
              <p>&copy; {new Date().getFullYear()} Fight Simulator. All rights reserved.</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default HomePage;
