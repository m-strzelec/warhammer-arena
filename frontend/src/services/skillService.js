import api from '../api/api';

export const createSkill = (skill) => {
    return api.post('/skills', skill);
};

export const getSkills = () => {
    return api.get('/skills');
};

export const getSkillById = (skillId) => {
    return api.get(`/skills/${skillId}`);
};
