/* create a Twilio Function from this file

name: Flex Join Conference
path /join-conference

*/

const fetchTask = (client, context, taskSid) => {
  return client.taskrouter
    .workspaces(context.TWILIO_WORKSPACE_SID)
    .tasks(taskSid)
    .fetch();
};

exports.handler = function(context, event, callback) {
  const client = context.getTwilioClient();

  fetchTask(client, context, event.taskSid)
    .then(task => {
      const attributes = { ...JSON.parse(task.attributes) };

      const statusCallbackUrl =
        attributes.to.substr(0, 1) === "+"
          ? "join-conference-events-agent-to-phone"
          : "join-conference-events-agent-to-agent";

      let twiml = new Twilio.twiml.VoiceResponse();

      twiml.dial().conference(
        {
          statusCallback: statusCallbackUrl,
          statusCallbackEvent: "join end",
          endConferenceOnExit: true
        },
        event.taskSid
      );

      callback(null, twiml);
    })
    .catch(error => callback(error));
};
