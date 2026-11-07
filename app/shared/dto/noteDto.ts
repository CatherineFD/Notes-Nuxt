export type TodoDTO ={
    id: string;
    isComplete: boolean;
    description: string;
}

export type NoteDTO = {
    id: string,
    title: string;
    todoList: TodoDTO[];
}