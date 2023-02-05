import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { spawnBehavior } from "xstate";
import { App } from "./app";
import { createSystemBus } from "./system/bus";
import { createTodoUseCases, createTodoStorage } from "./todos";

declare global {
  // Access to uses cases to control the app from the console.
  // eslint-disable-next-line no-var
  var useCases: ReturnType<typeof connectPorts>;
}

(async function main() {
  await openInspector();
  const useCases = connectPorts();
  const bus = spawnBehavior(createSystemBus(), { id: "SystemBus" });

  globalThis.useCases = useCases;

  const root = createRoot(document.getElementById("root")!);
  root.render(
    <StrictMode>
      <App eventBus={bus} todos={useCases.todos} />
    </StrictMode>
  );
})();

export async function openInspector() {
  if (import.meta.env.PROD) return;

  const { inspect } = await import("@xstate/inspect");
  inspect({ iframe: false, url: "https://stately.ai/viz?inspect" });
}

function connectPorts() {
  const todoStorage = createTodoStorage(localStorage, "todo-save");
  const todos = createTodoUseCases({ todoStorage });

  return { todos } as const;
}
