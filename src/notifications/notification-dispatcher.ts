import type { Behavior } from "xstate";
import { createEvent, EventBus, EventFrom, withSubscription } from "xsystem";

type NotificationType = "success" | "error";

export type NotificationEvent = EventFrom<typeof notifyUserEvent>;

export const notifyUserEvent = createEvent(
  "notifications.user.notify",
  (type: NotificationType, message: string) => ({ payload: { type, message } })
);

export function createNotificationDispatcher(
  bus: EventBus<NotificationEvent>
): Behavior<NotificationEvent, null> {
  return withSubscription(
    {
      initialState: null,
      transition: (state, event, ctx) => {
        if (!notifyUserEvent.match(event)) return state;

        if (!window.Notification || Notification.permission === "denied") {
          alert(`${event.payload.type}: ${event.payload.message}`);
          console.log('Called')
          return state;
        }

        if (Notification.permission === "granted") {
          new Notification(event.payload.type, {
            body: event.payload.message,
          });
          return state;
        }

        Notification.requestPermission().finally(() => {
          ctx.self.send(event);
        });

        return state;
      },
    },
    bus,
    ["notifications.*"]
  );
}
