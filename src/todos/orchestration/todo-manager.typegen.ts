
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.completeTodo": { type: "done.invoke.completeTodo"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.createTodo": { type: "done.invoke.createTodo"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.deleteTodo": { type: "done.invoke.deleteTodo"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.eventBusListener": { type: "done.invoke.eventBusListener"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.fetchTodos": { type: "done.invoke.fetchTodos"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.reopenTodo": { type: "done.invoke.reopenTodo"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.updateTodo": { type: "done.invoke.updateTodo"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.completeTodo": { type: "error.platform.completeTodo"; data: unknown };
"error.platform.createTodo": { type: "error.platform.createTodo"; data: unknown };
"error.platform.deleteTodo": { type: "error.platform.deleteTodo"; data: unknown };
"error.platform.eventBusListener": { type: "error.platform.eventBusListener"; data: unknown };
"error.platform.fetchTodos": { type: "error.platform.fetchTodos"; data: unknown };
"error.platform.reopenTodo": { type: "error.platform.reopenTodo"; data: unknown };
"error.platform.updateTodo": { type: "error.platform.updateTodo"; data: unknown };
"xstate.init": { type: "xstate.init" };
"xstate.stop": { type: "xstate.stop" };
        };
        invokeSrcNameMap: {
          "completeTodo": "done.invoke.completeTodo";
"createTodo": "done.invoke.createTodo";
"deleteTodo": "done.invoke.deleteTodo";
"eventBusListener": "done.invoke.eventBusListener";
"fetchTodos": "done.invoke.fetchTodos";
"reopenTodo": "done.invoke.reopenTodo";
"updateTodo": "done.invoke.updateTodo";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "appendTodo": "done.invoke.createTodo";
"clearDeletionId": "done.invoke.deleteTodo" | "error.platform.deleteTodo" | "todos.edit.toggle" | "xstate.stop";
"notifyTodoCreated": "done.invoke.createTodo";
"notifyTodoUpdated": "done.invoke.updateTodo";
"removeTodo": "done.invoke.deleteTodo";
"resetNewTitle": "done.invoke.createTodo";
"saveTodo": "done.invoke.completeTodo" | "done.invoke.reopenTodo" | "done.invoke.updateTodo";
"setNewTitle": "todos.new-todo.change-title";
"setTodos": "done.invoke.fetchTodos";
"storeDeletionId": "todos.todo.delete";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "isCompleted": "todos.todo.toggle";
"isTitleValid": "todos.new-todo.create";
        };
        eventsCausingServices: {
          "completeTodo": "todos.todo.toggle";
"createTodo": "todos.new-todo.create";
"deleteTodo": "todos.todo.delete.confirm";
"eventBusListener": "xstate.init";
"fetchTodos": "xstate.init";
"reopenTodo": "todos.todo.toggle";
"updateTodo": "todos.todo.update";
        };
        matchesStates: "Editing" | "Editing.ConfirmingDeletion" | "Editing.CreatingTodo" | "Editing.DeletingTodo" | "Editing.Idle" | "Editing.UpdatingTodo" | "Init" | "LoadingFailed" | "Viewing" | "Viewing.CompletingTodo" | "Viewing.Idle" | "Viewing.ReopeningTodo" | { "Editing"?: "ConfirmingDeletion" | "CreatingTodo" | "DeletingTodo" | "Idle" | "UpdatingTodo";
"Viewing"?: "CompletingTodo" | "Idle" | "ReopeningTodo"; };
        tags: "deletion-dialog" | "editing" | "viewing";
      }
  