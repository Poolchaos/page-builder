import {handle} from 'aurelia-flux';
import {PASSWORD_ACTIONS} from './password.actions';

export class PasswordStore {

  email;
  password;
  confirmPassword;
  submitted;
  message;
  error;

  reset() {
    this.submitted = false;
  }

  @handle(PASSWORD_ACTIONS.REQUEST_RESET_PASSWORD)
  handleRequestPasswordReset() {
    this.submitted = true;
  }

  @handle(PASSWORD_ACTIONS.RESET_PASSWORD_FAILED)
  handlePasswordResetFailed() {
    this.submitted = false;
    this.error = 'Something went wrong... I could not find your email! Please revise your input.';
  }

  @handle(PASSWORD_ACTIONS.RESET_PASSWORD_REQUESTED)
  handlePasswordResetRequested() {

    this.message = 'You should have received an email, see you soon!';
  }

  @handle(PASSWORD_ACTIONS.CAPS_LOCK_ERROR)
  handleCapsLockErrorOnForgot(action, message) {
    this.capsError = message;
  }

  @handle(PASSWORD_ACTIONS.CLEAR_ERROR)
  handleClearErrorOnForgot() {
    this.capsError = '';
  }
}
