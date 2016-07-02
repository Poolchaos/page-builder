import {DashboardVessel} from 'zailab.framework';
/*
/*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
/*
*/
import {DashboardService} from '../../dashboard.service';
import {OrganisationProfileConfig} from './organisation.profile.configuration';
import {OrganisationProfileService} from './organisation.profile.service';
import {OrganisationProfileStore} from './organisation.profile.store';
import {ORGANISATION_PROFILE_ACTIONS} from './organisation.profile.actions';
/*
*/
const logger = LogManager.getLogger('OrganisationProfile');
/*
*/
@inject(DashboardService, OrganisationProfileConfig, OrganisationProfileService, OrganisationProfileStore)
export class OrganisationProfile extends DashboardVessel {

  resolve = null;

  constructor(dashboardService, organisationProfileConfig, organisationProfileService, organisationProfileStore) {

    super(dashboardService, organisationProfileConfig);

    this.dashboardService = dashboardService;
    this.organisationProfileService = organisationProfileService;
    this.organisationProfileStore = organisationProfileStore;

  }


  activate() {

    this.neededActions.push(ORGANISATION_PROFILE_ACTIONS.RETRIEVE_ORGANISATION_INFO);
    this.organisationProfileService.retrieveOrganisationInfo();
  }

  get title() {

    return {subTitle: 'Organisation Information'};
  }

  get icon() {

    return 'members';
  }

  @handle(ORGANISATION_PROFILE_ACTIONS.RETRIEVE_ORGANISATION_INFO)
  @waitFor(OrganisationProfileStore)
  handleRetrievePersonalInfo(action, info) {

    this.completedActions.push(action);
    this.activateDashboard();

  }
//
//  @handle(ORGANISATION_PROFILE_ACTIONS.RETRIEVE_OUTBOUND_CALL_OPTIONS)
//  @waitFor(OrganisationProfileStore)
//  handleRetrieveOutboundCallOptionsInfo(action, info) {
//
//    this.completedActions.push(action);
//    this.activateDashboard();
//
//  }

}
