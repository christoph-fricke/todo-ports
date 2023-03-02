import type { EventBus } from "xsystem";
import type { ConfirmationOutPort } from "../core/out-ports";
import { ConfirmationEvent, requestConfirmation } from "../../dialogs/confirmation";

export function createConfirmation(
  bus: EventBus<ConfirmationEvent>
): ConfirmationOutPort {
  return {
    requestTodoDeletionConfirmation: (todo) => {
      return new Promise((res) => {
        bus.send(
          requestConfirmation({
            title: "Delete Todo",
            message: `Are you sure that you want to delete the todo "${todo.title}"?`,
            onResult: (result) => res({ result }),
          })
        );
      });
    },
  };
}
