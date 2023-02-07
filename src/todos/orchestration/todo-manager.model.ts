import { createEvent, EventFrom } from "xsystem";
import type { Todo } from "../core/domain/todo";

export type TodoMangerContext = {
  todos: Todo[];
  deletionId: Todo["id"] | null;
  newTodoTitle: string;
};

export function getInitialContext(): TodoMangerContext {
  return {
    todos: [],
    deletionId: null,
    newTodoTitle: "",
  };
}

export type TodoManagerEvent =
  | EventFrom<typeof toggleEditing>
  | EventFrom<typeof toggleTodo>
  | EventFrom<typeof deleteTodo>
  | EventFrom<typeof cancelDelete>
  | EventFrom<typeof confirmDelete>
  | EventFrom<typeof updateTodo>
  | EventFrom<typeof changeNewTodoTitle>
  | EventFrom<typeof createNewTodo>;

export const toggleEditing = createEvent("todos.edit.toggle");

export const toggleTodo = createEvent(
  "todos.todo.toggle",
  (id: Todo["id"]) => ({
    payload: { id },
  })
);

export const deleteTodo = createEvent(
  "todos.todo.delete",
  (id: Todo["id"]) => ({
    payload: { id },
  })
);
export const cancelDelete = createEvent("todos.todo.delete.cancel");
export const confirmDelete = createEvent("todos.todo.delete.confirm");

export const updateTodo = createEvent(
  "todos.todo.update",
  (id: Todo["id"], title: Todo["title"]) => ({ payload: { id, title } })
);

export const changeNewTodoTitle = createEvent(
  "todos.new-todo.change-title",
  (title: Todo["title"]) => ({ payload: { title } })
);
export const createNewTodo = createEvent("todos.new-todo.create");
