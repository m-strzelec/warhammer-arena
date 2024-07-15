import { ListGroup } from "react-bootstrap";

const SkillBrowser = ({ skillsData }) => {
  return (
    <ListGroup>
      {skillsData.map((skill, index) => (
        <ListGroup.Item key={index}>
          <h5>{skill.name}</h5>
          <p>Base Stat: {skill.baseStat}</p>
          <p>Description: {skill.description}</p>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default SkillBrowser;