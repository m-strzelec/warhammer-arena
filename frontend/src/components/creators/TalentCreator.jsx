import { useState } from 'react';
import { createTalent } from '../../services/talentService';

const TalentCreator = () => {
  const [talent, setTalent] = useState({
    name: '', 
    description: '' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTalent({ ...talent, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTalent(talent);
      alert('Talent created successfully');
      setTalent({ name: '', description: '' });
    } catch (error) {
      console.error(error);
      alert('Failed to create talent');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Create Talent</h3>
      <input type="text" name="name" placeholder="Name" value={talent.name} onChange={handleChange} required />
      <input type="text" name="description" placeholder="Description" value={talent.description} onChange={handleChange} required />
      <button type="submit">Create Talent</button>
    </form>
  );
};

export default TalentCreator;
