/*
*/
import {ORGANISATION_INVITATIONS_ACTIONS} from '../../organisation.invitations.actions';
import {OrganisationInvitationsStore} from '../../organisation.invitations.store';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';

const logger = LogManager.getLogger('OrganisationInvitationsAttributesCos');

@inject(OrganisationInvitationsStore)
export class OrganisationInvitationsAttributesService {
  title = 'services';
  position = 'left';
  display = 'name';
  settings = {
    add: {enabled: false},
    delete: {enabled: false},
    select: {enabled: true},
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

  @handle(ORGANISATION_INVITATIONS_ACTIONS.CHANGE_INVITATION_SERVICE)
  handleChangeService(action, model) {
    this.setTitle();
  } 

  @handle(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_SERVICES)
  @waitFor(OrganisationInvitationsStore)
  handleRetrieveService(action, model) {
    this.setTitle();
  }
}