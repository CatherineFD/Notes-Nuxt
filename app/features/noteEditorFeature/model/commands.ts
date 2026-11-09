import type { Note, Todo } from "~/entities/note/model/types";

export interface NoteCommand {
  readonly type: string;
  execute(draft: Note): void;
  revert(draft: Note): void;
}

export class ChangeTitleCommand implements NoteCommand {
  readonly type = 'CHANGE_TITLE';

  constructor(
    private readonly oldTitle: string,
    private readonly newTitle: string
  ) {}

  execute(draft: Note): void {
    draft.title = this.newTitle;
  }

  revert(draft: Note): void {
    draft.title = this.oldTitle;
  }
}

export class AddTodoCommand implements NoteCommand {
  readonly type = 'ADD_TODO';

  constructor(private readonly todo: Todo) {}

  execute(draft: Note): void {
    draft.todoList.push({ ...this.todo });
  }

  revert(draft: Note): void {
    const index = draft.todoList.findIndex(t => t.id === this.todo.id);
    if (index !== -1) {
      draft.todoList.splice(index, 1);
    }
  }
}

export class DeleteTodoCommand implements NoteCommand {
  readonly type = 'DELETE_TODO';
  private removedIndex = -1;

  constructor(private readonly todo: Todo) {}

  execute(draft: Note): void {
    const index = draft.todoList.findIndex(t => t.id === this.todo.id);
    if (index === -1) return;
    
    this.removedIndex = index;
    draft.todoList.splice(index, 1);
  }

  revert(draft: Note): void {
    if (this.removedIndex === -1) return;
    
    draft.todoList.splice(this.removedIndex, 0, { ...this.todo });
  }
}

export class ToggleTodoCommand implements NoteCommand {
  readonly type = 'TOGGLE_TODO';

  constructor(
    private readonly todoId: string,
    private readonly from: boolean,
    private readonly to: boolean
  ) {}

  execute(draft: Note): void {
    const todo = draft.todoList.find(t => t.id === this.todoId);
    if (!todo) return;
    
    todo.isComplete = this.to;
  }

  revert(draft: Note): void {
    const todo = draft.todoList.find(t => t.id === this.todoId);
    if (!todo) return;
    
    todo.isComplete = this.from;
  }
}

export class ChangeTodoTextCommand implements NoteCommand {
  readonly type = 'CHANGE_TODO_TEXT';

  constructor(
    private readonly todoId: string,
    private readonly oldText: string,
    private readonly newText: string
  ) {}

  execute(draft: Note): void {
    const todo = draft.todoList.find(t => t.id === this.todoId);
    if (!todo) return;
    
    todo.description = this.newText;
  }

  revert(draft: Note): void {
    const todo = draft.todoList.find(t => t.id === this.todoId);
    if (!todo) return;
    
    todo.description = this.oldText;
  }
}