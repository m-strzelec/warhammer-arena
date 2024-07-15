import { ListGroup } from "react-bootstrap";

const TraitBrowser = ({ traitsData }) => {
  return(
    <ListGroup>
      {traitsData.map((trait, index) => (
        <ListGroup.Item key={index}>
          <h5>{trait.name}</h5>
          <p>Description: {trait.description}</p>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default TraitBrowser;