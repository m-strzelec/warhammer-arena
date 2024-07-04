import { useState } from 'react';
import { createSkill } from '../../services/skillService';

const SkillCreator = () => {
  const [skill, setSkill] = useState({ 
    name: '', 
    baseStat: '', 
    description: '' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSkill({ ...skill, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createSkill(skill);
      alert('Skill created successfully');
      setSkill({ name: '', baseStat: '', description: '' });
    } catch (error) {
      console.error(error);
      alert('Failed to create skill');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Skill</h3>
      <input type="text" name="name" placeholder="Name" value={skill.name} onChange={handleChange} required />
      <input type="text" name="baseStat" placeholder="Base Stat" value={skill.baseStat} onChange={handleChange} required />
      <input type="text" name="description" placeholder="Description" value={skill.description} onChange={handleChange} required />
      <button type="submit">Create Skill</button>
    </form>
  );
};

export default SkillCreator;
