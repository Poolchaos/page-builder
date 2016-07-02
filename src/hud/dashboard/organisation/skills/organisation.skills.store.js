/*
*/
import {ORGANISATION_SKILLS_ACTIONS} from './organisation.skills.actions';
/*
*/
import {LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
import toastr from 'toastr';
/*
*/
const logger = LogManager.getLogger('OrganisationSkillsStore');
/*
*/
let STATE = {

  skillGroups: [],
  skills: [],
  selectedGroup: {},
  error: null
};
/*
*/
export class OrganisationSkillsStore {

  get skills() {

    for (let skill of STATE.skills) {
      skill.labelClassName = 'o-crud-list__icon o-crud-list__icon--skill';
      skill.text = [skill.skillName, this.selectedGroup.skillGroupName];
    }
    return STATE.skills;
  }

  get skillGroups() {

    for (let group of STATE.skillGroups) {
      group.labelClassName = 'o-crud-list__icon o-crud-list__icon--skills';
    }
    return STATE.skillGroups;
  }

  get selectedGroup() {
    return STATE.selectedGroup;
  }

  get error() {
    return STATE.error;
  }

  @handle(ORGANISATION_SKILLS_ACTIONS.RETRIEVE_SKILL_GROUPS)
  handleRetrieveSkillGroups(action, skillGroups) {

    STATE.skillGroups = skillGroups;
  }

  @handle(ORGANISATION_SKILLS_ACTIONS.RETRIEVE_SKILLS)
  handleRetrieveSkills(action, skills) {

    STATE.skills = skills;
  }

  @handle(ORGANISATION_SKILLS_ACTIONS.SET_SELECTED_GROUP)
  handleSelectedGroup(action, group) {

    STATE.selectedGroup = group;
  }

  @handle(ORGANISATION_SKILLS_ACTIONS.ACCEPT_ADD_SKILL_GROUP_SUCCESS)
  handleAcceptAddSkillGroup(action, skillGroup) {
    STATE.skillGroups.push(skillGroup);
  }

  @handle(ORGANISATION_SKILLS_ACTIONS.ACCEPT_ADD_SKILL_SUCCESS)
  handleAcceptAddSkill(action, skill) {
    skill.text = [skill.skillName, this.selectedGroup.skillGroupName];
    STATE.skills.push(skill);
  }

  @handle(ORGANISATION_SKILLS_ACTIONS.ADD_SKILL_GROUP)
  handleAddSkillGroup(action, model) {
    STATE.skillGroups.push({skillGroupName: model.skillGroupName, skillGroupId: model.skillGroupId});
  }

  @handle(ORGANISATION_SKILLS_ACTIONS.ADD_SKILL)
  handleAddSkill(action, model) {
    model.text = [model.skillName, this.selectedGroup.skillGroupName];
    STATE.skills.push(model);
  }

}

