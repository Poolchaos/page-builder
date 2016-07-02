export const COMPLETE_REGISTRATION_MESSAGES = {
  ROOT: 'registration',
  COMMANDS: {
    REGISTER: 'com.zailab.user.userregistration.api.commands.SubmitUserRegistrationCommand'
  },
  EVENTS: {
    ACCEPTED: 'com.zailab.user.userregistration.api.events.UserRegistrationAcceptedEvent',
    REJECTED: 'com.zailab.user.userregistration.api.events.UserRegistrationRejectedEvent',
    VALIDATION: 'com.zailab.common.validation.ValidationEvent'
  }
};

export const COMPLETE_REGISTRATION_ACTIONS = {
  SUBMIT: 'registration.submit',
  SUBMITTED: 'registration.submitted',
  ACCEPTED: 'registration.accepted',
  REJECTED: 'registration.rejected',
  COMPLETED: 'registration.completed',

  REGISTER_FIRST_NAME: 'register.first.name',
  REGISTER_SURNAME: 'register.surname',
  REGISTER_CONFIRM_PASSWORD: 'register.confirm.password',

  CLEAR_FIELDS: 'clear.fields',
  SET_CURRENT_STEP_NAME: 'set.current.step.name',
  SET_TOKEN: 'set.registration.token',
  SET_REGISTRATION_ID: 'set.registration.id',

  NAVIGATE_TO_REGISTER: 'navigate.to.register',
  NAVIGATE_TO_ERROR: 'navigate.to.error',

  VALIDATE_TERMS: 'validate.terms',
  VALIDATE_TERMS_ERROR: 'validate.terms.error',
  
  CAPS_LOCK_ERROR: 'complete.registration.error.capslock.put',
  CLEAR_ERROR: 'complete.registration.error.capslock.clear'
};
