import api from './api';

export const ticketService = {
    getAll: async () => {
        const response = await api.get('/tickets');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/tickets/${id}`);
        return response.data;
    },

    create: async (ticketData) => {
        const response = await api.post('/tickets', ticketData);
        return response.data;
    },

    update: async (id, ticketData) => {
        const response = await api.put(`/tickets/${id}`, ticketData);
        return response.data;
    },

    delete: async (id) => {
        await api.delete(`/tickets/${id}`);
        return true;
    }
};
