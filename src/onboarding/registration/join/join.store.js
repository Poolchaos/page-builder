import {LogManager, computedFrom} from 'aurelia-framework';
import {Dispatcher, handle} from 'aurelia-flux';
import {JOIN_ACTIONS, JOIN_MESSAGES} from './join.actions';
import {ValidationRule} from 'aurelia-validation';
import {ApplicationService} from '../../../_common/services/application.service';

export class JoinStore {

  currentStepName = 'email';
  _email;

  @computedFrom('_email')
  get email() {
    return this._email;
  }

  @handle(JOIN_ACTIONS.SUBMITTED)
  handleJoinEmail(message, email) {
    this._email = email;
  }


 @handle(JOIN_ACTIONS.JOIN_EMAIL)
  handleJoinUserEmail(message, email) {
    this._email = email;
  }


  @handle(JOIN_ACTIONS.JOIN_EMAIL_FAILED)
  handleRegistrationRejected(action, message) {
    this._error = message.response;
  }

  @handle(JOIN_ACTIONS.JOIN_EMAIL_ALREADY_COMPLETED)
  handleRegistrationAlreadyCompleted(action, message) {
    this._error = 'This email address has already been taken.';
  }

  @handle(JOIN_ACTIONS.CLEAR_ERROR)
  handleClearError(action, message) {
    this._error = '';
  }
}
