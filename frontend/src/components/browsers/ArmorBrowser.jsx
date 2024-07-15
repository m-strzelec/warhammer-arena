import { ListGroup } from "react-bootstrap";

const ArmorBrowser = ({ armorsData }) => {
  return (
    <ListGroup>
      {armorsData.map((armor, index) => (
        <ListGroup.Item key={index}>
          <h5>{armor.name}</h5>
          <p>Locations: {armor.locations.join(', ')}</p>
          <p>Protection Factor: {armor.protectionFactor}</p>
          <p>Traits: {armor.traits.map(trait => trait.name).join(', ')}</p>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default ArmorBrowser;