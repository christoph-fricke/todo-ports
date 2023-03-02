import { useSpawn } from "@xstate/react";
import { ConfirmationDialog } from "./dialogs/confirmation";
import { createNotificationDispatcher } from "./notifications";
import type { SystemBus } from "./system/bus";
import { TodoInPort, TodoPage, useTodoManager } from "./todos";

type AppProps = {
  eventBus: SystemBus;
  todos: TodoInPort;
};

export function App(props: AppProps): JSX.Element {
  useSpawn(createNotificationDispatcher(props.eventBus));
  const todoManager = useTodoManager(props.eventBus, props.todos);

  return (
    <>
      <ConfirmationDialog bus={props.eventBus} />
      <TodoPage todoManager={todoManager} bus={props.eventBus} />
    </>
  );
}
