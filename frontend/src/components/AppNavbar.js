import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';


const AppNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="navbar" sticky='top'>
      <Container>
        <Navbar.Brand to="/" as={NavLink} className="ms-4">Warhammer Arena</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-3 container-fluid">
            <Nav.Link to="/" as={NavLink}>
              <div className="d-flex align-items-center">
                <span>Home</span>
              </div>
            </Nav.Link>
            <Nav.Link to="/creator" as={NavLink}>
              <div className="d-flex align-items-center">
                <span>Character Creator</span>
              </div>
            </Nav.Link>
            <Nav.Link to="/fight" as={NavLink}>
              <div className="d-flex align-items-center">
                <span>Fight Simulator</span>
              </div>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;