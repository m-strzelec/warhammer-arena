import { Navbar, Nav, Container } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { GiAxeSword, GiBattleGear, GiDwarfFace, GiWarhammer } from "react-icons/gi";
import wharena from '../../assets/wharena.webp';
import '../../styles/AppNavbar.css';

const AppNavbar = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="md" className="navbar" sticky='top'>
      <Container fluid="true">
        <Navbar.Brand to="/" as={NavLink} className="ms-4 d-flex align-items-center">
          <img 
            src={wharena}
            width="80"
            height="80"
            className="d-inline-block"
            alt="site logo knight fighting spawn of chaos"
          />
          <span className="ms-4">Warhammer Arena</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-5 container-fluid">
            <Nav.Link to="/" as={NavLink}>
              <div className="d-flex align-items-center">
                <GiWarhammer className="d-inline-block me-2" style={{ width: '40px', height: '40px' }} />
                <span>Home</span>
              </div>
            </Nav.Link>
            <Nav.Link to="/create-character" as={NavLink}>
              <div className="d-flex align-items-center">
                <GiDwarfFace className="d-inline-block me-2" style={{ width: '40px', height: '40px' }} />
                <span>Character Creator</span>
              </div>
            </Nav.Link>
            <Nav.Link to="/fight" as={NavLink}>
              <div className="d-flex align-items-center">
                <GiAxeSword className="d-inline-block me-2" style={{ width: '40px', height: '40px' }} />
                <span>Fight Simulator</span>
              </div>
            </Nav.Link>
            <Nav.Link to="/create-items" as={NavLink}>
              <div className="d-flex align-items-center">
                <GiBattleGear className="d-inline-block me-2" style={{ width: '40px', height: '40px' }} />
                <span>Items Creator</span>
              </div>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;