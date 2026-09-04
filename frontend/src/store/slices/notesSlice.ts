import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import NoteService from '../../utils/noteService';
import type { Note, NoteUpdate } from '@/types/note';

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
    const response = await NoteService.getAllNotes('all');
    return response.data.notes;
});

export const fetchNoteById = createAsyncThunk('notes/fetchNoteById', async (id: string) => {
    const response = await NoteService.getNote(id);
    return response.data.note;
});

export const createNote = createAsyncThunk(
    'notes/createNote',
    async (noteData: { title: string; content: unknown[] }) => {
        const response = await NoteService.createNote(noteData);
        return response.data.note;
    }
);

export const updateNote = createAsyncThunk(
    'notes/updateNote',
    async ({ id, ...updates }: { id: string } & NoteUpdate) => {
        const response = await NoteService.updateNote(id, updates);
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
    async ({ id, archived }: { id: string; archived: boolean }) => {
        const response = await NoteService.updateNote(id, { isArchived: archived });
        return response.data.note;
    }
);

const upsertNote = (state: NotesState, note: Note) => {
    const index = state.items.findIndex((n) => n._id === note._id);
    if (index !== -1) {
        state.items[index] = note;
    } else {
        state.items.unshift(note);
    }
    if (state.currentNote?._id === note._id) {
        state.currentNote = note;
    }
};

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
                upsertNote(state, action.payload);
            })
            .addCase(createNote.fulfilled, (state, action) => {
                state.items.unshift(action.payload);
                state.currentNote = action.payload;
            })
            .addCase(updateNote.fulfilled, (state, action) => {
                upsertNote(state, action.payload);
            })
            .addCase(archiveNote.fulfilled, (state, action) => {
                upsertNote(state, action.payload);
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
