import {LogManager, inject}from 'aurelia-framework';
import {handle, waitFor}from 'aurelia-flux';
import {ensure, Validation}from 'aurelia-validation';
import uuid from 'node-uuid';
import {COMPLETE_REGISTRATION_ACTIONS}from './complete.registration.actions';
import {CompleteRegistrationStore} from './complete.registration.store';
import {UniqueUsernameValidationRule, UniqueEmailValidationRule}from './complete.registration.validation';
import {Particleground}from '../../../_common/animations/particleground';
import {Router}from 'aurelia-router';
import {CompleteRegistrationService} from './complete.registration.service';
import {EncryptTools} from 'zailab.common';

const logger = LogManager.getLogger('CompleteRegistration');

@inject(Validation, UniqueUsernameValidationRule, UniqueEmailValidationRule, Particleground, Router, CompleteRegistrationService, CompleteRegistrationStore)
export class CompleteRegistration {

  constructor(validation, uniqueUsernameValidationRule, uniqueEmailValidationRule, particles, router, completeRegistrationService, completeRegistrationStore) {
    this.validation = validation;
    this.completeRegistrationStore = completeRegistrationStore;
    this.completeRegistrationService = completeRegistrationService;
    this.particles = particles;
    this.activeClass = '';
    this.router = router;
    this.currentStepIndex = 0;
    this.focusClass = '';
  };

  initAnimation(el) {
    this.particles.initiate(el);
  }

  navTo() {
    this.router.navigate('login');
  }

  activate(params) {

    this.completeRegistrationService.enableCapslockOnPasswordDetection();

    this.initialiseSteps();

    let invitationId = params.invitationId;
    let userRegistrationId = params.userRegistrationId;
    let token = params.token;

    if (userRegistrationId) {
      this.completeRegistrationService.setRegistrationId(userRegistrationId);
    }

    if (params.invitationId) {
      this.completeRegistrationService.completeRegistrationByInvitation(userRegistrationId);
    }else {
      this.completeRegistrationService.setToken(token);
      this.completeRegistrationService.completeRegistration(userRegistrationId, token);
    }
  }

  deactivate() {

    this.completeRegistrationService.disableCapslockOnPasswordDetection();

    this.completeRegistrationService.subscribe(null);
  }

  @handle(COMPLETE_REGISTRATION_ACTIONS.ACCEPTED)
  handleRegistrationAccepted(action, message) {
    this.isCurrentStep[1].valid = true;
    this.store._error = null;

    for (var viewIndex in this.isCurrentStep) {
      if (this.isCurrentStep[viewIndex].active) {
        this.isCurrentStep[viewIndex].active = false;
      }
    }

    this.isCurrentStep[1].valid = true;
  }

  // Hides all previous steps
  @handle('previous.step')
  handlePreviousStep(message, previousStep) {
    //this.currentStepName = previousStep;
    this.completeRegistrationService.updateCurrentStep(previousStep);

    var stepIndex;
    for (var i = 0; i < 4; i++) {

      if (!this.isCurrentStep[i]) {
        continue;
      }
      this.isCurrentStep[i].active = false;
      if (this.isCurrentStep[i].name === previousStep) {
        this.isCurrentStep[i].active = true;
        stepIndex = i;
      }

      if (i > stepIndex) {
        this.isCurrentStep[i].completed = false;
      }
    }
  }

  @handle('next.step')
  handleNextStep(message, nextStep) {
    this.focusClass = 'autofocus';
    if (nextStep === 'complete') {
      this.register();
      return;
    }

    var stepsLength = Object.keys(this.isCurrentStep).length;
    for (var i = 0; i < stepsLength; i++) {
      if (i >= stepsLength - 1)
            return;

      var step = this.isCurrentStep[i].name;
      if (step === nextStep) {
        if (i > 0) {
          this.isCurrentStep[i].active = true;
          this.isCurrentStep[i - 1].completed = true;
          this.submitForm(i);
        }
        this.isCurrentStep[i].completed = true;
      }
    }
  }

  initialiseSteps() {
    this.isCurrentStep = {
      0: {
        name: 'firstName',
        active: true,
        completed: false
      },
      1: {
        name: 'password',
        active: false,
        completed: false
      }
    };
  }

  resubmit() {
    this.activeClass = 'fadeStepOut';
  }

  submitForm(step) {

    step = parseInt(step);

    this.completeRegistrationService.updateCurrentStep(this.isCurrentStep[step].name);

    var stepsLength = Object.keys(this.isCurrentStep).length;
    if (step === 1) {
      return;
    }

    for (var viewIndex in this.isCurrentStep) {
      if (this.isCurrentStep[viewIndex].active) {
        this.isCurrentStep[viewIndex].active = false;
      }
    }

    if (this.isCurrentStep[step].preFunction) {
      this.isCurrentStep[step].preFunction();
    }

    this.isCurrentStep[step].active = true;
    this.isCurrentStep[step - 1].valid = true;
  }

  register() {
    var password = this.completeRegistrationStore.password;
    var encryptedPassword = EncryptTools.encrypt(password);

    var registrationInfo = {
      userRegistrationId: this.completeRegistrationStore.userRegistrationId,
      token: this.completeRegistrationStore.token,
      firstName: this.completeRegistrationStore.firstName,
      surname: this.completeRegistrationStore.surname,
      password: encryptedPassword,
      acceptedTerms: this.completeRegistrationStore.validateTerms
    };

    this.completeRegistrationService.handleRegistrationComplete(registrationInfo);
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

  @handle(COMPLETE_REGISTRATION_ACTIONS.NAVIGATE_TO_REGISTER)
  handleNavigateToRegister() {
    this.router.navigate('completeregistration');
  }

  @handle(COMPLETE_REGISTRATION_ACTIONS.NAVIGATE_TO_ERROR)
  handleNavigateToError() {
    this.router.navigate('registrationerror');
  }

  @handle(COMPLETE_REGISTRATION_ACTIONS.SET_CURRENT_STEP_NAME)
  @waitFor(CompleteRegistrationStore)
  handleCurrentStepName() {
    
    setTimeout(() => {
      this.setFocus('firstName');
    }, 500);
  }
}
