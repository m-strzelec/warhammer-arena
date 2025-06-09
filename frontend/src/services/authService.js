import api from '../api/api';

export const register = (userData) => {
    return api.post('/auth/register', userData);
};

export const login = (credentials) => {
    return api.post('/auth/login', credentials);
};

export const refresh = () => {
    return api.post('/auth/refresh');
};

export const logout = () => {
    return api.post('/auth/logout');
};

export const getSelf = () => {
    return api.get('/auth/self');
};

export const getAllUsers = () => {
    return api.get('/auth/users');
};

export const getUserById = (userId) => {
    return api.get(`/auth/users/${userId}`);
};

export const updateUser = (userId, userData) => {
    return api.put(`/auth/users/${userId}`, userData);
};

export const deleteUser = (userId) => {
    return api.delete(`/auth/users/${userId}`);
};
