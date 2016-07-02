/*
*/
import {ORGANISATION_INVITATIONS_ACTIONS} from '../../organisation.invitations.actions';
import {OrganisationInvitationsStore} from '../../organisation.invitations.store';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';

const logger = LogManager.getLogger('OrganisationInvitationsAttributesChannel');

@inject(OrganisationInvitationsStore)
export class OrganisationInvitationsAttributesChannel {
  title = 'channels';
  position = 'left';
  display = 'name';
    settings = {
      add: {enabled: false},
      delete: {enabled: false},
      select: {enabled: false},
      edit: {enabled: false}
    };

  constructor(organisationInvitationsStore) {
    this.organisationInvitationsStore = organisationInvitationsStore;
  }

  setTitle() {
  }

  activate() {    
    this.setTitle();
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.CHANGE_INVITATIONS_CHANNEL)
  handleChangeChannel(action, model) {
    this.setTitle();
  }  

  @handle(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_CHANNELS)
  @waitFor(OrganisationInvitationsStore)
  handleRetrieveChannels(action, model) {
    this.setTitle();
  }
}