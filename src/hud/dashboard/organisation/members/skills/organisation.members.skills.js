/*
*/
import {DashboardVessel} from 'zailab.framework';
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

@inject(DashboardService, OrganisationMembersSkillsConfig, OrganisationStore, OrganisationMembersService, OrganisationMembersStore, Router)
export class OrganisationMembersSkills extends DashboardVessel {

  constructor(dashboardService, organisationMembersSkillsConfig, organisationStore, organisationMembersService, organisationMembersStore, router) {

    super(dashboardService, organisationMembersSkillsConfig);

    this.organisationStore = organisationStore;

    this.organisationMembersService = organisationMembersService;
    this.organisationMembersStore = organisationMembersStore;

    this.router = router;
  }

  deactivate() {

    this.deactivateDashboard();
  }

  activate() {

    //    if (this.organisationStore.isReady === false) {
    //
    //      return;
    //    }
    logger.debug('this.organisationMembersStore >',this.organisationMembersStore);
    if (!this.organisationMembersStore.skills) {
      this.neededActions.push(ORGANISATION_MEMBERS_ACTIONS.RETRIEVE_MEMBERS_SKILLS);
    }

    if (!this.organisationMembersStore.skills) {
      this.organisationMembersService.retrieveSkills(this.organisationMembersStore);
    }
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
