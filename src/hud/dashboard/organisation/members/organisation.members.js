/*
zailab
*/
import {OrganisationStore} from '../organisation.store';
import {OrganisationMembersStore} from './organisation.members.store';
import {OrganisationMembersService} from './organisation.members.service';
import {UserSession} from '../../../../_common/stores/user.session';
/*
aurelia
*/
import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
/*
*/
@inject(OrganisationStore, OrganisationMembersStore, OrganisationMembersService, Router, UserSession)
export class OrganisationMembers {

  constructor(organisationStore, organisationMembersStore, organisationMembersService, router) {

    this.organisationStore = organisationStore;

    this.organisationMembersStore = organisationMembersStore;
    this.organisationMembersService = organisationMembersService;
    this.router = router;
  }

  configureRouter(config, router) {

    let routeMap = [
      {route: '',      name: 'list',  moduleId: 'hud/dashboard/organisation/members/list/organisation.members.list',   nav: false, title: 'Menu'},
      {route: 'role', name: 'role', moduleId: 'hud/dashboard/organisation/members/role/organisation.members.role', nav: false, title: 'Role'},
      {route: 'attributes/:memberId', name: 'attributes', moduleId: 'hud/dashboard/organisation/members/attributes/organisation.members.attributes', nav: false, title: 'Attributes'},
      {route: 'emails', name: 'emails', moduleId: 'hud/dashboard/organisation/members/emails/organisation.members.emails', nav: false, title: 'Emails'},
      {route: 'skills', name: 'skills', moduleId: 'hud/dashboard/organisation/members/skills/organisation.members.skills', nav: false, title: 'Skills'}
    ];

    config.map(routeMap);

    this.router = router;
  }
}
