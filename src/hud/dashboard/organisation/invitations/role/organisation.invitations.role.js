/*
*/
import {OrganisationInvitationsService} from '../organisation.invitations.service';
import {OrganisationInvitationsStore} from '../organisation.invitations.store';
import {ORGANISATION_INVITATIONS_ACTIONS} from '../organisation.invitations.actions';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {handle, waitFor} from 'aurelia-flux';
/*
*/

const logger = LogManager.getLogger('OrganisationInvitationsRole');

@inject(Router, OrganisationInvitationsService, OrganisationInvitationsStore)
export class OrganisationInvitationsRole {
  
  settings = {
    add: {enabled: false},
    delete: {enabled: false},
    select: {enabled: true},
    edit: {enabled: true},
    total: {enabled: false},
    labels: {enabled: true}
  };

  display = 'text';

	options = {
    compare: (role, searchText) => this.compare(role, searchText),
    change: (role) => this.selectRole(role)
	};

  guide = 'Please select the role that you would like your new members to have. Role defines what work they should do and what permission your members should have.';

  resolve = null;

  constructor(router, organisationInvitationsService, organisationInvitationsStore) {
    this.router = router;
    this.organisationInvitationsService = organisationInvitationsService;
    this.organisationInvitationsStore = organisationInvitationsStore;
  }

  compare(item, searchText) {

    for (let role of item.text) {

      if (role.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
        return true;
      }
    }

    return false;
  }

  activate(){
    
    this.organisationInvitationsService.setCurrentStep('role');
  }

  canActivate() {

    this.organisationInvitationsService.retrieveRoles();

    return new Promise((resolve) => this.resolve = resolve);
  }

  selectRole(role) {

    this.organisationInvitationsService.selectRole(role);
  }

  back() {
    this.router.parent.navigate('invitations');
  }

  next() {
    this.router.navigate('attributes');
  }

  cancel() {
    this.router.navigate('');
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.SELECT_INVITATION_ROLE)
  @waitFor(OrganisationInvitationsStore)
  handleSelectMemberRole() {

    setTimeout(() => this.next(), 55);
  }  

  @handle(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_ROLES)
  @waitFor(OrganisationInvitationsStore)
  handleRetrieveRoles() {

    if (this.resolve !== null) {
      this.resolve(true);
      this.resolve = null;
    } 
  }
}
