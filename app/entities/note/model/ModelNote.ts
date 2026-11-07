import type { NoteDTO } from "~/shared/dto/noteDto";
import type { Note } from "./types";

export class NoteModel {
    constructor() {}

    public static mapNotesToDTO(notes: Note[]): NoteDTO[] {
        return notes.map((elem) => ({
            id: elem.id,
            title: elem.title,
            todoList: elem.todoList.map((todo) => ({
                id: todo.id,
                isComplete: todo.isComplete,
                description: todo.description,
            }))
        }));
    }

    public static mapDtoToNotes(notesDTO: NoteDTO[]): Note[] {
        return notesDTO.map((elem) => ({
            id: elem.id,
            title: elem.title,
            todoList: elem.todoList.map((todoDTO) => ({
                id: todoDTO.id,
                isComplete: todoDTO.isComplete,
                description: todoDTO.description,
            }))
        }));
    }
}