import api from './axios';
import type { Note, NoteUpdate } from '@/types/note';

interface NotesResponse {
    status: string;
    results: number;
    data: { notes: Note[] };
}

interface NoteResponse {
    status: string;
    data: { note: Note };
}

const NoteService = {
    getAllNotes: async (archived: 'true' | 'false' | 'all' = 'all') => {
        const response = await api.get<NotesResponse>('/notes', {
            params: { archived },
        });
        return response.data;
    },

    getNote: async (id: string) => {
        const response = await api.get<NoteResponse>(`/notes/${id}`);
        return response.data;
    },

    getSharedNote: async (shareId: string) => {
        const response = await api.get<NoteResponse>(`/notes/shared/${shareId}`);
        return response.data;
    },

    createNote: async (noteData: { title?: string; content?: unknown[] }) => {
        const response = await api.post<NoteResponse>('/notes', noteData);
        return response.data;
    },

    updateNote: async (id: string, noteData: NoteUpdate) => {
        const response = await api.patch<NoteResponse>(`/notes/${id}`, noteData);
        return response.data;
    },

    deleteNote: async (id: string) => {
        const response = await api.delete(`/notes/${id}`);
        return response.data;
    },
};

export default NoteService;
