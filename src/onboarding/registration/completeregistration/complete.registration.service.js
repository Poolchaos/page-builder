import {inject, LogManager} from 'aurelia-framework';
import {WebSocket} from '../../../_common/services/websocket';
import {handle, Dispatcher} from 'aurelia-flux';
import {COMPLETE_REGISTRATION_MESSAGES, COMPLETE_REGISTRATION_ACTIONS} from './complete.registration.actions';
import {ApplicationService} from '../../../_common/services/application.service';
import {CompleteRegistrationStore} from './complete.registration.store';
import {Router}from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
/*
*/
import {WINDOW_EVENTS} from 'zailab.common';
/*
*/
const logger = LogManager.getLogger('CompleteRegistrationService');
/*
*/
@inject(WebSocket, Dispatcher, ApplicationService, Router, CompleteRegistrationStore, EventAggregator)
export class CompleteRegistrationService {
  
  capslockOnPasswordDetection;
  capslockOffPasswordDetection;
  
  constructor(webSocket, dispatcher, applicationService, router, completeRegistrationStore, eventAggregator) {
    this.webSocket = webSocket;
    this.router = router;
    this.dispatcher = dispatcher;
    this.applicationService = applicationService;
    this.completeRegistrationStore = completeRegistrationStore;
    this.eventAggregator = eventAggregator;
  }

  setToken(token) {
    this.dispatcher.dispatch(COMPLETE_REGISTRATION_ACTIONS.SET_TOKEN, token);
  }

  setRegistrationId(userRegistrationId) {
    this.dispatcher.dispatch(COMPLETE_REGISTRATION_ACTIONS.SET_REGISTRATION_ID, userRegistrationId);
  }

  handleRegistrationComplete(info) {
    this.subscribe();
    this.applicationService.completeUserRegistration(info.userRegistrationId, info.token, info.firstName, info.surname, info.password, info.acceptedTerms);
    let message = {
      feature: 'registration',
      name: 'com.zailab.user.userregistration.api.commands.CompleteUserRegistrationCommand',
      state: {
        userRegistrationId: info.userRegistrationId,
        token: info.token,
        firstName: info.firstName,
        surname: info.surname,
        password: info.password,
        acceptedTerms: info.acceptedTerms
      }
    };
    this.webSocket.publish(message);

    this.dispatcher.dispatch(COMPLETE_REGISTRATION_ACTIONS.SUBMITTED);
  }

  completeRegistration(userRegistrationId, token) {
    this._completeRegistration(userRegistrationId, token);
  }

  completeRegistrationByInvitation(userRegistrationId) {
    this._completeRegistration(userRegistrationId);
  }

  _completeRegistration(userRegistrationId, token) {
    this.applicationService.retrieveRegistrationCompletionStatusSearch(userRegistrationId, token ? token : '').then(
      response => {
        if (Object.keys(response).length === 0) {
          this.router.navigate('registrationerror');
          return;
        }

        var registrationCanBeCompleted = response.status === true;
        if (registrationCanBeCompleted) {
          this.router.navigate('completeregistration');
          return;
        } else {
          this.dispatcher.dispatch(COMPLETE_REGISTRATION_ACTIONS.NAVIGATE_TO_ERROR);
          return;
        }
      },
      error => {
        this.dispatcher.dispatch(COMPLETE_REGISTRATION_ACTIONS.REGISTER_EMAIL_FAILED, error);
      }
    );
  }

  subscribe(callbacks) {

    this.webSocket.subscribe({
      name: COMPLETE_REGISTRATION_MESSAGES.EVENTS.REJECTED,
      callback: (msg) => {
        this.dispatcher.dispatch(COMPLETE_REGISTRATION_ACTIONS.REJECTED, msg.state);
      }
    });

    this.webSocket.subscribe({
      name: COMPLETE_REGISTRATION_MESSAGES.EVENTS.VALIDATION,
      callback: (msg) => {
      }
    });
    this.webSocket.subscribe({
      feature: 'registration',
      name: 'com.zailab.user.userregistration.api.events.UserRegistrationCompletedEvent',
      callback: (msg) => {
        this.dispatcher.dispatch(COMPLETE_REGISTRATION_ACTIONS.COMPLETED, msg);
        let email = this.completeRegistrationStore.email;
        this.router.navigateToRoute('verify', {email: email}, {replace: true});
      }
    });
  }

  clearFields() {
    this.dispatcher.dispatch(COMPLETE_REGISTRATION_ACTIONS.CLEAR_FIELDS);
  }

  updateCurrentStep(stepName) {
    this.dispatcher.dispatch(COMPLETE_REGISTRATION_ACTIONS.SET_CURRENT_STEP_NAME, stepName);
  }

  enableCapslockOnPasswordDetection() {

    this.capslockOnPasswordDetection = this.eventAggregator.subscribe(WINDOW_EVENTS.ON_CAPSLOCK_DETECTED, (data) => { // TODO this gets called for every key event - not safe

        this.dispatcher.dispatch(COMPLETE_REGISTRATION_ACTIONS.CAPS_LOCK_ERROR, data.settings.message);
    });

    this.capslockOffPasswordDetection = this.eventAggregator.subscribe(WINDOW_EVENTS.OFF_CAPSLOCK_DETECTED, (data) => { // TODO this gets called for every key event - not safe
      
        this.dispatcher.dispatch(COMPLETE_REGISTRATION_ACTIONS.CLEAR_ERROR);
    });
  }

  disableCapslockOnPasswordDetection() {

    this.capslockOnPasswordDetection.dispose();
    this.capslockOffPasswordDetection.dispose();
  }
}
