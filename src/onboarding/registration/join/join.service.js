import {inject, LogManager} from 'aurelia-framework';
import {WebSocket} from '../../../_common/services/websocket';
import {handle, Dispatcher} from 'aurelia-flux';
import {JOIN_MESSAGES, JOIN_ACTIONS} from './join.actions';
import {ApplicationService} from '../../../_common/services/application.service';
import {Router}from 'aurelia-router';

import uuid from 'node-uuid';

const logger = LogManager.getLogger('JoinService');

@inject(WebSocket, Dispatcher, ApplicationService, Router)
export class JoinService {

  constructor(webSocket, dispatcher, applicationService, router) {
    this.webSocket = webSocket;
    this.router = router;
    this.dispatcher = dispatcher;
    this.applicationService = applicationService;
    this.registerEvents();
  }

  registerEvents() {

    let identityTrustedEvent = 'com.zailab.user.userregistration.api.events.IdentityTrustedEvent';
    let identityConfirmationRequired = 'com.zailab.user.userregistration.api.events.IdentityConfirmationRequiredEvent';

    this.webSocket.subscribe({name: identityTrustedEvent, callback: response=> {this.handleIdentityTrusted(response);}});
    this.webSocket.subscribe({name: identityConfirmationRequired, callback: response=> {this.handleIdentityConfirmationRequired(response);}});
  }

  clearError(value){
    this.dispatcher.dispatch(JOIN_ACTIONS.CLEAR_ERROR, value);
  }

  handleIdentityTrusted(response) {
    this.dispatcher.dispatch(JOIN_ACTIONS.TRUST_IDENTITY);
  }

  handleIdentityConfirmationRequired(response) {
    this.dispatcher.dispatch(JOIN_ACTIONS.REQUIRE_IDENTITY_CONFIRMATION);
  }

	submit(email) {

 this.applicationService.retrieveRegistrationStatusByEmailSearch(email).then(
      (response) => {

        if (!response.status && !response.userRegistrationId) {
   
          let userRegistrationId = uuid.v4();
          let message = {
            feature: 'registration',
            name: 'com.zailab.user.userregistration.api.commands.SubmitUserRegistrationCommand',
            state: {
              email: email,
              userRegistrationId: userRegistrationId
            }
          };
          this.webSocket.publish(message);
          return;
        }
 
        if (response.status === 'PENDING') {

          let message = {
                feature: 'registration',
                name: 'com.zailab.user.userregistration.api.commands.RequireIdentityConfirmationCommand',
                state: {
                  email: email,
                  userRegistrationId: response.userRegistrationId
                }
              };

          this.webSocket.publish(message);

        } else if (response.status === 'COMPLETED') {
          this.dispatcher.dispatch(JOIN_ACTIONS.JOIN_EMAIL_ALREADY_COMPLETED);
        }

      },
    error => {
      this.dispatcher.dispatch(JOIN_ACTIONS.JOIN_EMAIL_FAILED, error);
    });
	}

   subscribe(callbacks) {

     this.webSocket.subscribe({
      name: JOIN_MESSAGES.EVENTS.REJECTED,
      callback: (msg) => {
        this.dispatcher.dispatch(JOIN_ACTIONS.REJECTED, msg.state);
      }

    });

     this.webSocket.subscribe({
      name: JOIN_MESSAGES.EVENTS.VALIDATION,
      callback: (msg) => {
      }
    });
   }

 }

