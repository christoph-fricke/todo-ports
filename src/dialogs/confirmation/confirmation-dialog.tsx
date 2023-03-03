import { ReactEventHandler, useEffect, useRef } from "react";
import type { EventBusWithConfirmationEvents } from "./confirmation-manager";
import { useConfirmationManager } from "./use-confirmation-manager";

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
