import { useInterpret } from "@xstate/react";
import { useMemo } from "react";
import type { SystemBus } from "../../system/bus";
import type { TodoInPort } from "../core/in-ports";
import { createTodoManager, TodoManagerActor } from "./todo-manager";
import {
  changeNewTodoTitle,
  createNewTodo,
  deleteTodo,
  toggleEditing,
  toggleTodo,
  updateTodo,
} from "./todo-manager.model";

export function useTodoManager(
  bus: SystemBus,
  todos: TodoInPort
): TodoManagerActor {
  const actor = useInterpret(createTodoManager({ eventBus: bus, todos }), {
    devTools: import.meta.env.DEV,
  });
  return actor;
}

export function useTodoManagerEvents(actor: TodoManagerActor) {
  const events = useMemo(
    () => ({
      toggleEditing: toggleEditing.createSendCall(actor),
      changeNewTodoTitle: changeNewTodoTitle.createSendCall(actor),
      createNewTodo: createNewTodo.createSendCall(actor),
      toggleTodo: toggleTodo.createSendCall(actor),
      updateTodo: updateTodo.createSendCall(actor),
      deleteTodo: deleteTodo.createSendCall(actor),
    }),
    [actor]
  );

  return events;
}
