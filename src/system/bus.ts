import { EventBus, createEventBus } from "xsystem";
import type { NotificationEvent } from "../notifications";
import type { TodoManagerEvent } from "../todos";
import type { ShowConfirmationDialogEvent } from "../dialogs/confirmation-dialog";

type Events = TodoManagerEvent | NotificationEvent | ShowConfirmationDialogEvent;

export type SystemBus = EventBus<Events>;

export function createSystemBus() {
  return createEventBus<Events>();
}
