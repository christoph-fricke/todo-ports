import { createTodo, editTodo, completeTodo, reopenTodo } from "../domain/todo";
import type { TodoInPort } from "../in-ports";
import type { TodoStorageOutPort } from "../out-ports";

export interface TodoUseCasesDependencies {
  todoStorage: TodoStorageOutPort;
}

export function createTodoUseCases(deps: TodoUseCasesDependencies): TodoInPort {
  return {
    fetchAllTodos: () => deps.todoStorage.fetchAllTodos(),

    addTodo: (title) => {
      const todo = createTodo(title);
      return deps.todoStorage.saveTodo(todo);
    },

    editTodo: async (id, title) => {
      const todo = await deps.todoStorage.fetchTodo(id);
      return deps.todoStorage.updateTodo(id, editTodo(todo, title));
    },

    completeTodo: async (id) => {
      const todo = await deps.todoStorage.fetchTodo(id);
      return deps.todoStorage.updateTodo(id, completeTodo(todo));
    },

    reopenTodo: async (id) => {
      const todo = await deps.todoStorage.fetchTodo(id);
      return deps.todoStorage.updateTodo(id, reopenTodo(todo));
    },

    removeTodo: (id) => deps.todoStorage.deleteTodo(id),
  };
}
