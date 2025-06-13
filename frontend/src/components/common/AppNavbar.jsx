import { Navbar, Nav, Container, Image, Button, NavDropdown } from 'react-bootstrap';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { GiAxeSword, GiBattleGear, GiCharacter, GiDwarfFace, GiWarhammer, GiScrollQuill } from "react-icons/gi";
import { SiCurseforge } from "react-icons/si";
import { useAuth } from "../../contexts/AuthContext"
import wharena from '../../assets/wharena.webp';
import '../../styles/components/common/AppNavbar.css';

const AppNavbar = () => {
  const [expanded, setExpanded] = useState(false);
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      await handleLogout();
      navigate('/login');
      setExpanded(true);
    } catch (err) {
      console.error(err.response.data?.error || err.response.data.message);
    }
  }

  return (
    <Navbar bg="dark" variant="dark" expand="xl" className="navbar" sticky='top' expanded={expanded} onToggle={() => setExpanded(!expanded)}>
      <Container fluid>
        <Navbar.Brand to="/" as={NavLink} className="me-5 d-flex align-items-center">
          <Image 
            src={wharena}
            width="64"
            height="64"
            className="d-inline-block"
            alt="site logo knight fighting spawn of chaos"
          />
          <span className="ms-3" style={{ whiteSpace: 'normal', maxWidth: '300px' }}>Warhammer Arena</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto gap-1 flex-wrap">
            {user && (
              <>
                <Nav.Link to="/" as={NavLink} onClick={() => setExpanded(false)}>
                  <GiWarhammer className="me-2"/>
                  <span>Home</span>
                </Nav.Link>
                <Nav.Link to="/fight" as={NavLink} onClick={() => setExpanded(false)}>
                  <GiAxeSword className="me-2"/>
                  <span>Fight Simulator</span>
                </Nav.Link>
                <Nav.Link to="/fight-history" as={NavLink} onClick={() => setExpanded(false)}>
                  <GiScrollQuill className="me-2"/>
                  <span>Fight History</span>
                </Nav.Link>
                <Nav.Link to="/characters" as={NavLink} onClick={() => setExpanded(false)}>
                  <GiDwarfFace className="me-2"/>
                  <span>Characters</span>
                </Nav.Link>
                { user.type === 'ADMIN' && (
                  <Nav.Link to="/create-items" as={NavLink} onClick={() => setExpanded(false)}>
                    <SiCurseforge className="me-2"/>
                    <span>Forge</span>
                  </Nav.Link>
                )}
                <Nav.Link to="/browse-items" as={NavLink} onClick={() => setExpanded(false)}>
                  <GiBattleGear className="me-2"/>
                  <span>Armory</span>
                </Nav.Link>
                { user.type === 'ADMIN' && (
                  <Nav.Link to="/users" as={NavLink} onClick={() => setExpanded(false)}>
                    <GiCharacter className="me-2"/>
                    <span>Users</span>
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>
          <Nav className="ms-auto align-items-center">
            {user ? (
              <>
                <NavDropdown title={<span>{user.username}</span>} id="user-dropdown" align="end">
                  <NavDropdown.Item onClick={handleLogoutClick}>Logout</NavDropdown.Item>
                </NavDropdown>            
              </>
            ) : (
              <>
                <Button 
                  variant="outline-light" 
                  size="sm" 
                  className="me-2"
                  onClick={() => { navigate('/login'); setExpanded(false); }}
                  style={{ minHeight: 32, padding: '2px 16px' }}
                >
                  Login
                </Button>
                <Button 
                  variant="outline-warning" 
                  size="sm" 
                  onClick={() => { navigate('/register'); setExpanded(false); }} 
                  style={{ minHeight: 32, padding: '2px 16px' }}
                >
                  Register
                </Button>                
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;