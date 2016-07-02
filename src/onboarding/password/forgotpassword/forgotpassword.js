import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {handle, Dispatcher} from 'aurelia-flux';
import {Validation} from 'aurelia-validation';
import {PasswordService} from '../password.service';
import {PasswordStore} from '../password.store';
import {PASSWORD_ACTIONS} from '../password.actions';

const logger : Logger = LogManager.getLogger('ForgotPassword');

@inject(Router, PasswordService, PasswordStore, Validation, Dispatcher)
export class ForgotPassword {

  submitEnabled = true;

  constructor(router, passwordService, passwordStore, validation, dispatcher) {

    this.router = router;
    this.passwordService = passwordService;
    this.passwordStore = passwordStore;
    this.validation = validation;
    this.dispatcher = dispatcher;
  }

  activate() {

    this.passwordStore.reset();
    this.validation = this.validation.on(this)
      .ensure('passwordStore.email').isNotEmpty().withMessage('Please enter your email.').isEmail().withMessage('Your email must contain @ and a full stop.')
    ;
  }

  attached() {

    setTimeout(() => {

      this.setFocus();
    }, 500);
  }

  setFocus() {

    let fisrtElement = document.getElementById('email');
    if (fisrtElement !== null) {
      fisrtElement.focus();
    } else {

      setTimeout(() => {

        this.setFocus();
      }, 100);
    }
  }

  submit() {

    //    this.submitEnabled = false; // dispatcher is to slow
    /*    if (this.submitted) {
          return;
        }*/

    this.validation.validate()
      .then(() => {
        this.passwordService.requestPasswordReset(this.passwordStore.email);
        this.submitted = true;
      })
      .catch(error => logger.debug(error))
    ;
  }

  @handle(PASSWORD_ACTIONS.RESET_PASSWORD_FAILED)
  handlePasswordResetFailed() {
    this.router.navigate('emailsubmitted');
    //this.submitted = false;
  }

  @handle(PASSWORD_ACTIONS.RESET_PASSWORD_REQUESTED)
  handleResetPasswordRequested() {
    this.router.navigate('emailsubmitted');
  }
}
