/*
*/
import {ORGANISATION_MEMBERS_ACTIONS} from '../../organisation.members.actions';
import {OrganisationMembersStore} from '../../organisation.members.store';
/*
*/
import {inject, LogManager} from 'aurelia-framework';

const logger = LogManager.getLogger('OrganisationMembersSkillsSkills');

@inject(OrganisationMembersStore)
export class OrganisationMembersSkillsSkills {

  title = 'Skills';
  position = 'right';
  display = 'name';
  settings = {
    add: {enabled: false},
    delete: {enabled: false},
    select: {enabled: false},
    edit: {enabled: false}
  };
  skills;

  guide = 'Text goes here.';

  constructor(organisationMembersStore) {

    this.skills = organisationMembersStore.skills;
  }
}
