import type { Todo } from "./domain/todo";

export type TodoInPort = {
  fetchAllTodos(): Promise<Todo[]>;

  addTodo(title: Todo["title"]): Promise<Todo>;

  completeTodo(id: Todo["id"]): Promise<Todo>;

  reopenTodo(id: Todo["id"]): Promise<Todo>;

  editTodo(id: Todo["id"], title: Todo["title"]): Promise<Todo>;

  removeTodo(id: Todo["id"]): Promise<void>;
};
