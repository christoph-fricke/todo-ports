import { createEvent, EventFrom } from "xsystem";

export type ConfirmationResult = "confirmed" | "canceled";

export type ConfirmationRequest = {
  title: string;
  message: string;
  onResult: (result: ConfirmationResult) => void;
};

export type ConfirmationContext = {
  request: ConfirmationRequest;
};

export function getInitialContext(): ConfirmationContext {
  return {
    request: {
      title: "",
      message: "",
      onResult: () => void 0,
    },
  };
}

export type ConfirmationEvent =
  | EventFrom<typeof requestConfirmation>
  | EventFrom<typeof cancelConfirmation>
  | EventFrom<typeof confirmConfirmation>;

export const requestConfirmation = createEvent(
  "dialogs.confirmation.request",
  (request: ConfirmationRequest) => ({
    payload: request,
    meta: { created: new Date() },
  })
);

export const cancelConfirmation = createEvent(
  "dialogs.confirmation.cancel"
);
export const confirmConfirmation = createEvent(
  "dialogs.confirmation.confirm"
);
