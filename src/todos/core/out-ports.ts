import type { Todo } from "./domain/todo";

export type TodoStorageOutPort = {
  fetchAllTodos(): Promise<Todo[]>;

  fetchTodo(id: Todo["id"]): Promise<Todo>;

  saveTodo(todo: Todo): Promise<Todo>;

  updateTodo(id: Todo["id"], todo: Todo): Promise<Todo>;

  deleteTodo(id: Todo["id"]): Promise<void>;
};
