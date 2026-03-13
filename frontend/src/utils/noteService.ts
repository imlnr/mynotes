import api from './axios';

export interface Note {
    _id: string;
    title: string;
    content: any[];
    updatedAt: string;
    createdAt: string;
}

const NoteService = {
    getAllNotes: async () => {
        const response = await api.get('/notes');
        return response.data;
    },

    getNote: async (id: string) => {
        const response = await api.get(`/notes/${id}`);
        return response.data;
    },

    createNote: async (noteData: { title?: string; content?: any[] }) => {
        const response = await api.post('/notes', noteData);
        return response.data;
    },

    updateNote: async (id: string, noteData: { title?: string; content?: any[] }) => {
        const response = await api.patch(`/notes/${id}`, noteData);
        return response.data;
    },

    deleteNote: async (id: string) => {
        const response = await api.delete(`/notes/${id}`);
        return response.data;
    },
};

export default NoteService;
