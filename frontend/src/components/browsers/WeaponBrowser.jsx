import { ListGroup } from "react-bootstrap";

const WeaponBrowser = ({ weaponsData }) => {
  return(
    <ListGroup>
      {weaponsData.map((weapon, index) => (
        <ListGroup.Item key={index}>
          <h5>{weapon.name}</h5>
          <p>Damage Factor: {weapon.damageFactor}</p>
          <p>Traits: {weapon.traits.map(trait => trait.name).join(', ')}</p>
          <p>Type: {weapon.type}</p>
          <p>Handedness: {weapon.handedness}</p>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default WeaponBrowser;