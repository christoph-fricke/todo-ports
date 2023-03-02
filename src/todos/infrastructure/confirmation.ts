import type { EventBus } from "xsystem";
import type { ConfirmationOutPort } from "../core/out-ports";
import {
  showConfirmationDialogEvent,
  ShowConfirmationDialogEvent,
} from "../../dialogs/confirmation-dialog";

export function createConfirmation(
  bus: EventBus<ShowConfirmationDialogEvent>
): ConfirmationOutPort {
  return {
    requestTodoDeletionConfirmation: (todo) => {
      return new Promise((res) => {
        bus.send(
          showConfirmationDialogEvent({
            title: "Delete Todo",
            message: `Are you sure that you want to delete the todo "${todo.title}"?`,
            onResult: (result) => res({ result }),
          })
        );
      });
    },
  };
}
