import { useInterpret, useSelector } from "@xstate/react";
import { ReactEventHandler, useEffect, useMemo, useRef } from "react";
import {
  createConfirmationManager,
  EventBusWithConfirmationEvents,
} from "./confirmation-manager";
import {
  cancelConfirmation,
  confirmConfirmation,
} from "./confirmation-manager.model";

function useConfirmationManager(bus: EventBusWithConfirmationEvents) {
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

type ConfirmationDialogProps = {
  bus: EventBusWithConfirmationEvents;
};

export function ConfirmationDialog(
  props: ConfirmationDialogProps
): JSX.Element {
  const dialog = useRef<HTMLDialogElement | null>(null);
  const [state, events] = useConfirmationManager(props.bus);

  useEffect(() => {
    if (!dialog.current || !state.open) return;

    dialog.current.showModal();
  }, [state.open]);

  const handleClose: ReactEventHandler<HTMLDialogElement> = (e) => {
    if (e.currentTarget.returnValue === "confirm") {
      return events.confirmConfirmation();
    }
    return events.cancelConfirmation();
  };

  return (
    <dialog ref={dialog} onClose={handleClose}>
      <form method="dialog">
        <h2>{state.title}</h2>
        <p>{state.message}</p>
        <button value="cancel">Cancel</button>
        <button value="confirm">Confirm</button>
      </form>
    </dialog>
  );
}
