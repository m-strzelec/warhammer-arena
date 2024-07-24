import { Container, Row, Col } from 'react-bootstrap';
import '../styles/pages/BrowseCharactersPage.css';
import CharacterBrowser from '../components/browsers/CharacterBrowser';

const BrowseCharactersPage = () => {
  return (
    <>
      <Container className="my-5 browse-characters">
        <Row className="text-center mb-4">
          <Col>
            <h1 className="display-4">Browse Characters</h1>
            <p className="lead">Browse and view detailed information about characters.</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <CharacterBrowser />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default BrowseCharactersPage;
