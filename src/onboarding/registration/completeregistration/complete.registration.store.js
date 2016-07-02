import {Router}from 'aurelia-router';
import {LogManager, computedFrom} from 'aurelia-framework';
import {Dispatcher, handle} from 'aurelia-flux';
import {COMPLETE_REGISTRATION_ACTIONS, COMPLETE_REGISTRATION_MESSAGES} from './complete.registration.actions';
import {UniqueUsernameValidationRule} from './complete.registration.validation';
import {ValidationRule} from 'aurelia-validation';
import {ApplicationService} from '../../../_common/services/application.service';

const logger = LogManager.getLogger('ApplicationProperties');

export class CompleteRegistrationStore {

  currentStepName = 'firstName';
  _firstName;
	_surname;
  _password = '';
  _confirmPassword;
  _submitted;
	token;
  validateTerms;
  error;
  email;

  @computedFrom('_firstName')
  get firstName() {
    return this._firstName;
  }

	@computedFrom('_surname')
  get surname() {
    return this._surname;
  }

  @computedFrom('_password')
  get password() {
    return this._password;
  }

  @computedFrom('_confirmPassword')
  get confirmPassword() {
    return this._confirmPassword;
  }

  @computedFrom('validateTerms')
  get submitted() {
    return this.validateTerms;
  }

  @computedFrom('_submitted')
  get submitted() {
    return this._submitted;
  }

  set submitted(submitted) {
    this._submitted = submitted;
  }

  @handle(COMPLETE_REGISTRATION_ACTIONS.REGISTER_FIRST_NAME)
    handleRegisterName(message, firstName) {
      this._firstName = firstName;
    }

   @handle(COMPLETE_REGISTRATION_ACTIONS.REGISTER_SURNAME)
    handleRegisterName(message, surname) {
      this._surname = surname;
    }

   @handle(COMPLETE_REGISTRATION_ACTIONS.REGISTER_PASSWORD)
  handleRegisterPassword(message, password) {
    this._password = password;
  }

  @handle(COMPLETE_REGISTRATION_ACTIONS.REGISTER_CONFIRM_PASSWORD)
  handleRegisterConfirmPassword(message, confirmPassword) {
    this._confirmPassword = confirmPassword;
  }

  @handle(COMPLETE_REGISTRATION_ACTIONS.VALIDATE_TERMS)
  handleRegisterConfirmPassword(message, validateTerms) {
    this.validateTerms = validateTerms;
    this.error = null;
  }
  @handle(COMPLETE_REGISTRATION_ACTIONS.VALIDATE_TERMS_ERROR)
  handleTerms(message, validateTerms) {
    this.error = 'Please accept the Terms and Conditions.';
  }

  @handle(COMPLETE_REGISTRATION_ACTIONS.SET_TOKEN)
  handleRegisterSetToken(message, token) {
    this.token = token;
  }

  @handle(COMPLETE_REGISTRATION_ACTIONS.SET_REGISTRATION_ID)
  handleSetRegisterId(message, userRegistrationId) {
    this.userRegistrationId = userRegistrationId;
  }

 @handle(COMPLETE_REGISTRATION_ACTIONS.SET_INVITATION_ID)
  handleSetInvitationId(message, invitationId) {
    this.invitationId = invitationId;
  }

  @handle(COMPLETE_REGISTRATION_ACTIONS.SUBMITTED)
  handleRegistrationSubmitted() {
    this._submitted = true;

  }

  @handle(COMPLETE_REGISTRATION_ACTIONS.COMPLETED)
  handleRegistrationCompleted(action, response) {
    this.email = response.state.email;
  }

  @handle(COMPLETE_REGISTRATION_ACTIONS.REJECTED)
  handleRegistrationRejected(action, message) {
    this._error = message.errors[0];
  }

  @handle(COMPLETE_REGISTRATION_ACTIONS.SET_CURRENT_STEP_NAME)
  handleSetCurrentStepName(action, stepName) {
    this.currentStepName = stepName;
  }

  @handle(COMPLETE_REGISTRATION_ACTIONS.CAPS_LOCK_ERROR)
  handleCapslockError(action, message) {
    this.capsError = message;
  }

  @handle(COMPLETE_REGISTRATION_ACTIONS.CLEAR_ERROR)
  handleClearError(action, stepName) {
    this.capsError = '';
  }
}
