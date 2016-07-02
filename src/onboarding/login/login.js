import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher, handle, waitFor} from 'aurelia-flux';

import {LOGIN_ACTIONS} from './login.actions';
import {LoginService} from './login.service';
import {LoginStore} from './login.store';
import {Router} from 'aurelia-router';
import {Validation} from 'aurelia-validation';
import {UserSession} from '../../_common/stores/user.session';

const logger : Logger = LogManager.getLogger('Login');

@inject(LoginService, LoginStore, Validation, Router, UserSession, Dispatcher)
export class Login {

  constructor(loginService, loginStore, validation, router, userSession, dispatcher) {

    this.loginService = loginService;
    this.loginStore = loginStore;
    this.validation = validation;
    this.router = router;
    this.userSession = userSession;
  }

  activate(params) {

    this.loginStore.identity = params.email ? params.email : '';
    this.openDoor();

    this.loginService.enableCapslockOnPasswordDetection();

    this.loginStore.password = ''; // TODO should not be able to set store properties

    this.validation = this.validation.on(this)
      .ensure('loginStore.identity').isNotEmpty().withMessage('Please enter your email.')
      .ensure('loginStore.password').isNotEmpty().withMessage('Please enter your password.');
  }

  deactivate() {

    this.loginService.disableCapslockOnPasswordDetection();
  }

  attached() {

    setTimeout(() => {

      this.setFocus();
    }, 500);
  }

  setFocus() {

    let firstElement = document.getElementById('email');

    if (this.loginStore.identity && this.loginStore.identity.length > 0) {
      firstElement = document.getElementById('password');
    }

    if (firstElement !== null) {
      firstElement.focus();
    } else {

      setTimeout(() => {

        this.setFocus();
      }, 100);
    }
  }

  forgotPassword(){
    
    this.router.navigate('password');
  }
  
  submit() {

    logger.debug('this.submitted = ', this.submitted);

    if (this.submitted) { // this should stop multiple submitions
      return;
    }

    this.submitted = true;

    this.validation.validate()
      .then(() => this.loginService.submitLogin(this.loginStore.identity, this.loginStore.password))
      .catch(error => {

        this.submitted = false;
      });
  }

  openDoor() {
    return new Promise(resolve => setTimeout(() => resolve(), 1000));
  }

  navTo() {
    this.router.navigate('join');
  }

  clearError(event) {

    let enterKeyCode = 13;
    if (event.keyCode !== enterKeyCode) {
      let error = null;
      this.loginService.setError(error);
    }
  }

  @handle(LOGIN_ACTIONS.LOGIN_FAILED)
  handleLoginFailed() {

    this.submitted = false;
  }

  @handle(LOGIN_ACTIONS.LOGIN_PASSED)
  @waitFor(LoginStore)
  handleLoginPassed() {

    if (this.userSession.isAdminRole) {

      this.router.navigate('hud/dashboard/organisation');
      return;
    } else if (this.userSession.isTeamLeaderRole) {

      this.router.navigate('hud/dashboard/teamleader');
      return;
    } else if (this.userSession.isOfficeEmployeeRole) {

      this.router.navigate('hud/dashboard/members');
      return;
    } else if (this.userSession.isAgentRole) {

      this.router.navigate('hud/dashboard/agent');
      return;
    } else if (this.userSession.isQAManagerRole || this.userSession.isQARole) {

        this.router.navigate('hud/dashboard/qualityassessor');
        return;
    }

    this.router.navigate('hud');
  }
}
