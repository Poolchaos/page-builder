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
import {OrganisationSetupStore} from './organisation.setup.store';
import {OrganisationSetupService} from './organisation.setup.service';
import {OrganisationSetupConfig} from './organisation.setup.configuration';
import {ORGANISATION_SETUP_ACTIONS} from './organisation.setup.actions';
/*
*/
import {ArrayTools} from '../../../../_common/tools/array.tools';
/*
aurelia
*/
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {handle} from 'aurelia-flux';
/*
Logger
*/
const logger = LogManager.getLogger('OrganisationSetup');
/*
OrganisationSetup - this module shows the options available to the admin user - a user that maintains the org
*/
@inject(DashboardService, OrganisationSetupConfig, OrganisationStore, OrganisationService, OrganisationSetupStore, OrganisationSetupService, Router)
export class OrganisationSetup extends DashboardVessel {

  settings = {
    add: {enabled: false},
    delete: {enabled: false},
    select: {enabled: false},
    edit: {enabled: true},
    labels: {enabled: false}
  };

  options = {
    change: (item) => this.change(item)
  };

  title = {
    link: {
      action: () => this.back(),
      name: 'organisation'
    },
    subTitle: 'Setup'
  };

  icon = 'organisation';

  constructor(dashboardService, organisationSetupConfig, organisationStore, organisationService, organisationSetupStore, organisationSetupService, router) {

    super(dashboardService, organisationSetupConfig);

    this.organisationStore = organisationStore;
    this.organisationService = organisationService;

    this.organisationSetupStore = organisationSetupStore;
    this.organisationSetupService = organisationSetupService;

    this.router = router;
  }

  activate() {

    if (!this.organisationSetupStore.name) {
      this.neededActions.push(ORGANISATION_SETUP_ACTIONS.RETRIEVE_ORGANISATION_NAME);
    }

    if (!this.organisationSetupStore.name) {
      this.organisationSetupService.retrieveName();
    }

  }

  change(name) {
    //    this.organisationServicesService.deactivateService(service);
  }

  back() {

    this.router.navigate('');
  }

  @handle(ORGANISATION_SETUP_ACTIONS.RETRIEVE_ORGANISATION_NAME)
  handleRetrieveOrganisationName(action) {
    this.completedActions.push(action);
    this.activateDashboard();
  }
}
