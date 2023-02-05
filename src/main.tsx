import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app";
import { createTodoUseCases } from "./todos/core/use-cases/todo-use-cases";
import { createTodoStorage } from "./todos/infrastructure/todo-stroage";

declare global {
  // Access to uses cases to control the app from the console.
  // eslint-disable-next-line no-var
  var useCases: ReturnType<typeof connectPorts>;
}

(function main() {
  const useCases = connectPorts();
  const root = createRoot(document.getElementById("root")!);

  globalThis.useCases = useCases;

  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
})();

function connectPorts() {
  const todoStorage = createTodoStorage(localStorage, "todo-save");
  const todoUseCases = createTodoUseCases({ todoStorage });

  return { todoUseCases } as const;
}
