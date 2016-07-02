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
import {OrganisationMembersSkillsConfig} from './organisation.members.skills.configuration';
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
const logger = LogManager.getLogger('OrganisationMembersSkills');

@inject(DashboardService, OrganisationStore, OrganisationMembersService, OrganisationMembersStore, OrganisationMembersSkillsConfig, Router)
export class OrganisationMembersSkills {

  isBound = false;
  isDataRetrieved = false;
  isActivated = false;
  neededActions = [];
  completedActions = [];

  constructor(dashboardService, organisationStore, organisationMembersService, organisationMembersStore, organisationMembersSkillsConfig, router) {

    this.dashboardService = dashboardService;

    this.organisationStore = organisationStore;

    this.organisationMembersService = organisationMembersService;
    this.organisationMembersStore = organisationMembersStore;

    this.organisationMembersSkillsConfig = organisationMembersSkillsConfig;

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

    if (!this.organisationMembersStore.skills) {
      this.neededActions.push(ORGANISATION_MEMBERS_ACTIONS.RETRIEVE_MEMBERS_SKILLS);
    }

    if (!this.organisationMembersStore.skills) {
      this.organisationMembersService.retrieveSkills(this.organisationMembersStore);
    }
  }

  activateDashboard() {

    this.isDataRetrieved = ArrayTools.containsAll(this.completedActions, this.neededActions);

    if (this.isActivated || this.isBound === false || this.isDataRetrieved === false) {

      return;
    }

    this.isActivated = true;

    let helmViewModel = this.organisationMembersSkillsConfig.helmViewModel;
    let portItems = this.organisationMembersSkillsConfig.portItems;
    let starboardItems = this.organisationMembersSkillsConfig.starboardItems;

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

  @handle(ORGANISATION_MEMBERS_ACTIONS.RETRIEVE_MEMBERS_SKILLS)
  @waitFor(OrganisationMembersStore)
  handleRetrieveMembersAttributes(action) {

    this.completedActions.push(action);
    this.activateDashboard();
  }

  done() {

    this.router.navigate('');
  }
}
