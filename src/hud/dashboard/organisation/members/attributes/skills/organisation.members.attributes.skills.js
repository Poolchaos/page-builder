/*
*/
import {ORGANISATION_MEMBERS_ACTIONS} from '../../organisation.members.actions';
import {OrganisationMembersStore} from '../../organisation.members.store';
import {OrganisationMembersSkillsService} from './organisation.members.attributes.skills.service';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';

const logger = LogManager.getLogger('OrganisationMembersAttributesSkills');

@inject(OrganisationMembersStore, OrganisationMembersSkillsService)
export class OrganisationMembersAttributesSkills {

  title = 'skills';
  position = 'left';
  display = 'skillName';

  settings = {
    add: {enabled: false},
    delete: {enabled: false},
    select: {enabled: true},
    edit: {enabled: false}
  };

  constructor(organisationMembersStore, organisationMembersSkillsService) {

    this.organisationMembersSkillsService = organisationMembersSkillsService;
    this.organisationMembersStore = organisationMembersStore;
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER_SKILLS)
  @waitFor(OrganisationMembersStore)
  handleChangeMemberSite() {
    
    this.organisationMembersSkillsService.changeSkills(this.organisationMembersStore.member.skills);
  }
}
