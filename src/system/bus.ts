import { EventBus, createEventBus } from "xsystem";
import type { NotificationEvent } from "../notifications";
import type { TodoManagerEvent } from "../todos";

type Events = TodoManagerEvent | NotificationEvent;

export type SystemBus = EventBus<Events>;

export function createSystemBus() {
  return createEventBus<Events>();
}
