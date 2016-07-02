import {Validation} from 'aurelia-validation';
import {inject, LogManager} from 'aurelia-framework';
import {handle, Dispatcher} from 'aurelia-flux';
import {Router} from 'aurelia-router';
import {PasswordService} from '../password.service';
import {PasswordStore} from '../password.store';
import {PASSWORD_ACTIONS} from '../password.actions';
import {EncryptTools} from 'zailab.common';

const logger : Logger = LogManager.getLogger('ResetPassword');

@inject(PasswordService, PasswordStore, Validation, Router, Dispatcher)
export class ResetPassword {

  passportId;

  constructor(passwordService, passwordStore, validation, router, dispatcher) {

    this.passwordService = passwordService;
    this.passwordStore = passwordStore;
    this.validation = validation;
    this.router = router;
    this.dispatcher = dispatcher;
  }

  activate(params) {

    this.passportId = params.passportId;
    this.passwordService.enableCapslockOnPasswordDetection();
    this.validation = this.validation.on(this)
      .ensure('passwordStore.confirmPassword', config => {
        config.computedFrom(['passwordStore.password']);
      })
      .isNotEmpty().withMessage('Is required field.')
      .ensure('passwordStore.password')
      .isNotEmpty().withMessage('Is required field.').hasLengthBetween(8, 50).withMessage('Needs to be between 8 and 50 characters long.').containsNoSpaces().isStrongPassword().withMessage('Should contain at least 3 of the following groups: lowercase letters, uppercase letters, digits or special characters.')
      .ensure('passwordStore.confirmPassword')
        .isEqualTo(() => {
          return this.passwordStore.password;
        }, 'the entered password').withMessage('Does not match the entered password.');

    setTimeout(() => {

      this.setFocus();
    }, 200);
  }

  deactivate() {
    this.passwordService.disableCapslockOnPasswordDetection();
  }

  setFocus() {

    let fisrtElement = document.getElementById('password');
    if (fisrtElement !== null) {
      fisrtElement.focus();
    } else {

      setTimeout(() => {

        this.setFocus();
      }, 100);
    }
  }

  submit() {

    var encryptedPassword = EncryptTools.encrypt(this.passwordStore.password);

    this.validation.validate()
      .then(() => this.passwordService.submitPasswordReset(encryptedPassword, this.passportId))
      .catch(error => logger.debug(error))
    ;
  }

  @handle(PASSWORD_ACTIONS.RESET_PASSWORD_COMPLETED)
  handleResetPasswordCompleted() {
    this.router.navigate('login');
  }
}
