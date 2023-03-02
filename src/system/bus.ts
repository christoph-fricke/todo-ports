import { EventBus, createEventBus } from "xsystem";
import type { NotificationEvent } from "../notifications";
import type { TodoManagerEvent } from "../todos";
import type { ConfirmationEvent } from "../dialogs/confirmation";

type Events = TodoManagerEvent | NotificationEvent | ConfirmationEvent;

export type SystemBus = EventBus<Events>;

export function createSystemBus() {
  return createEventBus<Events>();
}
