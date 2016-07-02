/*
*/
import {DashboardVessel} from 'zailab.framework';
/*
*/
import {DashboardService} from '../../../dashboard.service';
import {DASHBOARD_ACTIONS} from '../../../dashboard.actions';
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
/*
*/
@inject(DashboardService, OrganisationMembersAttributesConfig, OrganisationStore, OrganisationMembersService, OrganisationMembersStore, Router)
export class OrganisationMembersAttributes extends DashboardVessel {

  resolve = null;

  constructor(dashboardService, organisationMembersAttributesConfig, organisationStore, organisationMembersService, organisationMembersStore, router) {

    super(dashboardService, organisationMembersAttributesConfig);

    this.organisationStore = organisationStore;

    this.organisationMembersService = organisationMembersService;
    this.organisationMembersStore = organisationMembersStore;

    this.router = router;
  }

  get title() {

    return {
      link: {
        action: () => this.back(),
        name: 'Members'
      },
      subTitle: 'Member Properties'
    };
  }

  get icon() {

    return 'members';
  }

  deactivate() {

    this.deactivateDashboard();
  }

  canActivate(params) {

    this.neededActions.push(ORGANISATION_MEMBERS_ACTIONS.RETRIEVE_ORGANISATION_ATTRIBUTES);
    this.organisationMembersService.retrieveViewModel(params.memberId);

    return new Promise((resolve) => this.resolve = resolve);
  }

  activate(params) {

  }

  back() {

    this.router.navigate('');
  }

  @handle(ORGANISATION_MEMBERS_ACTIONS.RETRIEVE_ORGANISATION_ATTRIBUTES)
  @waitFor(OrganisationMembersStore)
  handleRetrieveOrganisationAttributes(action) {

    if (this.resolve !== null) {
      this.resolve(true);
      this.resolve = null;
    }

    this.completedActions.push(action);
    this.activateDashboard();
  }
}
