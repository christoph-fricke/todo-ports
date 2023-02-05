import { EventBus, createEventBus } from "xsystem";
import type { TodoManagerEvent } from "../todos";

export type SystemBus = EventBus<TodoManagerEvent>;

export function createSystemBus() {
  return createEventBus<TodoManagerEvent>();
}