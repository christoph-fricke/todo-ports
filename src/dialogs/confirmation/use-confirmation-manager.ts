import { useInterpret, useSelector } from "@xstate/react";
import { useMemo } from "react";
import { createConfirmationManager, EventBusWithConfirmationEvents } from "./confirmation-manager";
import { cancelConfirmation, confirmConfirmation } from "./confirmation-manager.model";

export function useConfirmationManager(bus: EventBusWithConfirmationEvents) {
  const actor = useInterpret(createConfirmationManager({ eventBus: bus }), {
    devTools: import.meta.env.DEV,
  });

  const events = useMemo(
    () => ({
      cancelConfirmation: cancelConfirmation.createSendCall(bus),
      confirmConfirmation: confirmConfirmation.createSendCall(bus),
    }),
    [bus]
  );

  const state = useSelector(actor, (state) => ({
    open: state.hasTag("visible"),
    title: state.context.request.title,
    message: state.context.request.message,
  }));

  return [state, events] as const;
}