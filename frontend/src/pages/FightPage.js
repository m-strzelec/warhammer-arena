import React from 'react';
import { Container, Row, Col, Button, Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import FightSimulator from '../components/FightSimulator';
import 'bootstrap/dist/css/bootstrap.min.css';

const FightPage = () => {
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
      <Container className="my-5">
        <Row className="text-center">
          <Col>
            <h1 className="display-4">Fight Simulator</h1>
            <p className="lead">Test your characters in the ultimate fight simulation.</p>
          </Col>
        </Row>
        <Row className="mt-4 justify-content-center">
          <Col xs="auto">
            <Button
              variant="primary"
              size="lg"
              onClick={() => handleNavigate('/')}
              className="mx-2"
              aria-label="Home"
            >
              Home
            </Button>
            <Button
              variant="success"
              size="lg"
              onClick={() => handleNavigate('/creator')}
              className="mx-2"
              aria-label="Create Character"
            >
              Create Character
            </Button>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col>
            <FightSimulator />
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

export default FightPage;
