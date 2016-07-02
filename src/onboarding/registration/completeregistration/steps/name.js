import {inject}from 'aurelia-framework';
import {Dispatcher, handle}from 'aurelia-flux';
import {ensure, Validation}from 'aurelia-validation';
import {COMPLETE_REGISTRATION_ACTIONS}from '../complete.registration.actions';
import {CompleteRegistrationStore}from '../complete.registration.store';
import {WindowService} from 'zailab.common';
//import {CssAnimator}from 'aurelia-animator-css';

@inject(Validation, Dispatcher, CompleteRegistrationStore, WindowService)
export class CompleteRegistrationName {

  firstName = '';
  surname = '';
  constructor(validation, dispatcher, completeRegistrationStore, windowService) {
    this.validation = validation.on(this);
    this.dispatcher = dispatcher;
    this.completeRegistrationStore = completeRegistrationStore;
    this.windowService = windowService;
    this.activeClass = '';
    this.errorMsg = '';

    this.validation = validation.on(this)
              .ensure('completeRegistrationStore._firstName', config => {})
              .isNotEmpty().withMessage('Please enter your first name.').hasLengthBetween(2, 30).withMessage('Must be between 2 and 30 characters long.').matches(/^([a-zA-Z-\s])+$/)
              .withMessage((newValue, threshold) => {return `Is not a valid input.`;})
      .ensure('completeRegistrationStore._surname', config => {
        config.useDebounceTimeout(150);
      }).isNotEmpty().withMessage('Please enter your surname.').hasLengthBetween(2, 30).withMessage('Must be between 2 and 30 characters long.').matches(/^([a-zA-Z-\s])+$/)
      .withMessage((newValue, threshold) => {return `Is not a valid input.`;});
  }

  activate() {
    this.windowService.disableUnload();
    this.firstName = this.completeRegistrationStore.firstName ? this.completeRegistrationStore.firstName : '';
    this.surname = this.completeRegistrationStore.surname ? this.completeRegistrationStore.surname : '';
  
    setTimeout(() => {
      
      this.setFocus('firstName');
    }, 500);
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

  resubmit() {
    var currentStep =  this.completeRegistrationStore.currentStepName;
    if (currentStep === 'complete') {
      return;
    }
    this.activeClass = 'fadeStepOut';
    this.dispatcher.dispatch('previous.step', 'firstName');
  }

  submit() {
    this.validation.validate()
      .then(() => {
        this.activeClass = 'nodisplay';
        this.dispatcher.dispatch('next.step', 'password');
      
        setTimeout(() => {
          this.setFocus('password');
        }, 500);
      
      })
      .catch((error) => {});
  }

   @handle('previous.step')
  handlePreviousStep(message, previousStep) {
    this.activeClass = '';
  }

}
