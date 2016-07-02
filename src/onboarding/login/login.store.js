import {inject} from 'aurelia-framework';
import {handle, Dispatcher}from 'aurelia-flux';
import {LOGIN_ACTIONS} from './login.actions';

@inject(Dispatcher)
export class LoginStore {

  identity;
  password;
  submitted;
  error;
  navigateToHud;

  constructor(dispatcher) {

    this.dispatcher = dispatcher;
  }

  @handle(LOGIN_ACTIONS.LOGIN_SUBMITTED)
  handleLoginSubmitted(message, user) {
    this.submitted = true;
  }  

  @handle(LOGIN_ACTIONS.SET_ERROR)
  handleSetError(message, error) {
    this.error = error;
  }

  @handle(LOGIN_ACTIONS.CAPS_LOCK_ERROR)
  handleCapsLockError(action, message) {
    this.capsError = message;
  }

  @handle(LOGIN_ACTIONS.CLEAR_ERROR)
  handleClearError() {
    this.capsError = '';
  }

  @handle(LOGIN_ACTIONS.LOGIN_PASSED)
  handlePassLogin(message, login) {
    this.navigateToHud = false;
    if (login.userAccessRoles && login.userAccessRoles.length > 0) {
      for (var role in login.userAccessRoles) {
        var currentRole = login.userAccessRoles[role];
        if (currentRole.roleName === 'DEFAULT USER' || currentRole.roleName === 'Team Leader') {
          this.navigateToHud = true;
          return;
        }
      }
    }
  }

  @handle(LOGIN_ACTIONS.LOGIN_FAILED)
  handleLoginFailed() {
    this.submitted = false;
    // TODO: Create custom validation rule
    this.error = 'Email or password is incorrect. Please try again.';
  }

}
