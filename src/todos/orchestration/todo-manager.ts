import {
  ActorRefFrom,
  assign,
  createMachine,
  send,
  StateFrom,
  t,
} from "xstate";
import { EventBus, fromActor } from "xsystem";
import { NotificationEvent, notifyUserEvent } from "../../notifications";
import { isTitleValid, isTodoCompleted, Todo } from "../core/domain/todo";
import type { TodoInPort } from "../core/in-ports";
import {
  getInitialContext,
  TodoManagerEvent,
  TodoMangerContext,
} from "./todo-manager.model";

export type EventBusWithTodoEvents = EventBus<
  TodoManagerEvent | NotificationEvent
>;
export type TodoManagerActor = ActorRefFrom<typeof createTodoManager>;
export type TodoManagerState = StateFrom<typeof createTodoManager>;

export type TodoManagerDependencies = {
  eventBus: EventBusWithTodoEvents;
  todos: TodoInPort;
};

export function createTodoManager(deps: TodoManagerDependencies) {
  return createMachine(
    {
      context: getInitialContext(),
      tsTypes: {} as import("./todo-manager.typegen").Typegen0,
      predictableActionArguments: true,
      schema: {
        context: t<TodoMangerContext>(),
        events: t<TodoManagerEvent>(),
        services: t<{
          fetchTodos: { data: Todo[] };
          completeTodo: { data: Todo };
          reopenTodo: { data: Todo };
          createTodo: { data: Todo };
          updateTodo: { data: Todo };
          deleteTodo: { data: Todo["id"] };
        }>(),
      },
      id: "TodoManager",
      initial: "Init",
      invoke: { src: "eventBusListener", id: "eventBusListener" },
      states: {
        Init: {
          invoke: {
            src: "fetchTodos",
            id: "fetchTodos",

            onDone: {
              target: "Viewing",
              actions: "setTodos",
            },

            onError: "LoadingFailed",
          },
        },
        LoadingFailed: {},
        Viewing: {
          tags: ["viewing"],
          initial: "Idle",
          on: { "todos.edit.toggle": "Editing" },
          states: {
            Idle: {
              on: {
                "todos.todo.toggle": [
                  { target: "ReopeningTodo", cond: "isCompleted" },
                  "CompletingTodo",
                ],
              },
            },
            CompletingTodo: {
              invoke: {
                src: "completeTodo",
                id: "completeTodo",
                onDone: { target: "Idle", actions: ["saveTodo"] },
                onError: "Idle",
              },
            },
            ReopeningTodo: {
              invoke: {
                src: "reopenTodo",
                id: "reopenTodo",
                onDone: { target: "Idle", actions: ["saveTodo"] },
                onError: "Idle",
              },
            },
          },
        },
        Editing: {
          tags: ["editing"],
          initial: "Idle",
          on: { "todos.edit.toggle": "Viewing" },
          states: {
            Idle: {
              on: {
                "todos.new-todo.change-title": {
                  target: "Idle",
                  actions: "setNewTitle",
                },
                "todos.new-todo.create": {
                  target: "CreatingTodo",
                  cond: "isTitleValid",
                },
                "todos.todo.delete": "ConfirmingDeletion",
                "todos.todo.update": "UpdatingTodo",
              },
            },
            CreatingTodo: {
              invoke: {
                src: "createTodo",
                id: "createTodo",
                onDone: {
                  target: "Idle",
                  actions: ["appendTodo", "resetNewTitle", "notifyTodoCreated"],
                },
                onError: "Idle",
              },
            },
            ConfirmingDeletion: {
              tags: "deletion-dialog",
              entry: "storeDeletionId",
              on: {
                "todos.todo.delete.cancel": "Idle",
                "todos.todo.delete.confirm": "DeletingTodo",
              },
            },
            DeletingTodo: {
              exit: "clearDeletionId",
              invoke: {
                src: "deleteTodo",
                id: "deleteTodo",
                onDone: { target: "Idle", actions: "removeTodo" },
                onError: "Idle",
              },
            },
            UpdatingTodo: {
              invoke: {
                src: "updateTodo",
                id: "updateTodo",
                onDone: {
                  target: "Idle",
                  actions: ["saveTodo", "notifyTodoUpdated"],
                },
                onError: "Idle",
              },
            },
          },
        },
      },
    },
    {
      guards: {
        isCompleted: (ctx, e) => {
          const todo = ctx.todos.find((t) => t.id === e.payload.id);
          if (!todo) return false;
          return isTodoCompleted(todo);
        },
        isTitleValid: (ctx) => isTitleValid(ctx.newTodoTitle),
      },
      actions: {
        setNewTitle: assign({ newTodoTitle: (_, e) => e.payload.title }),
        resetNewTitle: assign({ newTodoTitle: "" }),
        storeDeletionId: assign({ deletionId: (_, e) => e.payload.id }),
        clearDeletionId: assign({ deletionId: null }),
        setTodos: assign({ todos: (_, e) => e.data }),
        appendTodo: assign({ todos: (ctx, e) => ctx.todos.concat(e.data) }),
        saveTodo: assign({
          todos: (ctx, e) =>
            ctx.todos.map((t) => (t.id === e.data.id ? e.data : t)),
        }),
        removeTodo: assign({
          todos: (ctx, e) => ctx.todos.filter((t) => t.id !== e.data),
        }),
        notifyTodoCreated: send(notifyUserEvent("success", "Todo Created."), {
          to: deps.eventBus,
        }),
        notifyTodoUpdated: send(notifyUserEvent("success", "Todo Updated."), {
          to: deps.eventBus,
        }),
      },
      services: {
        eventBusListener: fromActor(deps.eventBus, ["todos.*"]),
        fetchTodos: () => deps.todos.fetchAllTodos(),
        createTodo: (ctx) => deps.todos.addTodo(ctx.newTodoTitle),
        updateTodo: (_, e) =>
          deps.todos.editTodo(e.payload.id, e.payload.title),
        completeTodo: (_, e) => deps.todos.completeTodo(e.payload.id),
        reopenTodo: (_, e) => deps.todos.reopenTodo(e.payload.id),
        deleteTodo: async (ctx) => {
          if (!ctx.deletionId) {
            throw new Error("Called without an deletion Id.");
          }

          await deps.todos.removeTodo(ctx.deletionId);
          return ctx.deletionId;
        },
      },
    }
  );
}
