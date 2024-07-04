import { Container, Row, Col } from 'react-bootstrap';
import ArmorCreator from '../components/creators/ArmorCreator';
import WeaponCreator from '../components/creators/WeaponCreator';
import SkillCreator from '../components/creators/SkillCreator';
import TalentCreator from '../components/creators/TalentCreator';
import TraitCreator from '../components/creators/TraitCreator';

const CreateItemsPage = () => {
  return (
    <>
      <Container className="my-5">
        <Row className="text-center">
          <Col>
            <h1 className="display-4">Create Items</h1>
            <p className="lead">Design armors, weapons, skills, talents and traits for your characters</p>
          </Col>
        </Row>
        <Row>
          <Col>
            <ArmorCreator />
            <WeaponCreator />
            <SkillCreator />
            <TalentCreator />
            <TraitCreator />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default CreateItemsPage;
