/*
*/
import {DashboardService} from '../../../dashboard.service';
/*
*/
import {OrganisationStore} from '../../organisation.store';
/*
*/
import {OrganisationMembersService} from '../organisation.members.service';
import {OrganisationMembersStore} from '../organisation.members.store';
import {ORGANISATION_MEMBERS_ACTIONS} from '../organisation.members.actions';
/*
*/
import {OrganisationMembersAttributesConfig} from './organisation.members.attributes.configuration';
/*
*/
import {ArrayTools} from '../../../../../_common/tools/array.tools';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {handle, waitFor} from 'aurelia-flux';
/*
*/
const logger = LogManager.getLogger('OrganisationMembersAttributes');

@inject(DashboardService, OrganisationStore, OrganisationMembersService, OrganisationMembersStore, OrganisationMembersAttributesConfig, Router)
export class OrganisationMembersAttributes {

  isBound = false;
  isDataRetrieved = false;
  isActivated = false;
  neededActions = [];
  completedActions = [];

  constructor(dashboardService, organisationStore, organisationMembersService, organisationMembersStore, organisationMembersAttributesConfig, router) {

    this.dashboardService = dashboardService;

    this.organisationStore = organisationStore;

    this.organisationMembersService = organisationMembersService;
    this.organisationMembersStore = organisationMembersStore;
    
    logger.debug('constructor > this.organisationMembersStore.member.role = ', this.organisationMembersStore.member.role);

    this.organisationMembersAttributesConfig = organisationMembersAttributesConfig;

    this.router = router;

    this.dashboardService.onAttached(() => { // waiting for onAttached to make sure that the store has been initialised - in the dashboard interface

      this.doAttached();
    });
  }

  deactivate() {

//    this.dashboardService.deactivateDashboard();
  }

  activate() {

//    if (this.organisationStore.isReady === false) {
//
//      return;
//    }

    if (!this.organisationMembersStore.attributes) {
      this.neededActions.push(ORGANISATION_MEMBERS_ACTIONS.RETRIEVE_MEMBERS_ATTRIBUTES);
    }

    if (!this.organisationMembersStore.attributes) {
      this.organisationMembersService.retrieveAttributes(this.organisationStore);
    }
  }

  activateDashboard() {

    this.isDataRetrieved = ArrayTools.containsAll(this.completedActions, this.neededActions);

    if (this.isActivated || this.isBound === false || this.isDataRetrieved === false) {

      return;
    }

    this.isActivated = true;

    let helmViewModel = this.organisationMembersAttributesConfig.helmViewModel;
    let portItems = this.organisationMembersAttributesConfig.portItems;
    let starboardItems = this.organisationMembersAttributesConfig.starboardItems;

    this.dashboardService.activateDashboard(helmViewModel, portItems, starboardItems);
  }

  doAttached() {

//    if (this.organisationStore.isReady === false) {
//
//      this.router.parent.parent.navigate('');
//      return;
//    }

    this.isBound = true;
    this.activateDashboard();
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.RETRIEVE_MEMBERS_ATTRIBUTES)
  @waitFor(OrganisationMembersStore)
  handleRetrieveMembersAttributes(action) {

    this.completedActions.push(action);
    this.activateDashboard();
  }

  next() {

    this.router.navigate('emails');
  }
}
