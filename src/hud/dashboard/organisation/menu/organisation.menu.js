/*
*/
import {DashboardVessel} from 'zailab.framework';
/*
*/
import {DashboardService} from '../../dashboard.service';
/*
*/
import {OrganisationStore} from '../organisation.store';
/*
*/
import {OrganisationMenuConfig} from './organisation.menu.configuration';
import {OrganisationMenuService} from './organisation.menu.service';
import {OrganisationMenuStore} from './organisation.menu.store';
import {ORGANISATION_MENU_ACTIONS} from './organisation.menu.actions';
import {UserSession} from 'zailab.common';
/*
*/
import {ArrayTools} from '../../../../_common/tools/array.tools';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {handle, waitFor} from 'aurelia-flux';
/*
*/
const logger = LogManager.getLogger('OrganisationMenu');

@inject(DashboardService, OrganisationStore, OrganisationMenuService, OrganisationMenuStore, OrganisationMenuConfig, UserSession, Router)
export class OrganisationMenu extends DashboardVessel {

  guide = "This is your organisation's management page. This allows you to manage who belongs in your organisation and how communication with your customers should be handled.";
  
  constructor(dashboardService, organisationStore, organisationMenuService, organisationMenuStore, organisationMenuConfig, userSession, router) {
    
    super(dashboardService, organisationMenuConfig);

    this.organisationStore = organisationStore;
    this.organisationMenuService = organisationMenuService;
    this.organisationMenuStore = organisationMenuStore;
    this.organisationMenuConfig = organisationMenuConfig;
    this.userSession = userSession;
    this.router = router;
    
  }
  
  deactivate() {
    
    this.deactivateDashboard();
  }

  activate() {

    if (!this.organisationMenuStore.menu) {
      this.neededActions.push(ORGANISATION_MENU_ACTIONS.RETRIEVE_ORGANISATION_MENU);
    }

    if (!this.organisationMenuStore.menu) {
      this.organisationMenuService.retrieveMenu();
    }
  }

  @handle(ORGANISATION_MENU_ACTIONS.RETRIEVE_ORGANISATION_MENU)
  @waitFor(OrganisationMenuStore)
  handleRetrieveOrganisationMenu(action) {

    this.completedActions.push(action);
    this.activateDashboard();
  }

  @handle('dashboard.select.option.*')
  handleSelectDashboardOption(action, data) {
    
    if(data.isInteractionLog){
      this.router.parent.parent.navigate('interactionlog');
      return;
    }
    
    setTimeout(() => this.router.navigate(data.route), 100);
  }
}
