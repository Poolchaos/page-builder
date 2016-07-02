/*
*/
import {DASHBOARD_ACTIONS} from '../../dashboard.actions';
import {DashboardService} from '../../dashboard.service';
/*
*/
import {OrganisationStore} from '../../organisation/organisation.store';
/*
./*/
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {handle} from 'aurelia-flux';
/*
*/
const logger = LogManager.getLogger('UserCreateOrganisation');
/*
*/
@inject(DashboardService, OrganisationStore, Router)
export class UserCreateOrganisation {

  constructor(dashboardService, organisationStore, router) {

    this.dashboardService = dashboardService;
    this.organisationStore = organisationStore;
    this.router = router;
  }

  createOrganisation() {

    this.router.parent.navigate('organisation');
  }
  
}
