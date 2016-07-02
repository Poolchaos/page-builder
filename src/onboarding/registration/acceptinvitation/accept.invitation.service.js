import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
import {WebSocket} from '../../../_common/services/websocket';
import {ApplicationService} from '../../../_common/services/application.service';
import {ACCEPT_INVITATION_ACTIONS} from './accept.invitation.actions';
import {Router} from 'aurelia-router';
import {EventAggregator} from 'aurelia-event-aggregator';
import uuid from 'node-uuid';

const logger = LogManager.getLogger('AcceptInvitation');

@inject(ApplicationService, Dispatcher, WebSocket, Router, EventAggregator)
export class AcceptInvitationService {

  constructor(applicationService, dispatcher, webSocket, router, eventAggregator) {
    this.applicationService = applicationService;
    this.dispatcher = dispatcher;
    this.webSocket  = webSocket;
    this.eventAggregator = eventAggregator;
    this.router = router;
    this.registerEvents();
  }

  registerEvents() {
    let identityTrustedEvent = 'com.zailab.user.userregistration.api.events.IdentityTrustedEvent';
    let identityConfirmationRequired = 'com.zailab.user.userregistration.api.events.IdentityConfirmationRequiredEvent';

    this.webSocket.subscribe({name: identityTrustedEvent, callback: response=> {this.handleIdentityTrusted(response);}});
    this.webSocket.subscribe({name: identityConfirmationRequired, callback: response=> {this.handleIdentityConfirmationRequired(response);}});

    this.eventAggregator.subscribe('ValidationErrorsReceived', response => this.handleValidationErrors(response));
  }

  handleIdentityTrusted(response) {
    this.dispatcher.dispatch(ACCEPT_INVITATION_ACTIONS.TRUST_IDENTITY);
  }

  handleIdentityConfirmationRequired(response) {
    this.dispatcher.dispatch(ACCEPT_INVITATION_ACTIONS.REQUIRE_IDENTITY_CONFIRMATION);
  }

   handleValidationErrors(response) {
     if(response){
     //if (response.state.objectName === 'acceptInvitation') {
       this.dispatcher.dispatch(ACCEPT_INVITATION_ACTIONS.ACCEPT_INVITATION_ACCEPTED_ERROR);
     }
   }

  setRegistrationId(userRegistrationId) {
    this.dispatcher.dispatch(ACCEPT_INVITATION_ACTIONS.SET_REGISTRATION_ID, userRegistrationId);
  }

	setInvitationId(invitationId) {
  this.dispatcher.dispatch(ACCEPT_INVITATION_ACTIONS.SET_INVITATION_ID, invitationId);
	}

	setToken(token) {
  this.dispatcher.dispatch(ACCEPT_INVITATION_ACTIONS.SET_TOKEN, token);
	}

	retrieveInvitationStatus(invitationId, token) {
  this.applicationService.acceptInvitationSearch(invitationId).then(
		response => {
      if(response && response.invitationStatusView) {
        if (Object.keys(response.invitationStatusView[0]).length === 0) {
          this.router.navigate('invitationerror');
          return;
        }

        this.dispatcher.dispatch(ACCEPT_INVITATION_ACTIONS.ACCEPT_INVITATION_EMAIL, response.invitationStatusView[0].email);
        this.dispatcher.dispatch(ACCEPT_INVITATION_ACTIONS.INVITE_EMAIL, response.invitationStatusView[0].email);

        let status = response.invitationStatusView[0].status;
        let email = response.invitationStatusView[0].email;

        switch (status){
          case 'ACCEPTED':
            this.submit(email, invitationId, token);
          break;
          case 'PENDING':
            this.invitationAccepted(invitationId, token);
            this.submit(email, invitationId, token);
          break;
          case 'REVOKED':
            this.dispatcher.dispatch(ACCEPT_INVITATION_ACTIONS.ACCEPT_INVITATION_ACCEPTED_ERROR);
          break;
          case 'EXPIRED':
            this.dispatcher.dispatch(ACCEPT_INVITATION_ACTIONS.ACCEPT_INVITATION_ACCEPTED_ERROR);
          break;
          default:
            this.dispatcher.dispatch(ACCEPT_INVITATION_ACTIONS.ACCEPT_INVITATION_ACCEPTED_ERROR);
        }
      }
		});
	}

	submit(email, invitationId, token) {

  if (!invitationId) {
    this.dispatcher.dispatch(ACCEPT_INVITATION_ACTIONS.ACCEPT_INVITATION_ACCEPTED_ERROR);
    return;
  }

  this.applicationService.retrieveRegistrationStatusByEmailSearch(email).then(
			response => {

  if (!response.status && !response.userRegistrationId) {
    let registrationId = uuid.v4();
    this.setRegistrationId(registrationId);

    let message = {
      feature: 'registration',
      name: 'com.zailab.user.userregistration.api.commands.SubmitUserRegistrationCommand',
      state: {
        userRegistrationId: registrationId,
        email: email,
        invitationId: invitationId
      }
    };

    this.webSocket.publish(message);

  } else if (response.status === 'COMPLETED') {

    this.dispatcher.dispatch(ACCEPT_INVITATION_ACTIONS.ACCEPT_INVITATION_LOGIN);

  } else if (response.status === 'PENDING') {

    let userRegistrationId = response.userRegistrationId;
    this.applicationService.retrieveRegistrationCompletionStatusSearch(userRegistrationId, '').then(
			response => {

  var registrationCanBeCompleted = response.status === true;

  if (registrationCanBeCompleted) {
    this.dispatcher.dispatch(ACCEPT_INVITATION_ACTIONS.NAVIGATE_TO_REGISTER, userRegistrationId);
  } else {
    this.dispatcher.dispatch(ACCEPT_INVITATION_ACTIONS.ACCEPT_INVITATION_ACCEPTED_ERROR);
  }
			},
		error => {
  this.dispatcher.dispatch(ACCEPT_INVITATION_ACTIONS.ACCEPT_INVITATION_ACCEPTED_ERROR);
		}
		);
  }

		});
  error => {
    this.dispatcher.dispatch(ACCEPT_INVITATION_ACTIONS.ACCEPT_INVITATION_ACCEPTED_ERROR);
  };
	}

	invitationAccepted(invitationId, token) {
  let message = {
    feature: 'registration',
    name: 'com.zailab.user.invitation.api.commands.AcceptInvitationCommand',
    state: {
      invitationId: invitationId,
      token: token
    }
  };
  this.webSocket.publish(message);
	}
}
