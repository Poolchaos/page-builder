/*
*/
import {ORGANISATION_INVITATIONS_ACTIONS} from '../../organisation.invitations.actions';
import {OrganisationInvitationsStore} from '../../organisation.invitations.store';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';

const logger = LogManager.getLogger('OrganisationInvitationsAttributesSite');

@inject(OrganisationInvitationsStore)
export class OrganisationInvitationsAttributesSite {
  title = '';
  position = 'left';
  display = 'text';

  constructor(organisationInvitationsStore) {
    this.organisationInvitationsStore = organisationInvitationsStore;
  }

  setTitle() {
    this.title = this.organisationInvitationsStore.invitation.site.name || 'No Site selected';
  }

  activate() {
    this.setTitle();
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.CHANGE_INVITATION_SITE)
  @waitFor(OrganisationInvitationsStore)
  handleChangeSite(action, model) {
    this.setTitle();
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_SITES)
  @waitFor(OrganisationInvitationsStore)
  handleRetrieveSites(action, model) {
    setTimeout(()=> {
      this.setTitle();
    },100);
  }

}
