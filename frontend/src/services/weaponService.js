import api from '../api/api';

export const createWeapon = (weapon) => {
    return api.post('/weapons', weapon);
};

export const getWeapons = () => {
    return api.get('/weapons');
};

export const getWeaponById = (weaponId) => {
    return api.get(`/weapons/${weaponId}`);
};
