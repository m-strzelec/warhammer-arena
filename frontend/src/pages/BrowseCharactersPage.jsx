import { Container, Row, Col } from 'react-bootstrap';
import { ConfirmDialog } from 'primereact/confirmdialog';
import CharacterBrowser from '../components/browsers/CharacterBrowser';
import '../styles/pages/BrowseCharactersPage.css';

const BrowseCharactersPage = () => {
  return (
    <>
      <ConfirmDialog />
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
