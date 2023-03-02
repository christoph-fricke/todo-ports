import type { EventBus } from "xsystem";
import { NotificationEvent, notifyUserEvent } from "../../notifications";
import type { NotificationOutPort } from "../core/out-ports";

export function createNotification(
  bus: EventBus<NotificationEvent>
): NotificationOutPort {
  return {
    notifyTodoCreation: async () => {
      bus.send(notifyUserEvent("success", "Todo Created."));
    },

    notifyTodoUpdate: async () => {
      bus.send(notifyUserEvent("success", "Todo Updated."));
    },
  };
}
