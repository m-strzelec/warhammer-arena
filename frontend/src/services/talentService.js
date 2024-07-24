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
