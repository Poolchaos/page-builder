/*
*/
import {ORGANISATION_MEMBERS_ACTIONS} from './organisation.members.actions';
import {OrganisationMembersService} from './organisation.members.service';
import {OrganisationMembersStore} from './organisation.members.store';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
import {Router} from 'aurelia-router';
/*
*/
const logger = LogManager.getLogger('OrganisationMembers');
/*
*/
@inject(OrganisationMembersService, OrganisationMembersStore, Router)
export class OrganisationMembers  {

  display = 'text';

  settings = {
    add:    {enabled: false},
    delete: {enabled: false},
    select: {enabled: false},
    edit:   {enabled: false},
    labels: {enabled: true}
  };

  guide = 'This is a list of the members in your organisation.';

  resolve = null;

  constructor(organisationMembersService, organisationMembersStore, router) {

    this.organisationMembersService = organisationMembersService;
    this.organisationMembersStore = organisationMembersStore;
    this.router = router;
    
    this.init();
  }

  init() {
    
    this.organisationMembersService.hideWidgets();
  }

  canActivate() {

    this.organisationMembersService.retrieveMembers();

    return new Promise((resolve) => this.resolve = resolve);
  }

  get itemcount() {
    return this.organisationMembersStore.members.length;
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.RETRIEVE_MEMBERS)
  @waitFor(OrganisationMembersStore)
  handleRetrieveMember() {

    if (this.resolve !== null) {

      this.resolve(true);
      this.resolve = null;
    }
  }
}
