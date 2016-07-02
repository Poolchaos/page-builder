/*
*/
import {ORGANISATION_SKILLS_ACTIONS} from '../organisation.skills.actions';
import {OrganisationSkillsService} from '../organisation.skills.service';
import {OrganisationSkillsStore} from '../organisation.skills.store';
import {UniqueSkillGroupValidationRule} from './organisation.skills.groups.validation';
/*
*/
import {PromptFactory, PromptService} from 'zailab.framework';
//import {DisplayMessageService} from 'zailab.common';
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
const logger = LogManager.getLogger('OrganisationSkillsGroups');
/*
*/
@inject(OrganisationSkillsService, OrganisationSkillsStore, PromptFactory, PromptService, Router)
export class OrganisationSkillsGroups{

  resolve;

  settings = {
    add:    {enabled: true},
    delete: {enabled: true},
    select: {enabled: false},
    edit:   {enabled: true},
    labels: {enabled: true}
  };

  display = 'skillGroupName';

	options = {
    change: (group) => this.selectSkillGroup(group),
    add: () => this.add(),
    remove: (items) => this.remove(items)
	};

  guide = 'This is a list of the types of skills you have in your organisation. Skills are categorised into types so that they can be accessed quickly. Select or create a Skill Category to amend and create skills.';

  constructor(organisationSkillsService, organisationSkillsStore, promptFactory, promptService, router) {
    
    this.organisationSkillsService = organisationSkillsService;
    this.organisationSkillsStore = organisationSkillsStore;
    this.promptFactory = promptFactory;
    this.promptService = promptService;
    this.router = router;
  }

  canActivate() {
    
    this.organisationSkillsService.retrieveSkillGroups();

    return new Promise((resolve) => this.resolve = resolve);
  }

  get itemcount() {
    return this.organisationSkillsStore.skillGroups.length;
  }

  add() {

    let title = 'Add Skill Category';
    let item = {id: uuid.v4(), name: ''};
    let acceptAction = ORGANISATION_SKILLS_ACTIONS.ACCEPT_ADD_SKILL_GROUP;
    let skillGroups = this.organisationSkillsStore.skillGroups;
    let option = this.promptFactory.buildFormPrompt(title, item, acceptAction);
    option.promptModel.icon = 'group-skills'; // i made a change here
    option.promptModel.rule = {
      name: new UniqueSkillGroupValidationRule(skillGroups)
    };

    this.promptService.openPrompt(option);
  }

  remove(skillGroup) {
    
    this.organisationSkillsService.removeSkillGroup(skillGroup);
  }

  selectSkillGroup(group) {

    this.router.navigateToRoute('skills', {skillGroupName: group.skillGroupName, skillGroupId: group.skillGroupId}, {replace: true});
  }

  back() {
    
    this.router.parent.navigate('');
  }

  @handle(ORGANISATION_SKILLS_ACTIONS.RETRIEVE_SKILL_GROUPS)
  @waitFor(OrganisationSkillsStore)
  handleRetrieveSkillGroups(action, model) {
    
    this.resolve(true);
  }

  @handle(ORGANISATION_SKILLS_ACTIONS.ACCEPT_ADD_SKILL_GROUP)
  @waitFor(OrganisationSkillsStore)
  handleAcceptAddSkillGroup(action, model) {
    
    this.organisationSkillsService.addSkillGroup(model.item);
  }

  @handle(ORGANISATION_SKILLS_ACTIONS.REMOVE_SKILL_GROUP)
  @waitFor(OrganisationSkillsStore)
  handleRemoveSkillGroup(action, model) {
    
    this.organisationSkillsService.removeSkillGroup(model.item);
  }

  @handle(ORGANISATION_SKILLS_ACTIONS.SET_ERROR)
  handleSetError(action, error) {
    logger.debug('this.displayMessageService >', this.displayMessageService);
    //STATE.error = error;
  }
}
