import { Actions } from "@twilio/flex-ui";
import * as Context from "./Context";

export const registerCustomTaskChannel = flex => {
  const channel = flex.DefaultTaskChannels.createCallTaskChannel(
    Context.PHONE_TASK_CHANNEL_NAME,
    task => task.taskChannelUniqueName === Context.PHONE_TASK_CHANNEL_NAME
  );

  flex.TaskChannels.register(channel);
};
