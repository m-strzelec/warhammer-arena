import api from '../api/api';

export const createArmor = (armor) => {
    return api.post('/armors', armor);
};

export const getArmors = () => {
    return api.get('/armors');
};

export const getArmorById = (armorId) => {
    return api.get(`/armors/${armorId}`);
};

export const updateArmor = (armorId, armor) => {
    return api.put(`/armors/${armorId}`, armor);
}
