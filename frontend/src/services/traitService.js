import api from '../api/api';

export const createTrait = (trait) => {
    return api.post('/traits', trait);
};

export const getTraits = () => {
    return api.get('/traits');
};

export const getTraitById = (traitId) => {
    return api.get(`/traits/${traitId}`);
};
