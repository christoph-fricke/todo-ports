
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.eventBusListener": { type: "done.invoke.eventBusListener"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.eventBusListener": { type: "error.platform.eventBusListener"; data: unknown };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "eventBusListener": "done.invoke.eventBusListener";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "clearConfirmationRequest": "dialogs.confirmation.cancel" | "dialogs.confirmation.confirm" | "xstate.init";
"reportCanceled": "dialogs.confirmation.cancel";
"reportConfirmed": "dialogs.confirmation.confirm";
"storeConfirmationRequest": "dialogs.confirmation.request";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          
        };
        eventsCausingServices: {
          "eventBusListener": "xstate.init";
        };
        matchesStates: "Hidden" | "Visible";
        tags: "hidden" | "visible";
      }
  