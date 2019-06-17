/* create a Twilio Function from this file

name: Flex Join Conference Events Agent to Agent
path /join-conference-events-agent-to-agent

*/

const completeTask = (client, context, taskSid) => {
  return client.taskrouter
    .workspaces(context.TWILIO_WORKSPACE_SID)
    .tasks(taskSid)
    .update({
      assignmentStatus: "wrapping",
      reason: "conference ended"
    });
};

const fetchTask = (client, context, taskSid) => {
  return client.taskrouter
    .workspaces(context.TWILIO_WORKSPACE_SID)
    .tasks(taskSid)
    .fetch();
};

const fetchCall = (client, callSid) => {
  return client.calls(callSid).fetch();
};

const updateTaskAttributes = (client, context, taskSid, attributes) => {
  return client.taskrouter
    .workspaces(context.TWILIO_WORKSPACE_SID)
    .tasks(taskSid)
    .update({
      attributes: JSON.stringify(attributes)
    });
};

const createTask = (client, context, taskSid, to, from, name) => {
  return client.taskrouter
    .workspaces(context.TWILIO_WORKSPACE_SID)
    .tasks.create({
      attributes: JSON.stringify({
        to: to,
        direction: "outbound",
        name: name,
        from: from,
        contact_uri: `client:${to}`,
        autoAnswer: true,
        parentTaskSid: taskSid
      }),
      workflowSid: context.TWILIO_WORKFLOW_SID,
      taskChannel: "custom1",
      timeout: 300
    });
};

exports.handler = function(context, event, callback) {
  const client = context.getTwilioClient();
  const taskSid = event.FriendlyName;
  const callSid = event.CallSid;

  if (event.StatusCallbackEvent === "participant-join") {
    console.log(
      `callSid ${callSid} joined, task is ${taskSid}, conference is ${
        event.ConferenceSid
      }`
    );

    Promise.all([
      fetchTask(client, context, taskSid),
      fetchCall(client, callSid)
    ]).then(values => {
      const attributes = { ...JSON.parse(values[0].attributes) };

      if (`client:${attributes.from}` === values[1].to) {
        // the agent who initiated joined the conference
        console.log(`create task for agent ${attributes.to}`);

        createTask(
          client,
          context,
          taskSid,
          attributes.to,
          attributes.from,
          attributes.name
        )
          .then(task => {
            attributes.conference = {
              sid: event.ConferenceSid,
              participants: {
                worker: event.CallSid
              }
            };

            attributes.childTaskSid = task.sid;

            return updateTaskAttributes(client, context, taskSid, attributes);
          })
          .then(task => {
            console.log(
              `updated task ${taskSid} with new attributes: ${JSON.stringify(
                attributes
              )}`
            );

            callback(null);
          });
      } else {
        console.log(`update task ${taskSid}`);

        attributes.conference.participants.customer = callSid;

        updateTaskAttributes(client, context, taskSid, attributes)
          .then(task => {
            console.log(`update task ${attributes.childTaskSid}`);

            return fetchTask(client, context, attributes.childTaskSid);
          })
          .then(childTask => {
            const childAttributes = { ...JSON.parse(childTask.attributes) };

            childAttributes.conference = {
              sid: event.ConferenceSid,
              participants: {
                worker: callSid,
                customer: attributes.conference.participants.worker
              }
            };

            return updateTaskAttributes(
              client,
              context,
              attributes.childTaskSid,
              childAttributes
            );
          })
          .then(task => callback(null));
      }
    });
  } else if (event.StatusCallbackEvent === "conference-end") {
    console.log(`conference-end event, fetch task ${taskSid}`);

    fetchTask(client, context, taskSid).then(task => {
      const attributes = { ...JSON.parse(task.attributes) };

      console.log(`complete tasks ${attributes.childTaskSid} and ${task.sid}`);

      Promise.all([
        completeTask(client, context, task.sid),
        completeTask(client, context, attributes.childTaskSid)
      ])
        .then(values => {
          callback();
        })
        .catch(error => callback(null, error));
    });
  } else {
    callback();
  }
};
