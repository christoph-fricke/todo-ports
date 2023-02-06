import type { SystemBus } from "./system/bus";
import { TodoInPort, TodoPage, useTodoManager } from "./todos";

type AppProps = {
  eventBus: SystemBus;
  todos: TodoInPort;
};

export function App(props: AppProps): JSX.Element {
  const todoManager = useTodoManager(props.eventBus, props.todos);

  return <TodoPage todoManager={todoManager} bus={props.eventBus} />;
}
