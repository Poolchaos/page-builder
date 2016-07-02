/*/
*/
import {Crud, PromptFactory, PromptService} from 'zailab.framework';
/*
*/
import {ORGANISATION_MEMBERS_ACTIONS} from '../organisation.members.actions';
import {OrganisationMembersService} from '../organisation.members.service';
import {OrganisationMembersStore} from '../organisation.members.store';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
import {Router} from 'aurelia-router';
/*
 */
import uuid from 'node-uuid';
/*
*/
const logger = LogManager.getLogger('OrganisationMembersEmails');
const SETTINGS = {
  add: {enabled: true},
  delete: {enabled: true},
  select: {enabled: false},
  edit: {enabled: true}
};
/*
*/
@inject(OrganisationMembersService, OrganisationMembersStore, PromptFactory, PromptService, Router)
export class OrganisationMembersEmails extends Crud {

  constructor(organisationMembersService, organisationMembersStore, promptFactory, promptService, router) {

    super(SETTINGS);

    this.organisationMembersService = organisationMembersService;
    this.organisationMembersStore = organisationMembersStore;

    this.promptFactory = promptFactory;
    this.promptService = promptService;

    this.router = router;
  }

  activate() {

    this.reset(this.organisationMembersStore.member.emails);
  }

  change(email) {

    let title = 'Change Email';
    let item = {address: email.address, id: email.id};
    let acceptAction = ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER_EMAIL;

    let option = this.promptFactory.buildFormPrompt(title, item, acceptAction);
    option.promptModel.icon = 'email';

    this.promptService.openPrompt(option);
  }

  add() {

    let title = 'Assign Email';
    let item = {address: '', id: uuid.v4()};
    let acceptAction = ORGANISATION_MEMBERS_ACTIONS.ADD_MEMBER_EMAIL;

    let option = this.promptFactory.buildFormPrompt(title, item, acceptAction);
    option.promptModel.icon = 'email';

    this.promptService.openPrompt(option);
  }

  done() {

    this.organisationMembersService.completeMember();
    this.router.navigate('');
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.ADD_MEMBER_EMAIL)
  @waitFor(OrganisationMembersStore)
  handleAddMemberEmail() {

    this.reset(this.organisationMembersStore.member.emails);
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER_EMAIL)
  @waitFor(OrganisationMembersStore)
  handleChangeMemberEmail() {

    this.reset(this.organisationMembersStore.member.emails);
  }
}
