/*
*/
import {DashboardVessel} from 'zailab.framework';
/*
*/
import {DashboardService} from '../../dashboard.service';
/*
*/
import {OrganisationStore} from '../organisation.store';
import {OrganisationService} from '../organisation.service';
/*
*/
import {OrganisationAdminStore} from './organisation.admin.store';
import {OrganisationAdminService} from './organisation.admin.service';
import {OrganisationAdminConfig} from './organisation.admin.configuration';
import {ORGANISATION_ADMIN_ACTIONS} from './organisation.admin.actions';
/*
*/
import {ArrayTools} from '../../../../_common/tools/array.tools';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {handle} from 'aurelia-flux';
/*
*/
const logger = LogManager.getLogger('OrganisationAdmin');

@inject(DashboardService, OrganisationStore, OrganisationService, OrganisationAdminStore, OrganisationAdminService, OrganisationAdminConfig, Router)
export class OrganisationAdmin extends DashboardVessel {

  isBound = false;
  isDataRetrieved = false;
  isActivated = false;
  neededActions = [];
  completedActions = [];

  constructor(dashboardService, organisationStore, organisationService, organisationAdminStore, organisationAdminService, organisationAdminConfig, router) {
    
    super(dashboardService, organisationAdminConfig);

    this.organisationStore = organisationStore;
    this.organisationService = organisationService;

    this.organisationAdminStore = organisationAdminStore;
    this.organisationAdminService = organisationAdminService;

    this.router = router;
  }
  
  deactivate() {
    
    this.deactivateDashboard();
  }

  activate() {

    if (this.organisationStore.isAdminDone) {

      this.router.navigate('');
      return;
    }

    this.neededActions.push(ORGANISATION_ADMIN_ACTIONS.RETRIEVE_ADMIN_COS);
    this.neededActions.push(ORGANISATION_ADMIN_ACTIONS.RETRIEVE_ADMIN_SERVICES);
    this.neededActions.push(ORGANISATION_ADMIN_ACTIONS.RETRIEVE_ADMIN_SITES);

    this.organisationAdminService.retrieveCos(this.organisationAdminStore.cos);
    this.organisationAdminService.retrieveServices(this.organisationAdminStore.services);
    this.organisationAdminService.retrieveSites(this.organisationAdminStore.sites);
  }

  done() {

    this.organisationService.completeAdmin(this.organisationAdminStore);

    this.router.navigate('');
  }

  @handle('admin.retrieve.*') // waiting for all data to be retrieved
  handleRetrieveAdmin(action) {

    this.completedActions.push(action);

    this.activateDashboard();
  }
}

