/*
*/
import {Crud} from 'zailab.framework';
/*
*/
import {OrganisationInvitationsService} from '../organisation.invitations.service';
import {OrganisationInvitationsStore} from '../organisation.invitations.store';
import {ORGANISATION_INVITATIONS_ACTIONS} from '../organisation.invitations.actions';
import {UserSession} from '../../../../../_common/stores/user.session';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {handle, waitFor} from 'aurelia-flux';
import {EventAggregator} from 'aurelia-event-aggregator';
/*
*/
const logger = LogManager.getLogger('OrganisationInvitationsList');
/*
*/
@inject(OrganisationInvitationsService, OrganisationInvitationsStore, UserSession, Router, EventAggregator)
export class OrganisationInvitationsList {

	settings = {
  add: {enabled: true},
  delete: {enabled: true},
  select: {enabled: false},
  edit: {enabled: false}
	};

	display = 'text';

	options = {
  add: () => this.add(),
  remove: (items) => this.remove(items)
	};

  guide = 'This is a list of the members who have been invited to your organisation. Members are added to your organisation through email. Once they have accepted they will appear in Members.';

  resolve;
  validationErrorsReceivedSub = null;

  constructor(organisationInvitationsService, organisationInvitationsStore, userSession, router, eventAggregator) {

    this.organisationInvitationsService = organisationInvitationsService;
    this.organisationInvitationsStore = organisationInvitationsStore;
    this.userSession = userSession;
    this.router = router;
    this.eventAggregator = eventAggregator;
    
    this.init();
  }

  init() {
    
    if(!this.validationErrorsReceivedSub) {
      
      this.validationErrorsReceivedSub = this.eventAggregator.subscribe('ValidationErrorsReceived', (response) => {

        this.handleReplacePendingInvitations();
      });
    }
  }

  activate() {

    this.organisationInvitationsService.clearAttributes();
  }

  canActivate() {

    this.replaceCount = this.organisationInvitationsStore.invitationsCount;

    if (this.organisationInvitationsStore.isInvitesEmpty) {
      this.organisationInvitationsService.retrievePendingInvitations();
    }

    return new Promise((resolve) => this.resolve = resolve);
  }

  deactivate() {
    
    this.validationErrorsReceivedSub.dispose();
  }

  get itemcount() {
    return this.organisationInvitationsStore.invitations.length;
  }

  get emptyListDisplay() { // TODO implement this in the crud body custom element

    return 'There are no pending invitations to display.';
  }

  add() {

    this.router.navigate('role');
  }

    remove(invites) {
      this.organisationInvitationsService.revokePendingInvitations(invites);
    }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_INVITES)
  @waitFor(OrganisationInvitationsStore)
  handleRetrievePendingInvitations() {

    if (this.resolve) {

      this.resolve(true);
      this.resolve = null;
    }
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.REPLACE_INVITES)
  @waitFor(OrganisationInvitationsStore)
  handleReplacePendingInvitations() {

    logger.debug(' handleReplacePendingInvitations > this.replaceCount >>> ', this.replaceCount);
    
    if(this.replaceCount > 0) {
      this.replaceCount = this.replaceCount - 1
    }

    if (this.replaceCount === 0 && this.resolve) {

      this.resolve(true);
      this.resolve = null;
    }
  }
}

