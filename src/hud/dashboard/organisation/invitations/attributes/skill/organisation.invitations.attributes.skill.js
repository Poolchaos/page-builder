/*
*/
import {OrganisationInvitationsStore} from '../../organisation.invitations.store';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
/*
*/
const logger = LogManager.getLogger('OrganisationInvitationsAttributesSkill');
/*
*/
@inject(OrganisationInvitationsStore)
export class OrganisationInvitationsAttributesSkill {
  
  title = 'skills';
  position = 'left';
  display = 'skillName';
  settings = {
    add: {enabled: false},
    delete: {enabled: false},
    select: {enabled: false},
    edit: {enabled: false}
  };

  constructor(organisationInvitationsStore) {
    this.organisationInvitationsStore = organisationInvitationsStore;
  }
}
