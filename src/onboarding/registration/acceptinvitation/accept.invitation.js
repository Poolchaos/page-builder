import {handle}from 'aurelia-flux';
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {AcceptInvitationService} from './accept.invitation.service';
import {AcceptInvitationStore} from './accept.invitation.store';
import {ACCEPT_INVITATION_ACTIONS} from './accept.invitation.actions';

const logger = LogManager.getLogger('AcceptInvitationVM');

@inject(AcceptInvitationService, AcceptInvitationStore, Router)
export class AcceptInvitation {

  constructor(acceptInvitationService, acceptInvitationStore, router) {
    
    this.acceptInvitationService = acceptInvitationService;
    this.acceptInvitationStore = acceptInvitationStore;
    this.router = router;
  }
  
  activate(params) {
    this.acceptInvitationService.setRegistrationId(params.userRegistrationId);
    this.acceptInvitationService.setInvitationId(params.invitationId);
		setTimeout(()=>this.acceptInvitationService.retrieveInvitationStatus(params.invitationId, params.token), 5000);
  }

  @handle(ACCEPT_INVITATION_ACTIONS.ACCEPT_INVITATION_ACCEPTED)
  handleInviteAccepted() {
    setTimeout(() => this.router.navigate('completeregistration'), 5000);
  }  

  @handle(ACCEPT_INVITATION_ACTIONS.ACCEPT_INVITATION_LOGIN)
  handleInviteLogin() {
    let email = this.acceptInvitationStore.email;
    this.router.navigateToRoute('login', {email:email}, {replace:true});
  }  
  
  @handle(ACCEPT_INVITATION_ACTIONS.TRUST_IDENTITY)
  handleTrustIdentity() {
    let invitationId = this.acceptInvitationStore.invitationId;
    let userRegistrationId = this.acceptInvitationStore.userRegistrationId;
    let email = this.acceptInvitationStore.email;

    this.router.navigateToRoute('completeregistration', { invitationId:invitationId, userRegistrationId:userRegistrationId, email:email}, {replace: true});
  }   

  @handle(ACCEPT_INVITATION_ACTIONS.NAVIGATE_TO_REGISTER)
  handleNavigateToRegister(action, userRegistrationId) {
    
    let invitationId = this.acceptInvitationStore.invitationId;
    this.router.navigateToRoute('completeregistration', { invitationId:invitationId, userRegistrationId:userRegistrationId }, {replace: true});
  }  

  @handle(ACCEPT_INVITATION_ACTIONS.REQUIRE_IDENTITY_CONFIRMATION)
  handleIdentityConfirmationRequired() {
    this.router.navigate('emailsubmitted');
  }  
 
  @handle(ACCEPT_INVITATION_ACTIONS.ACCEPT_INVITATION_ACCEPTED_ERROR)
  handleInvitationError(){
    this.router.navigate('invitationerror');
  }

}