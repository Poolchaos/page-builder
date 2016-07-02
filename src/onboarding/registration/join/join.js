import {inject, LogManager} from 'aurelia-framework';
import {Validation} from 'aurelia-validation';
import {Dispatcher, handle} from 'aurelia-flux';
import {JoinStore} from './join.store';
import {JOIN_ACTIONS} from './join.actions';
import {Router} from 'aurelia-router';
import {JoinService} from './join.service';
import uuid from 'node-uuid';

const logger = LogManager.getLogger('Join');

@inject(Validation, Dispatcher, JoinStore, Router, JoinService)
export class Join {

  constructor(validation, dispatcher, joinStore, router, joinService) {
    this.validation = validation;
    this.router = router;
    this.joinService = joinService;
    this.dispatcher = dispatcher;
    this.joinStore = joinStore;
    this.joinService = joinService;
    this.email = '';
    this.emailMessage = '';
  }

  activate(params) {

    this.validation = this.validation.on(this)
      .ensure('email', config => {
        config.useDebounceTimeout(150);
      })
      .isNotEmpty().withMessage('Please enter your email.')
      .isEmail().withMessage('Your email must contain @ and a full stop.');

    //this.email = '';
  }

  detached(){
    this.email = '';

  }
  
  attached() {
    
    setTimeout(() => {
      
      this.setFocus();
    }, 500);
  }
  
  setFocus() {
    
    let firstElement = document.getElementById('email');    
    if (firstElement !== null) {
      firstElement.focus();
    } else {
      
      setTimeout(() => {
                
        this.setFocus();     
      }, 100);
    }
  }

  navTo() {
    this.router.navigate('login');
    this.joinService.clearError('clear');
  }

  resubmit() {

    var currentStep = this.joinStore.currentStepName;
    if (currentStep === 'complete')
      return;

    this.activeClass = 'fadeStepOut';
    this.dispatcher.dispatch('previous.step', 'email');
  }

  submit() {
    
    if (this.submitted) {
      return;
    }
    
    this.submitted = true;
    
    this.validation.validate()
      .then(() => {  
        this.dispatcher.dispatch(JOIN_ACTIONS.JOIN_EMAIL, this.email);
        this.joinService.submit(this.email);
      })
      .catch((error) => {
        this.submitted = false;
      });

  }
  
  @handle(JOIN_ACTIONS.TRUST_IDENTITY)
  handleTrustIdentity() {
    setTimeout(() => {
      this.router.navigate('completeregistration');
    });
  }

  @handle(JOIN_ACTIONS.REQUIRE_IDENTITY_CONFIRMATION)
  handleIdentityConfirmationRequired() {
    
    setTimeout(() => {
      this.router.navigate('emailsubmitted');
    });
  }

  @handle(JOIN_ACTIONS.JOIN_EMAIL_ALREADY_COMPLETED)
  handleEmailAlreadyCompleted() {
    this.submitted = false;
  }

  @handle(JOIN_ACTIONS.JOIN_EMAIL_FAILED)
  handleEmailFailed() {
    this.submitted = false;
  }
}