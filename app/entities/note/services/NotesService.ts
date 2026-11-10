import type { Note } from "../model/types";
import type { NotesRepository } from "../repositories/note-repository";
import { NoteModel } from '../model/ModelNote';

export class NotesService {
    readonly repository: NotesRepository

    constructor(repository: NotesRepository) {
        this.repository = repository;
    }

    async getNotes(): Promise<Note[]> {
        const data = await this.repository.getNotes();
        return NoteModel.mapDtoToNotes(data);
    }

    async saveNotes(notes: Note[]): Promise<void> {
        const payload = NoteModel.mapNotesToDTO(notes);
        await this.repository.saveNotes(payload);
    }
}