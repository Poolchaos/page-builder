/*
*/
import {ORGANISATION_INVITATIONS_ACTIONS} from '../../organisation.invitations.actions';
import {OrganisationInvitationsStore} from '../../organisation.invitations.store';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
/*
*/
const logger = LogManager.getLogger('OrganisationInvitationsAttributesCos');

@inject(OrganisationInvitationsStore)
export class OrganisationInvitationsAttributesCos {
  title = 'Classes of Service';
  position = 'right';

  constructor(organisationInvitationsStore) {
    this.organisationInvitationsStore = organisationInvitationsStore;
  }

  setTitle() {
    this.title = this.organisationInvitationsStore.invitation.classOfService ? this.organisationInvitationsStore.invitation.classOfService : 'No Class of Service selected';
  }

  activate() {
    this.setTitle();
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.CHANGE_INVITATION_COS)
  handleChangeCos(action, model) {
    this.setTitle();
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_COS)
  @waitFor(OrganisationInvitationsStore)
  handleRetrieveCos(action, model) {
    this.setTitle();
  }
}
