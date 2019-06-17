function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export class PhoneControlManager {
  constructor(runtimeDomain, token, identity, fullName) {
    this.runtimeDomain = runtimeDomain;
    this.token = token;
    this.identity = identity;
    this.fullName = fullName;
  }

  create(to) {
    return fetch(`https://${this.runtimeDomain}/initiate-call`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      body: `Name=${encodeURIComponent(this.fullName)}&From=${encodeURIComponent(this.identity)}&To=${encodeURIComponent(to)}&Token=${this.token}`
    })
      .then(response => {
        if (response.ok) {
          return response;
        }
        throw Error(response.statusText);
      })
      .then(response => response.json());
  }

  hold(conferenceSid, participantSid) {
    return fetch(`https://${this.runtimeDomain}/hold-call`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      body: `ConferenceSid=${conferenceSid}&ParticipantSid=${participantSid}&Hold=true&Token=${this.token}`
    })
      .then(response => {
        if (response.ok) {
          return response;
        }
        throw Error(response.statusText);
      })
      .then(response => response.json());
  }

  unhold(conferenceSid, participantSid) {
    return fetch(`https://${this.runtimeDomain}/hold-call`, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      body: `ConferenceSid=${conferenceSid}&ParticipantSid=${participantSid}&Hold=false&Token=${this.token}`
    })
      .then(response => {
        if (response.ok) {
          return response;
        }
        throw Error(response.statusText);
      })
      .then(response => response.json());
  }
}
