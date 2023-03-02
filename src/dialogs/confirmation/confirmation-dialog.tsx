import { useInterpret, useSelector } from "@xstate/react";
import { ReactEventHandler, useEffect, useMemo, useRef } from "react";
import {
  ConfirmationManagerDependencies,
  createConfirmationManager,
  EventBusWithConfirmationEvents,
} from "./confirmation-manager";
import {
  cancelConfirmation,
  confirmConfirmation,
} from "./confirmation-manager.model";

function useConfirmationManager(deps: ConfirmationManagerDependencies) {
  const actor = useInterpret(createConfirmationManager(deps), {
    devTools: import.meta.env.DEV,
  });

  const events = useMemo(
    () => ({
      cancelConfirmation: cancelConfirmation.createSendCall(actor),
      confirmConfirmation: confirmConfirmation.createSendCall(actor),
    }),
    [actor]
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
  const [state, events] = useConfirmationManager({ eventBus: props.bus });

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
