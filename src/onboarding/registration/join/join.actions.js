export const JOIN_MESSAGES = {
  ROOT: 'registration',
  COMMANDS: {
    REGISTER: 'com.zailab.user.registration.api.commands.SubmitRegistrationCommand'
  },
  EVENTS: {
    ACCEPTED: 'com.zailab.user.userregistration.api.events.RegistrationAcceptedEvent',
    REJECTED: 'com.zailab.user.userregistration.api.events.RegistrationRejectedEvent',
    VALIDATION: 'com.zailab.common.validation.ValidationEvent'
  }
};

export const JOIN_ACTIONS = {
  JOIN_EMAIL: 'join.email',
  JOIN_EMAIL_SENT: 'join.email.sent',
  JOIN_EMAIL_FAILED: 'join.email.failed',
  JOIN_EMAIL_ALREADY_COMPLETED: 'join.completed',
  TRUST_IDENTITY: 'invite.trust.identity',
  REQUIRE_IDENTITY_CONFIRMATION: 'invite.require.identity.confirmation',
  CLEAR_ERROR: 'clear.error.message'
};

