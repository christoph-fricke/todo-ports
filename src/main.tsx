import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { spawnBehavior } from "xstate";
import { App } from "./app";
import { createSystemBus, SystemBus } from "./system/bus";
import {
  createTodoUseCases,
  createTodoStorage,
  createConfirmation,
  createNotification,
} from "./todos";

declare global {
  // Access to uses cases to control the app from the console.
  // eslint-disable-next-line no-var
  var app: ReturnType<typeof connectPorts>;
}

(async function main() {
  await openInspector();
  const bus = spawnBehavior(createSystemBus(), { id: "SystemBus" });
  const useCases = connectPorts(bus);

  globalThis.app = useCases;

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

function connectPorts(bus: SystemBus) {
  const todoStorage = createTodoStorage(localStorage, "todo-save");
  const confirmations = createConfirmation(bus);
  const notification = createNotification(bus);
  const todos = createTodoUseCases({
    todoStorage,
    confirmations,
    notification,
  });

  return { todos } as const;
}
