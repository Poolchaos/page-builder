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
const logger = LogManager.getLogger('OrganisationMembersList');
/*
*/
@inject(OrganisationMembersService, OrganisationMembersStore, Router)
export class OrganisationMembersList  {

  display = 'text';

  settings = {
    add: {enabled: false},
    delete: {enabled: true},
    select: {enabled: false},
    edit: {enabled: true},
    labels: {enabled: true}
  };
  options = {
    change: (item) => this.change(item),
    remove: (items) => this.remove(items)
  };

  guide = 'This is a list of the members in your organisation. You can view and amend the properties of your members by selecting one from the list below.';

  resolve = null;

  constructor(organisationMembersService, organisationMembersStore, router) {

    this.organisationMembersService = organisationMembersService;
    this.organisationMembersStore = organisationMembersStore;
    this.router = router;
  }

  canActivate() {
    this.organisationMembersService.retrieveMembers();

    return new Promise((resolve) => this.resolve = resolve);
  }

  get itemcount() {
    return this.organisationMembersStore.members.length;
  }

  change(member) {

    let memberId = member.memberId;

    this.organisationMembersService.changeMember(member);
  }

  remove(members) {
    this.organisationMembersService.removeMembers(members);
  }

  back() {

    this.router.parent.navigate('');
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.RETRIEVE_MEMBERS)
  @waitFor(OrganisationMembersStore)
  handleRetrieveMember() {

    if (this.resolve !== null) {

      this.resolve(true);
      this.resolve = null;
    }
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.CHANGE_MEMBER)
  @waitFor(OrganisationMembersStore)
  handleChangeMember() {

    setTimeout(() => {
      this.router.navigateToRoute('attributes', {memberId: this.organisationMembersStore.member.memberId});
    }, 55);
  }
}
