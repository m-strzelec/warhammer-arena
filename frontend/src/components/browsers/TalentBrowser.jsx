import { ListGroup } from "react-bootstrap";

const TalentBrowser = ({ talentsData }) => {
  return(
    <ListGroup>
      {talentsData.map((talent, index) => (
        <ListGroup.Item key={index}>
          <h5>{talent.name}</h5>
          <p>Description: {talent.description}</p>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default TalentBrowser;