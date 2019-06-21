/* create a Twilio Function from this file

name: Flex Phone Initiate Call
path /initiate-call

Remove the checkmark from Check for valid Twilio signature

*/

const TokenValidator = require("twilio-flex-token-validator").functionValidator;

exports.handler = TokenValidator(function(context, event, callback) {
  let client = context.getTwilioClient();

  const response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST");
  response.appendHeader("Content-Type", "application/json");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

  client.taskrouter
    .workspaces(context.TWILIO_WORKSPACE_SID)
    .tasks.create({
      attributes: JSON.stringify({
        to: event.To,
        direction: "outbound",
        name: event.Name,
        from: event.From,
        contactUri: event.From,
        autoAnswer: true
      }),
      workflowSid: context.TWILIO_WORKFLOW_SID,
      taskChannel: "custom1",
      timeout: 30
    })
    .then(task => {
      response.setBody({ sid: task.sid });
      callback(null, response);
    })
    .catch(error => {
      console.log(error);
      callback(error);
    });
});
