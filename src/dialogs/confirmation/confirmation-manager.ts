import { ActorRefFrom, assign, createMachine, StateFrom, t } from "xstate";
import { pure } from "xstate/lib/actions";
import { EventBus, fromActor } from "xsystem";
import {
  ConfirmationContext,
  getInitialContext,
  ConfirmationEvent,
} from "./confirmation-manager.model";

export type EventBusWithConfirmationEvents = EventBus<ConfirmationEvent>;
export type TodoManagerActor = ActorRefFrom<typeof createConfirmationManager>;
export type TodoManagerState = StateFrom<typeof createConfirmationManager>;

export type ConfirmationManagerDependencies = {
  eventBus: EventBusWithConfirmationEvents;
};

export function createConfirmationManager(
  deps: ConfirmationManagerDependencies
) {
  /** @xstate-layout N4IgpgJg5mDOIC5QGED2A7AZgSwE4FsBDAF2wwFlD1CZcA6ACWwgjHQGIJtCAbVKWHQDGGHARJl0dXGACOAVzjEA2gAYAuolAAHVLGykMWkAA9EAZgCMATjoA2ACyq7AJgCsAGhABPRJdUOAL6BXmhYeESG6JTUtHQAatj6AEY8YJzcfALCohESGMJUQmA8appIILr6UcZmCOYu5vaqlm6unj5+1qp0bgDsAByW7sGhueJRMTRg9IkpaRm8-IIi4ROSOWv4ZcZVBpK1Fja91uZ9Hb4ILt101pZO7cEhIOiorPAVYWKRklO0u3p9kYKnUALQuSz2FwDbrtLyXUGWJqWOx9ax2AbnUYgL55SZUab0JgsNgA6oHEGIFx2Ohnfync7wxADHpubG49YUAlxObYVJgMlA9CHBCuHrmVGWTEXRB9JrmBqqKwjJ5AA */
  return createMachine(
    {
      context: getInitialContext(),
      tsTypes: {} as import("./confirmation-manager.typegen").Typegen0,
      predictableActionArguments: true,
      schema: {
        context: t<ConfirmationContext>(),
        events: t<ConfirmationEvent>(),
      },
      id: "ConfirmationManager",
      initial: "Hidden",
      invoke: { src: "eventBusListener", id: "eventBusListener" },
      states: {
        Hidden: {
          tags: "hidden",
          entry: "clearConfirmationRequest",
          on: { "dialogs.confirmation.request": "Visible" },
        },
        Visible: {
          tags: "visible",
          entry: "storeConfirmationRequest",
          on: {
            "dialogs.confirmation.cancel": {
              target: "Hidden",
              actions: "reportCanceled",
            },
            "dialogs.confirmation.confirm": {
              target: "Hidden",
              actions: "reportConfirmed",
            },
          },
        },
      },
    },
    {
      actions: {
        clearConfirmationRequest: assign({
          request: getInitialContext().request,
        }),
        storeConfirmationRequest: assign({
          request: (_, e) => e.payload,
        }),
        reportCanceled: pure(() => ({
          type: "report",
          exec: (ctx) => ctx.request.onResult("canceled"),
        })),
        reportConfirmed: pure(() => ({
          type: "report",
          exec: (ctx) => ctx.request.onResult("confirmed"),
        })),
      },
      services: {
        eventBusListener: fromActor(deps.eventBus, ["dialogs.confirmation.*"]),
      },
    }
  );
}
