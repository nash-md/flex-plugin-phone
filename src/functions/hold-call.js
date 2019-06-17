/* create a Twilio Function from this file 

name: Flex Dialpad Hold Call
path /hold-call

Remove the checkmark from Check for valid Twilio signature

*/

const TokenValidator = require("twilio-flex-token-validator").functionValidator;

exports.handler = TokenValidator(function(context, event, callback) {
  console.log(event);

  const response = new Twilio.Response();
  response.appendHeader("Access-Control-Allow-Origin", "*");
  response.appendHeader("Access-Control-Allow-Methods", "OPTIONS POST");
  response.appendHeader("Content-Type", "application/json");
  response.appendHeader("Access-Control-Allow-Headers", "Content-Type");

  const conferenceSid = event.ConferenceSid;
  const participantSid = event.ParticipantSid;
  const hold = event.Hold;
  if (!conferenceSid || !participantSid || !hold) {
    response.statusCode = 400;
    response.body = "Conference, participant or hold param(s) not set";
    callback(null, response);
  }

  const client = context.getTwilioClient();
  client
    .conferences(conferenceSid)
    .participants(participantSid)
    .update({
      hold: hold
    })
    .then(participant => {
      callback(null, response);
    })
    .catch(error => {
      callback(error);
    });
});
