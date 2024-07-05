import { Container, Row, Col } from 'react-bootstrap';
import CharacterCreator from '../components/creators/CharacterCreator';
import '../styles/pages/CreateCharacterPage.css';

const CreateCharacterPage = () => {
  return (
    <>
      <Container className="my-5">
        <Row className="text-center">
          <Col>
            <h1 className="display-4">Create Character</h1>
            <p className="lead">Design your character for the ultimate fight simulation.</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <CharacterCreator />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CreateCharacterPage;
