export interface Note {
    _id: string;
    title: string;
    content: unknown[];
    isArchived?: boolean;
    isPublished?: boolean;
    shareId?: string | null;
    publishedAt?: string | null;
    updatedAt: string;
    createdAt: string;
}

export type NoteUpdate = Partial<Pick<Note, 'title' | 'content' | 'isArchived' | 'isPublished'>>;
