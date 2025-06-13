import api from '../api/api';

export const createFight = (character1Id, character2Id) => {
    return api.post('/fights', { character1Id, character2Id });
};

export const getFights = () => {
    return api.get('/fights');
};

export const getFightById = (fightId) => {
    return api.get(`/fights/${fightId}`);
};

export const getFightsByCharacterId = (characterId) => {
    return api.get(`/fights/characters/${characterId}`);
};
