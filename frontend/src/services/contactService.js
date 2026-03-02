import api from './api';

export const contactService = {
    getAll: async () => {
        const response = await api.get('/contacts');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/contacts/${id}`);
        return response.data;
    },

    create: async (contactData) => {
        const response = await api.post('/contacts', contactData);
        return response.data;
    },

    update: async (id, contactData) => {
        const response = await api.put(`/contacts/${id}`, contactData);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/contacts/${id}`);
        return true;
    }
};
