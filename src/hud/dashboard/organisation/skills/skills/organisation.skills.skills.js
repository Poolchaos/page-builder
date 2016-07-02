/*
*/
import {ORGANISATION_SKILLS_ACTIONS} from '../organisation.skills.actions';
import {OrganisationSkillsService} from '../organisation.skills.service';
import {OrganisationSkillsStore} from '../organisation.skills.store';
import {UniqueSkillValidationRule} from './organisation.skills.skills.validation';
/*
*/
import {DisplayMessageService} from 'zailab.common';
import {PromptFactory, PromptService} from 'zailab.framework';
/*
*/
import {handle, waitFor} from 'aurelia-flux';
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
/*
*/
import uuid from 'node-uuid';
/*
*/
const logger = LogManager.getLogger('OrganisationSkillsSkills');
/*
*/
@inject(OrganisationSkillsService, OrganisationSkillsStore, PromptFactory, PromptService, Router)
export class OrganisationSkillsSkills{

  resolve;

  settings = {
    add:    {enabled: true},
    delete: {enabled: true},
    select: {enabled: false},
    edit:   {enabled: false},
    labels: {enabled: true}
  };

  display = 'text';

	options = {
    add: () => this.add(),
    remove: (items) => this.remove(items)
	};

  guide = 'This is a list of the skills in your organisation. A skill will help to match communication from your customers to agents with the appropriate expertise.';

  constructor(organisationSkillsService, organisationSkillsStore, promptFactory, promptService, router) {

    this.organisationSkillsService = organisationSkillsService;
    this.organisationSkillsStore = organisationSkillsStore;
    this.promptFactory = promptFactory;
    this.promptService = promptService;
    this.router = router;
  }

  canActivate(params) {
             
    let skillGroupName =  params.skillGroupName;
    let skillGroupId =  params.skillGroupId;
    
    this.organisationSkillsService.setSelectedGroup({skillGroupName: skillGroupName, skillGroupId: skillGroupId});
    this.organisationSkillsService.retrieveSkills(skillGroupId);
    
    this.skillGroupName = skillGroupName;

    return new Promise((resolve) => this.resolve = resolve);
  }

  get itemcount() {
    return this.organisationSkillsStore.skills.length;
  }

  add() {

    let title = 'Add Skill';
    let item = {id: uuid.v4(), name: ''};
    let acceptAction = ORGANISATION_SKILLS_ACTIONS.ACCEPT_ADD_SKILL;
    let skills = this.organisationSkillsStore.skills;
    let option = this.promptFactory.buildFormPrompt(title, item, acceptAction);
    option.promptModel.icon = 'skills';
    option.promptModel.rule = {
      name: new UniqueSkillValidationRule(skills)
    };

    this.promptService.openPrompt(option);
  }

  remove(skill) {
    let skillGroupId = this.organisationSkillsStore.selectedGroup.skillGroupId;
    this.organisationSkillsService.removeSkill(skill, skillGroupId);
  }

  back() {
    this.router.navigate('');
  }

  @handle(ORGANISATION_SKILLS_ACTIONS.RETRIEVE_SKILLS)
  @waitFor(OrganisationSkillsStore)
  handleRetrieveSkills(action, model) {
    this.resolve(true);
  }

  @handle(ORGANISATION_SKILLS_ACTIONS.ACCEPT_ADD_SKILL)
  @waitFor(OrganisationSkillsStore)
  handleAcceptAddSkill(action, model) { 

    let skillGroupId = this.organisationSkillsStore.selectedGroup.skillGroupId;
    this.organisationSkillsService.addSkill(skillGroupId, model.item);
  }
}
