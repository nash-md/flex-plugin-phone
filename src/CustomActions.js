import { Actions } from "@twilio/flex-ui";
import * as Context from "./Context";

const isOutboundCall = task => {
  return (
    task.taskChannelUniqueName === Context.PHONE_TASK_CHANNEL_NAME &&
    task.attributes.direction === "outbound"
  );
};

export const registerCustomActions = phoneControlManager => {
  Actions.replaceAction("AcceptTask", (payload, original) => {
    const reservation = payload.task.sourceObject;

    console.log(
      `accept task override: channel ${
        payload.task.taskChannelUniqueName
      } direction ${reservation.task.attributes.direction}`
    );

    if (isOutboundCall(payload.task)) {
      const taskSid = reservation.task.attributes.parentTaskSid
        ? reservation.task.attributes.parentTaskSid
        : reservation.task.sid;

      const url = `https://${
        phoneControlManager.runtimeDomain
      }/join-conference?taskSid=${encodeURIComponent(taskSid)}`;

      reservation
        .call(Context.CALLER_ID, url, { accept: true })
        .then(reservation => {
          console.log(`${reservation.sid} accepted`);
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      original(payload);
    }

    return Promise.resolve();
  });

  const toggleHold = (task, hold) => {
    const conferenceSid = task.attributes.conference.sid;
    const participantSid = task.attributes.conference.participants.customer;

    if (hold) {
      return phoneControlManager
        .hold(conferenceSid, participantSid)
        .then(response => console.log("hold complete"))
        .catch(error => console.log(error));
    } else {
      return phoneControlManager
        .unhold(conferenceSid, participantSid)
        .then(response => console.log("unhold complete"))
        .catch(error => console.log(error));
    }
  };

  Actions.replaceAction("HoldCall", (payload, original) => {
    const task = payload.task;

    if (!task.attributes.conference || !isOutboundCall(task)) {
      return original(payload);
    }

    return toggleHold(task, true)
      .then(() => original(payload))
      .catch(error => console.error(error));
  });

  Actions.replaceAction("UnholdCall", (payload, original) => {
    const task = payload.task;

    if (!task.attributes.conference || !isOutboundCall(task)) {
      return original(payload);
    }

    return toggleHold(task, false)
      .then(() => original(payload))
      .catch(error => console.error(error));
  });
};
