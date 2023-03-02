import { createTodo, editTodo, completeTodo, reopenTodo } from "../domain/todo";
import type { TodoInPort } from "../in-ports";
import type {
  ConfirmationOutPort,
  NotificationOutPort,
  TodoStorageOutPort,
} from "../out-ports";

export interface TodoUseCasesDependencies {
  todoStorage: TodoStorageOutPort;
  confirmations: ConfirmationOutPort;
  notification: NotificationOutPort;
}

export function createTodoUseCases(deps: TodoUseCasesDependencies): TodoInPort {
  return {
    fetchAllTodos: () => deps.todoStorage.fetchAllTodos(),

    addTodo: async (title) => {
      const todo = createTodo(title);
      const created = await deps.todoStorage.saveTodo(todo);
      await deps.notification.notifyTodoCreation(created);
      return created;
    },

    editTodo: async (id, title) => {
      const todo = await deps.todoStorage.fetchTodo(id);
      const updated = await deps.todoStorage.updateTodo(
        id,
        editTodo(todo, title)
      );
      await deps.notification.notifyTodoUpdate(updated);
      return updated;
    },

    completeTodo: async (id) => {
      const todo = await deps.todoStorage.fetchTodo(id);
      return deps.todoStorage.updateTodo(id, completeTodo(todo));
    },

    reopenTodo: async (id) => {
      const todo = await deps.todoStorage.fetchTodo(id);
      return deps.todoStorage.updateTodo(id, reopenTodo(todo));
    },

    removeTodo: async (id) => {
      const todo = await deps.todoStorage.fetchTodo(id);
      const confirmation =
        await deps.confirmations.requestTodoDeletionConfirmation(todo);

      if (confirmation.result === "canceled")
        throw new Error("Deletion Canceled");

      deps.todoStorage.deleteTodo(id);
    },
  };
}
