/*
*/
import {ORGANISATION_MEMBERS_ACTIONS} from '../organisation.members.actions';
import {OrganisationMembersService} from '../organisation.members.service';
import {OrganisationMembersStore} from '../organisation.members.store';
/*
*/
import {inject} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
import {Router} from 'aurelia-router';
/*
*/
@inject(OrganisationMembersService, OrganisationMembersStore, Router)
export class OrganisationMembersRole {
  
  constructor(organisationMembersService, organisationMembersStore, router) {
    
    this.organisationMembersService = organisationMembersService;
    this.organisationMembersStore = organisationMembersStore;
    this.router = router;
  }
  
  agentRole() {
    
    this.organisationMembersService.selectRole('Agent');
  }
  
  teamLeaderRole() {
    
    this.organisationMembersService.selectRole('Team Leader');
  }
  
  administratorRole() {
    
    this.organisationMembersService.selectRole('Admin');
  }
  
  officeWorkerRole() {
    
    this.organisationMembersService.selectRole('Office Worker');
  }
  
  next() {
    
    this.router.navigate('attributes');
  }
  
  @handle(ORGANISATION_MEMBERS_ACTIONS.SELECT_MEMBER_ROLE)
  @waitFor(OrganisationMembersStore)
  handleSelectMemberRole() {
    
    setTimeout(() => this.next(), 55);
  }
}