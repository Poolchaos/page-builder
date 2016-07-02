/*
*/
import {DashboardVessel} from 'zailab.framework';
/*
*/
import {DashboardService} from '../../../dashboard.service';
/*
*/
// import {OrganisationStore} from '../../organisation.store';
/*
*/
import {ORGANISATION_INVITATIONS_ACTIONS} from '../organisation.invitations.actions';
import {OrganisationInvitationsService} from '../organisation.invitations.service';
import {OrganisationInvitationsStore} from '../organisation.invitations.store';
/*
*/
import {OrganisationInvitationsAttributesConfig} from './organisation.invitations.attributes.configuration';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {handle, waitFor} from 'aurelia-flux';
/*
*/
const logger = LogManager.getLogger('OrganisationMembersAttributes');
/*
*/
@inject(DashboardService, OrganisationInvitationsService, OrganisationInvitationsStore, OrganisationInvitationsAttributesConfig, Router)
export class OrganisationInvitationsAttributes extends DashboardVessel {
  
  guide = 'Please select the properties of your members. This will help me know me what type of work to serve them and what permission to grant them.';

  intercept = {
    next: () => this.validate(),
    prev: () => this.validate()
  };
  
  constructor(dashboardService, organisationInvitationsService, organisationInvitationsStore, organisationInvitationsAttributesConfig, router) {

    super(dashboardService, organisationInvitationsAttributesConfig);
    
    this.organisationInvitationsService = organisationInvitationsService;
    this.organisationInvitationsStore = organisationInvitationsStore;
    this.router = router;
  }

  activate() {
    
    this.organisationInvitationsService.setError('');

    this.organisationInvitationsService.setCurrentStep('attributes');
    
    if (this.organisationInvitationsStore.isEmpty) {
      this.neededActions.push(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_INVITATION_ATTRIBUTES);
      this.organisationInvitationsService.retrieveInvitationAttributes();
    }
  }

  @handle(ORGANISATION_INVITATIONS_ACTIONS.RETRIEVE_INVITATION_ATTRIBUTES)
  @waitFor(OrganisationInvitationsStore)
  handleRetrieveInvitationAttributes(action) {  
    
    this.completedActions.push(action);
    this.activateDashboard();
  }

  get title() {

    return {
      link: {
        action: () => this.cancel(),
        name: 'Invitations'
      },
      subTitle: 'Send Invitations'
    };
  }

  get icon() {

    return 'invitations';
  }

  back() {
    
    this.router.navigate('role');
  }

  validate() {
    
    let selectedServices = this.organisationInvitationsStore.invitation.services;
    if(selectedServices.length === 0){
      this.organisationInvitationsService.setError('Please select at least one service before continuing.');
      return false;
    }
    
    let selectedSite = this.organisationInvitationsStore.invitation.site;
    if(!selectedSite || !selectedSite.name){
      this.organisationInvitationsService.setError('Please select a site before continuing.');
      return false;
    }
    this.organisationInvitationsService.setError('');
    
    return true;
  }

  cancel() {
    
    this.router.navigate('');
  }
}
