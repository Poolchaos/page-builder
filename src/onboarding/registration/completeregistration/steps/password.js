import {inject}from 'aurelia-framework';
import {ensure, Validation}from 'aurelia-validation';
import {Dispatcher, handle}from 'aurelia-flux';
import {CompleteRegistrationStore}from '../complete.registration.store';
import {COMPLETE_REGISTRATION_ACTIONS}from '../complete.registration.actions';
/*
*/
import {WindowService} from 'zailab.common';
/*
*/
@inject(Validation, Dispatcher, CompleteRegistrationStore, WindowService)
export class CompleteRegistrationPassword {

  password = '';
  confirmPassword = '';
  termsValidate;

  constructor(validation, dispatcher, completeRegistrationStore, windowService) {
    
    this.windowService = windowService;
    
    this.completeRegistrationStore = completeRegistrationStore;
    this.dispatcher = dispatcher;
    this.focusClass = 'autofocus';

    this.validation = validation.on(this)
		.ensure('completeRegistrationStore._confirmPassword', config => {
      config.computedFrom(['completeRegistrationStore._password']);
    })
    .isNotEmpty().withMessage('Please retype your password.')
    .ensure('completeRegistrationStore._password')
    .isNotEmpty().withMessage('Please enter your password.').hasLengthBetween(8, 50).withMessage('Must be between 8 and 50 characters long.').containsNoSpaces().withMessage('Password cannot contain spaces.').isStrongPassword().withMessage('Must contain at least one lowercase, one uppercase and one number or special character.')
    .ensure('completeRegistrationStore._confirmPassword')
      .isEqualTo(() => {
        return this.completeRegistrationStore._password;
      }, 'the entered password').withMessage('Your passwords do not match.');
  }

  activate() {
    this.windowService.disableUnload();
    this.password = this.completeRegistrationStore._password ? this.completeRegistrationStore._password : '';
    this.confirmPassword = this.completeRegistrationStore._confirmPassword ? this.completeRegistrationStore._confirmPassword : '';
    this.termsValidate = false;
  }

  deactivate(){

    this.windowService.enableUnload();
  }

  setFocus(field) {

    let firstElement = document.getElementById(field);
    if (firstElement !== null) {
      firstElement.focus();
    } else {

      setTimeout(() => {

        this.setFocus(field);
      }, 100);
    }
  }

  selectTerms(termsValidate) {
    
    let action;
    
    if(!termsValidate) {
      
      action = COMPLETE_REGISTRATION_ACTIONS.VALIDATE_TERMS;
    } else {
      
      action = COMPLETE_REGISTRATION_ACTIONS.VALIDATE_TERMS_ERROR;
    }
    
    this.dispatcher.dispatch(action, !termsValidate);
    
    return true;
  }

  attached() {
    
    this.windowService.enableCapslockDetection();

    this.passwordInput.focus();
  }

  submit() {
    
    if (this.termsValidate === true && !this.submitted) {
      
      this.dispatcher.dispatch(COMPLETE_REGISTRATION_ACTIONS.VALIDATE_TERMS, this.termsValidate);

      this.validation.validate()
        .then(() => {
          this.submitted = true;
          this.dispatcher.dispatch('next.step', 'complete');
        })
        .catch((error) => {});
    } else {
      this.submitted = false;
      this.dispatcher.dispatch(COMPLETE_REGISTRATION_ACTIONS.VALIDATE_TERMS_ERROR, this.termsValidate);
    }

  }

  resubmit() {

    var currentStep =  this.completeRegistrationStore.currentStepName;
    if (currentStep === 'complete') {
      return;
    }
    this.activeClass = 'fadeStepOut';

    this.dispatcher.dispatch('previous.step', 'firstName');
    
    setTimeout(() => {
      this.setFocus('firstName');
    }, 500);
  }

}
