/*
*/
import {UserSession, ApplicationService} from 'zailab.common';
/*
*/
import {OrganisationMembersStore} from '../../organisation.members.store';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
/*
*/
const logger = LogManager.getLogger('OrganisationMembersSkillsService');
/*
*/
@inject(UserSession, ApplicationService, OrganisationMembersStore)
export class OrganisationMembersSkillsService {

  constructor(userSession, applicationService, organisationMembersStore) {

    this.userSession = userSession;
    this.applicationService = applicationService;
    this.organisationMembersStore = organisationMembersStore;
  }
  
  changeSkills(changedSkills) {
    
    let memberId = this.organisationMembersStore.member.memberId;
    let organisationId = this.userSession.organisationId;
    
    let skills = [];
    
    for(var skill of changedSkills) {
      
      skills.push({
        skillId: skill.skillId,
        skillGroupId: skill.skillGroupId,
        proficiency: skill.proficiency
      });
    }
    
    this.applicationService.allocateSkillsToMember(memberId, organisationId, skills);
  }

  allocateMemberSkill(skills) {
    let memberId = this.organisationMembersStore.member.memberId;
    let organisationId = this.userSession.organisationId;
    let data = {
        skillId: skills.id,
        skillGroupId: skills.groupId,
        proficiency: '0'
      };

    this.applicationService.allocateSkillToMember(memberId, organisationId, data);
  }

  deallocateMemberSkill(skills) { 
    let memberId = this.organisationMembersStore.member.memberId;
    let skillId = skills.id;
    this.applicationService.deallocateSkillFromMember(memberId, skillId);
  }
}
