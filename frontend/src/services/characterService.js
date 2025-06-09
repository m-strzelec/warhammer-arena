import api from '../api/api';

export const createCharacter = (character) => {
    return api.post('/characters', character);
};

export const getCharacters = () => {
    return api.get('/characters');
};

export const getCharacterById = (characterId) => {
    return api.get(`/characters/${characterId}`);
};

export const updateCharacter = (characterId, character) => {
    return api.put(`/characters/${characterId}`, character);
};

export const deleteCharacter = (characterId) => {
    return api.delete(`/characters/${characterId}`);
};
