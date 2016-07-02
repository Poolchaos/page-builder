/*
zailab
*/
import {DASHBOARD_ACTIONS} from '../dashboard.actions';
import {DashboardService} from '../dashboard.service';
import {DashboardStore} from '../dashboard.store';
/*
*/
import {PromptService} from 'zailab.framework';
/*
aurelia
*/
import {inject, customElement, LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
/*
Logger
*/
const logger = LogManager.getLogger('DashboardVessel');
/*
Dashboard Interface - this module is an interface for dashboard sub modules, it acts as the proxy to control a generic template with common actions and view.
*/
@customElement('dashboard-vessel')
@inject(DashboardService, DashboardStore, PromptService)
export class DashboardVessel {

  isReady = false;
  isCampVessel = false;
  vesselClass = '';

  constructor(dashboardService, dashboardStore, promptService) {

    this.dashboardService = dashboardService;
    this.dashboardStore = dashboardStore;

    this.promptService = promptService;
  }

  attached() {

    this.dashboardService.attached();
  }

  get isVesselReady() {

    return this.isReady;
  }

  selectPortOption(option) {

    this.dashboardService.selectPortOption(option);

    this.promptService.openPrompt(option);
  }

  selectStarboardOption(option) {

    this.dashboardService.selectStarboardOption(option);

    this.promptService.openPrompt(option);
  }

  @handle(DASHBOARD_ACTIONS.ACTIVATE_DASHBOARD)
  handleActivateDashboard() {

    this.isReady = true;
    
    if (!this.dashboardStore.portItems) {
      return;
    }
    
    if (this.dashboardStore.portItems.length === 1 && this.dashboardStore.starboardItems.length === 1 ) {
      this.vesselItems = 'row_size_1';
    }

    let portItem = this.dashboardStore.portItems[0];
    this.isCampVessel = portItem.option.promptModel !== undefined && (portItem.option.promptModel !== undefined || portItem.option.prompts !== undefined);
    this.vesselClass = this.isCampVessel === true ? 'o-view-border' : '';
  }
}
