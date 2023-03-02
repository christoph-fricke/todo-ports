import { ReactEventHandler, useEffect, useRef, useState } from "react";
import type { BaseActorRef } from "xstate";
import {
  createEvent,
  EventBus,
  EventFrom,
  subscribe,
  unsubscribe,
} from "xsystem";

interface DialogData {
  title: string;
  message: string;
  onResult: (result: "confirmed" | "canceled") => void;
}

export type ShowConfirmationDialogEvent = EventFrom<
  typeof showConfirmationDialogEvent
>;

export const showConfirmationDialogEvent = createEvent(
  "dialogs.confirmation.show",
  (data: DialogData) => ({ payload: data })
);

type ConfirmationDialogProps = {
  bus: EventBus<ShowConfirmationDialogEvent>;
};

export function ConfirmationDialog(
  props: ConfirmationDialogProps
): JSX.Element {
  const dialog = useRef<HTMLDialogElement | null>(null);
  const [data, setData] = useState<DialogData | null>(null);

  useEffect(() => {
    const subscriber: BaseActorRef<ShowConfirmationDialogEvent> = {
      send: (e) => {
        if (!showConfirmationDialogEvent.match(e)) return;
        setData(e.payload);
      },
    };
    props.bus.send(subscribe(subscriber, ["dialogs.confirmation.*"]));
    return () => props.bus.send(unsubscribe(subscriber));
  }, [props.bus]);

  useEffect(() => {
    if (!dialog.current || !data) return;

    dialog.current.showModal();
  }, [data]);

  const handleClose: ReactEventHandler<HTMLDialogElement> = (e) => {
    if (!data) return;

    if (e.currentTarget.returnValue === "confirm") {
      data.onResult("confirmed");
    } else {
      data.onResult("canceled");
    }
    setData(null);
  };

  return (
    <dialog ref={dialog} onClose={handleClose}>
      <form method="dialog">
        <h2>{data?.title}</h2>
        <p>{data?.message}</p>
        <button value="cancel">Cancel</button>
        <button value="confirm">Confirm</button>
      </form>
    </dialog>
  );
}
