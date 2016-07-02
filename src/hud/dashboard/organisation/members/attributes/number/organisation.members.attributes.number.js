/*
*/
import {ORGANISATION_MEMBERS_ACTIONS} from '../../organisation.members.actions';
import {OrganisationMembersStore} from '../../organisation.members.store';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';

const logger = LogManager.getLogger('OrganisationMembersAttributesNumbers');

@inject(OrganisationMembersStore)
export class OrganisationMembersAttributesNumbers {

  title = '';
  position = 'right';
  display = 'number';

  constructor(organisationMembersStore) {

    this.organisationMembersStore = organisationMembersStore;
  }

  setTitle() {
    this.title = this.organisationMembersStore.member.telephoneNumber || 'Telephone Number';
  }

  activate() {
    this.setTitle();
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER_NUMBER)
  @waitFor(OrganisationMembersStore)
  handleChangeOrganisationName(action, model) {
    this.setTitle();
  }
}
 