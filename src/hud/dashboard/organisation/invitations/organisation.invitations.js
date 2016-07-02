/*
*/
import {OrganisationInvitationsService} from './organisation.invitations.service';
import {OrganisationInvitationsStore} from './organisation.invitations.store';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
/*
*/
const logger = LogManager.getLogger('Invitations');
/*
*/
@inject(OrganisationInvitationsService, OrganisationInvitationsStore, Router)
export class OrganisationInvitations {

  constructor(organisationInvitationsService, organisationInvitationsStore, router) {

    this.organisationInvitationsService = organisationInvitationsService;
    this.organisationInvitationsStore = organisationInvitationsStore;
    this.router = router;
  }

  activate() {

    this.organisationInvitationsService.registerEvents();
    
    /*
    do the following query also here (outside list) so the email validation rule can include the existing invites 
    even if the page is refreshed during the invite process on the emails step 
    */
    this.organisationInvitationsService.retrievePendingInvitations();
    
//    if(!this.organisationInvitationsStore.invitation.site.name || this.organisationInvitationsStore.invitation.site.name.length === 0 || !this.organisationInvitationsStore.invitation.services || this.organisationInvitationsStore.invitation.services.length === 0) {
//      
//      console.log('this.router >>> ', this.router);
//      
//      this.router.navigate('hud/dashboard/organisation/invitations/role');
//    }
  }

  deactivate() {

    this.organisationInvitationsService.deregisterEvents();
  }

  configureRouter(config, router) {

    let routeMap = [
      {route: '',             name: 'list',       moduleId: 'hud/dashboard/organisation/invitations/list/organisation.invitations.list',             nav: false, title: 'Invitations'},
      {route: 'role',         name: 'role',       moduleId: 'hud/dashboard/organisation/invitations/role/organisation.invitations.role',             nav: false, title: 'Select a role', icon: 'roles'},
      {route: 'attributes',   name: 'attributes', moduleId: 'hud/dashboard/organisation/invitations/attributes/organisation.invitations.attributes', nav: false, title: 'Define attributes'},
      {route: 'emails',       name: 'emails',     moduleId: 'hud/dashboard/organisation/invitations/emails/organisation.invitations.emails',         nav: false, title: 'Add emails', icon: 'email-solid'}
    ];

    config.map(routeMap);

    this.router = router;
  }

}
