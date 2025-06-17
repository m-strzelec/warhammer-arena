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

export const updateTrait = (traitId, trait) => {
    return api.put(`/traits/${traitId}`, trait);
};

export const deleteTrait = (traitId) => {
    return api.delete(`/traits/${traitId}`);
};