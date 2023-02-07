import { ReactEventHandler, useEffect, useRef } from "react";

type ConfirmDeletionDialogProps = {
  open: boolean;
  onCancel(): void;
  onConfirm(): void;
};

export function ConfirmDeletionDialog(
  props: ConfirmDeletionDialogProps
): JSX.Element {
  const dialog = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!dialog.current || !props.open) return;

    dialog.current.showModal();
  }, [props.open]);

  const handleClose: ReactEventHandler<HTMLDialogElement> = (e) => {
    if (e.currentTarget.returnValue === "confirm") {
      return props.onConfirm();
    }
    return props.onCancel();
  };

  return (
    <dialog ref={dialog} onClose={handleClose}>
      <form method="dialog">
        <h2>Delete Todo</h2>
        <p>Are you sure that you want to delete the todo?</p>
        <button value="cancel">Cancel</button>
        <button value="confirm">Confirm</button>
      </form>
    </dialog>
  );
}
