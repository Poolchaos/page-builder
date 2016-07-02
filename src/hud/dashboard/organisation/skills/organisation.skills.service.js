/*
*/
import {UserSession, ApplicationService} from 'zailab.framework';
/*
import {DisplayMessageService} from 'zailab.common';
*/
import {ORGANISATION_SKILLS_ACTIONS} from './organisation.skills.actions';
/*
*/
import {EventAggregator} from 'aurelia-event-aggregator';
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
/*
*/
import {WebSocket} from '../../../../_common/services/websocket';
/*
*/
import uuid from 'node-uuid';
/*
*/
const logger = LogManager.getLogger('OrganisationSkillsService');
/*
*/

@inject(EventAggregator, UserSession, ApplicationService, Dispatcher, WebSocket)
export class OrganisationSkillsService {

  constructor(eventAggregator, userSession, applicationService, dispatcher, webSocket) {
    this.eventAggregator = eventAggregator;
    this.userSession = userSession;
    this.applicationService = applicationService;
    this.dispatcher = dispatcher;
    this.webSocket = webSocket;
    this.registerEvents();
  }

  registerEvents() {
    let skillGroupAddedEvent = 'com.zailab.organisation.organisation.api.events.SkillGroupAddedEvent';
    let skillAddedEvent = 'com.zailab.organisation.organisation.api.events.SkillAddedEvent';

    this.webSocket.subscribe({name: skillGroupAddedEvent, callback: response=> {this.handleSkillGroupAddedEvent(response);}});
    this.webSocket.subscribe({name: skillAddedEvent, callback: response=> {this.handleSkillAddedEvent(response);}});
    this.eventAggregator.subscribe('ValidationErrorsReceived', response => this.handleValidationErrors(response));
  }

  handleValidationErrors(response) {
    let origin = response.state.objectName;
    let error;
    let errorCode = response.state.allErrors[0].code;
    if (origin === 'addSkillGroupCommand' || origin === 'addSkillCommand') {
      if (errorCode === 'skillgroup.not.unique') {
        error = 'Skill group not unique';
      } else if (errorCode === 'skill.not.unique') {
        error = 'Skill not unique';
      } else {
        return;
      }

    } else if (origin === 'removeSkillGroupCommand') {
      let organisationId = response.state.entity.organisationId;
      let skillGroupId = response.state.entity.skillGroupId;
      let skillGroupName = response.state.entity.skillGroupName;
      let skillGroup = {organisationId: organisationId,  skillGroupId: skillGroupId, skillGroupName: skillGroupName};
      this.dispatcher.dispatch(ORGANISATION_SKILLS_ACTIONS.ADD_SKILL_GROUP, skillGroup);

    } if (origin === 'removeSkillCommand') {
      let organisationId = response.state.entity.organisationId;
      let skillGroupId = response.state.entity.skillGroupId;
      let skillId = response.state.entity.skillId;
      let skillName = response.state.entity.skillName;
      let skillGroupName = response.state.entity.skillGroupName;
      let skill = {organisationId: organisationId,  skillGroupId: skillGroupId, skillId: skillId, skillName: skillName};
      this.dispatcher.dispatch(ORGANISATION_SKILLS_ACTIONS.ADD_SKILL, skill);

    }
  }

  retrieveSkillGroups() {

    let organisationId = this.userSession.organisationId;
    this.applicationService.displaySkillGroupsSearch(organisationId).then(
      (response) => {
        if (response.displaySkillGroupsView && response.displaySkillGroupsView[0]) {

          let groups = response.displaySkillGroupsView[0].skillGroups;
          this.dispatcher.dispatch(ORGANISATION_SKILLS_ACTIONS.RETRIEVE_SKILL_GROUPS, groups);
        } else {

          this.dispatcher.dispatch(ORGANISATION_SKILLS_ACTIONS.RETRIEVE_SKILL_GROUPS, []);
        }
      }, (error) => {

        this.dispatcher.dispatch(ORGANISATION_SKILLS_ACTIONS.RETRIEVE_SKILL_GROUPS, []);
      }
    );
  }

  retrieveSkills(skillGroupId) {

    this.applicationService.displaySkillsSearch(skillGroupId).then(
      response=> {

        if (response.displaySkillsView && response.displaySkillsView[0]) {
          let skills = response.displaySkillsView[0].skills;
          this.dispatcher.dispatch(ORGANISATION_SKILLS_ACTIONS.RETRIEVE_SKILLS, skills);
        }else {
          this.dispatcher.dispatch(ORGANISATION_SKILLS_ACTIONS.RETRIEVE_SKILLS, []);
        }
      });
  }

  setSelectedGroup(groupName) {

    this.dispatcher.dispatch(ORGANISATION_SKILLS_ACTIONS.SET_SELECTED_GROUP, groupName);
  }

  addSkillGroup(group) {

    let organisationId = this.userSession.organisationId;
    let skillGroupId = group.id;
    this.applicationService.addSkillGroup(organisationId, skillGroupId, group.name);
  }

  addSkill(skillGroupId, skill) {

    let organisationId = this.userSession.organisationId;
    this.applicationService.addSkill(organisationId, skillGroupId, skill.id, skill.name);
  }

  handleSkillGroupAddedEvent(response) {

    let skillGroup = response.state;
    this.dispatcher.dispatch(ORGANISATION_SKILLS_ACTIONS.ACCEPT_ADD_SKILL_GROUP_SUCCESS, skillGroup);
  }

  handleSkillAddedEvent(response) {

    let skill = response.state;
    this.dispatcher.dispatch(ORGANISATION_SKILLS_ACTIONS.ACCEPT_ADD_SKILL_SUCCESS, skill);
  }

  removeSkillGroup(skillGroup) {
    for (let sg of skillGroup) {
      let organisationId = this.userSession.organisationId;
      let skillGroupId = sg.skillGroupId;
      let skillGroupName = sg.skillGroupName;
      this.applicationService.removeSkillGroup(organisationId, skillGroupId, skillGroupName);
    }
  }

  removeSkill(skill, skillGroupId) {

    for (let s of skill) {
      let organisationId = this.userSession.organisationId;
      let skillId = s.skillId;
      let skillName = s.skillName;
      this.applicationService.removeSkill(organisationId, skillGroupId, skillId, skillName);
    }
  }

}
