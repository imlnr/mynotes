import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import NoteService from '../../utils/noteService';

export interface Note {
    _id: string;
    title: string;
    content: any[];
    updatedAt: string;
    createdAt: string;
}

interface NotesState {
    items: Note[];
    currentNote: Note | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: NotesState = {
    items: [],
    currentNote: null,
    status: 'idle',
    error: null,
};

export const fetchNotes = createAsyncThunk('notes/fetchNotes', async () => {
    const response = await NoteService.getAllNotes();
    return response.data.notes;
});

export const fetchNoteById = createAsyncThunk('notes/fetchNoteById', async (id: string) => {
    const response = await NoteService.getNote(id);
    return response.data.note;
});

export const createNote = createAsyncThunk(
    'notes/createNote',
    async (noteData: { title: string; content: any[] }) => {
        const response = await NoteService.createNote(noteData);
        return response.data.note;
    }
);

export const updateNote = createAsyncThunk(
    'notes/updateNote',
    async ({ id, title, content }: { id: string; title: string; content: any[] }) => {
        const response = await NoteService.updateNote(id, { title, content });
        return response.data.note;
    }
);

export const deleteNote = createAsyncThunk(
    'notes/deleteNote',
    async (id: string) => {
        await NoteService.deleteNote(id);
        return id;
    }
);

export const archiveNote = createAsyncThunk(
    'notes/archiveNote',
    async (id: string) => {
        // Mocking archive by just showing a toast or updating a field if backend supports it
        // For now let's just return the id
        return id;
    }
);

const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {
        setCurrentNote: (state, action: PayloadAction<Note | null>) => {
            state.currentNote = action.payload;
        },
        clearNotes: (state) => {
            state.items = [];
            state.currentNote = null;
            state.status = 'idle';
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotes.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNotes.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchNotes.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch notes';
            })
            .addCase(fetchNoteById.fulfilled, (state, action) => {
                state.currentNote = action.payload;
            })
            .addCase(createNote.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
                state.currentNote = action.payload;
            })
            .addCase(updateNote.fulfilled, (state, action) => {
                const index = state.items.findIndex((n) => n._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                if (state.currentNote?._id === action.payload._id) {
                    state.currentNote = action.payload;
                }
            })
            .addCase(deleteNote.fulfilled, (state, action) => {
                state.items = state.items.filter((n) => n._id !== action.payload);
                if (state.currentNote?._id === action.payload) {
                    state.currentNote = null;
                }
            });
    },
});

export const { setCurrentNote, clearNotes } = notesSlice.actions;
export default notesSlice.reducer;
