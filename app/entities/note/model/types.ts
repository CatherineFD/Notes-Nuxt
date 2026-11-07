export type Todo = {
    id: string;
    isComplete: boolean;
    description: string;
}

export type Note = {
    id: string,
    title: string;
    todoList: Todo[];
}