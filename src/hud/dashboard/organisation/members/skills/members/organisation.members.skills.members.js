/*
*/
import {ORGANISATION_MEMBERS_ACTIONS} from '../../organisation.members.actions';
import {OrganisationMembersStore} from '../../organisation.members.store';
/*
*/
import {inject, LogManager} from 'aurelia-framework';

const logger = LogManager.getLogger('OrganisationMembersSkillsMembers');

@inject(OrganisationMembersStore)
export class OrganisationMembersSkillsMembers {

  properties = {
    title: 'Members',
    position: 'left',
    display: 'text'
  };
  settings = {
    add: {enabled: false},
    delete: {enabled: false},
    select: {multi: {enabled: false}},
    edit: {enabled: false}
  };
  items;

  constructor(organisationMembersStore) {

    this.items = organisationMembersStore.members;
  }
}
