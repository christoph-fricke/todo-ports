import { useInterpret, useSelector } from "@xstate/react";
import { useMemo } from "react";
import type { TodoInPort } from "../core/in-ports";
import {
  createTodoManager,
  EventBusWithTodoEvents,
  TodoManagerActor,
} from "./todo-manager";
import {
  cancelDelete,
  changeNewTodoTitle,
  confirmDelete,
  createNewTodo,
  deleteTodo,
  toggleEditing,
  toggleTodo,
  updateTodo,
} from "./todo-manager.model";

export function useTodoManager(
  bus: EventBusWithTodoEvents,
  todos: TodoInPort
): TodoManagerActor {
  const actor = useInterpret(
    () => createTodoManager({ eventBus: bus, todos }),
    {
      devTools: import.meta.env.DEV,
    }
  );
  return actor;
}

export function useTodoManagerEvents(actor: EventBusWithTodoEvents) {
  const events = useMemo(
    () => ({
      toggleEditing: toggleEditing.createSendCall(actor),
      changeNewTodoTitle: changeNewTodoTitle.createSendCall(actor),
      createNewTodo: createNewTodo.createSendCall(actor),
      toggleTodo: toggleTodo.createSendCall(actor),
      updateTodo: updateTodo.createSendCall(actor),
      deleteTodo: deleteTodo.createSendCall(actor),
      cancelDelete: cancelDelete.createSendCall(actor),
      confirmDelete: confirmDelete.createSendCall(actor),
    }),
    [actor]
  );

  return events;
}

export function useTodoManagerState(actor: TodoManagerActor) {
  const todos = useSelector(actor, (state) => state.context.todos);
  const newTitle = useSelector(actor, (state) => state.context.newTodoTitle);
  const isEditMode = useSelector(actor, (state) => state.hasTag("editing"));
  const canAddTodo = useSelector(actor, (state) => state.can(createNewTodo));
  const showDeleteDialog = useSelector(actor, (state) =>
    state.hasTag("deletion-dialog")
  );

  return { todos, newTitle, isEditMode, canAddTodo, showDeleteDialog } as const;
}
