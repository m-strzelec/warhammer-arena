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

export const updateSkill = (skillId, skillData) => {
    return api.put(`/skills/${skillId}`, skillData);
};