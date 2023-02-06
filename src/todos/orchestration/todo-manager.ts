import { ActorRefFrom, assign, createMachine, StateFrom, t } from "xstate";
import { EventBus, fromActor } from "xsystem";
import { isTitleValid, isTodoCompleted, Todo } from "../core/domain/todo";
import type { TodoInPort } from "../core/in-ports";
import {
  getInitialContext,
  TodoManagerEvent,
  TodoMangerContext
} from "./todo-manager.model";

export type EventBusWithTodoEvents = EventBus<TodoManagerEvent>;
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
                "todos.todo.delete": "DeletingTodo",
                "todos.todo.update": "UpdatingTodo",
              },
            },
            CreatingTodo: {
              invoke: {
                src: "createTodo",
                id: "createTodo",
                onDone: {
                  target: "Idle",
                  actions: ["appendTodo", "resetNewTitle"],
                },
                onError: "Idle",
              },
            },
            DeletingTodo: {
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
                onDone: { target: "Idle", actions: "saveTodo" },
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
        setNewTitle: assign({ newTodoTitle: (ctx, e) => e.payload.title }),
        resetNewTitle: assign({ newTodoTitle: (ctx, e) => "" }),
        setTodos: assign({ todos: (ctx, e) => e.data }),
        appendTodo: assign({ todos: (ctx, e) => ctx.todos.concat(e.data) }),
        saveTodo: assign({
          todos: (ctx, e) =>
            ctx.todos.map((t) => (t.id === e.data.id ? e.data : t)),
        }),
        removeTodo: assign({
          todos: (ctx, e) => ctx.todos.filter((t) => t.id !== e.data),
        }),
      },
      services: {
        eventBusListener: fromActor(deps.eventBus, ["todos.*"]),
        fetchTodos: () => deps.todos.fetchAllTodos(),
        createTodo: (ctx) => deps.todos.addTodo(ctx.newTodoTitle),
        updateTodo: (ctx, e) =>
          deps.todos.editTodo(e.payload.id, e.payload.title),
        completeTodo: (ctx, e) => deps.todos.completeTodo(e.payload.id),
        reopenTodo: (ctx, e) => deps.todos.reopenTodo(e.payload.id),
        deleteTodo: async (ctx, e) => {
          await deps.todos.removeTodo(e.payload.id);
          return e.payload.id;
        },
      },
    }
  );
}
