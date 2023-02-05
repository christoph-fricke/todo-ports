import type { SystemBus } from "./system/bus";
import { TodoInPort, useTodoManager } from "./todos";

type AppProps = {
  eventBus: SystemBus;
  todos: TodoInPort;
};

export function App(props: AppProps): JSX.Element {
  useTodoManager(props.eventBus, props.todos);


  return (
    <main>
      <h1>Todos</h1>
    </main>
  );
}
