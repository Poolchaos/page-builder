import {handle}from 'aurelia-flux';
import {ACCEPT_INVITATION_ACTIONS} from './accept.invitation.actions';

export class AcceptInvitationStore {

  error;
  message = 'Accepting invitation, please wait...';
  
  @handle(ACCEPT_INVITATION_ACTIONS.INVITE_ACCEPTED)
  handleInviteAccepted() {
    this.message = 'Invitation accepted, redirecting to register...';
  }

  @handle(ACCEPT_INVITATION_ACTIONS.INVITE_FAILED)
  handleInviteFailed() {
    this.error = 'Acceptance failed';
  }

 @handle(ACCEPT_INVITATION_ACTIONS.SET_INVITATION_ID)
  handleInvitationId(message, invitationId) {
		this.invitationId = invitationId;
  }

  @handle(ACCEPT_INVITATION_ACTIONS.SET_REGISTRATION_ID)
  handleSetInviteRegisterId(message, userRegistrationId) {
		this.userRegistrationId = userRegistrationId;
  }

 @handle(ACCEPT_INVITATION_ACTIONS.SET_TOKEN)
  handleSetToken(message, token) {
		this.token = token;
  }

@handle(ACCEPT_INVITATION_ACTIONS.INVITE_EMAIL)
  handleInviteEmail(message, email) {
		this.email = email;
  }
}
