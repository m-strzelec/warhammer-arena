import api from '../api/api';

export const createTalent = (talent) => {
    return api.post('/talents', talent);
};

export const getTalents = () => {
    return api.get('/talents');
};

export const getTalentById = (talentId) => {
    return api.get(`/talents/${talentId}`);
};

export const updateTalent = (talentId, talent) => {
    return api.put(`/talents/${talentId}`, talent);
};

export const deleteTalent = (talentId) => {
    return api.delete(`/talents/${talentId}`);
};