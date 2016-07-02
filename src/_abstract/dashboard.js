import {LogManager} from 'aurelia-framework';
/*
*/
import {ArrayTools} from '../_common/tools/array.tools';
/*
*/
const logger = LogManager.getLogger('DashboardVessel');
/*
*/
export class DashboardVessel {

  isAttached = false;
  isDataRetrieved = false;
  isActivated = false;
  neededActions = [];
  completedActions = [];

  constructor(dashboardService, dashboardConfig) {

    this.dashboardService = dashboardService;
    this.dashboardConfig = dashboardConfig;

    this.dashboardService.onAttached(() => { // waiting for onAttached to make sure that the store has been initialised - in the dashboard interface

      this.isAttached = true;

      this.activateDashboard();
    });
  }

  activateDashboard() {

    this.isDataRetrieved = ArrayTools.containsAll(this.completedActions, this.neededActions);

    let flags = JSON.parse(JSON.stringify({
      isActivated: this.isActivated,
      isAttached: this.isAttached,
      isDataRetrieved: this.isDataRetrieved
    }));

    if (this.isActivated || this.isAttached === false || this.isDataRetrieved === false) {

      return;
    }

    this.isActivated = true;

    let config = JSON.parse(JSON.stringify({
      helmViewModel: this.dashboardConfig.helmViewModel,
      portItems: this.dashboardConfig.portItems,
      starboardItems: this.dashboardConfig.starboardItems
    }));

    let helmViewModel = this.dashboardConfig.helmViewModel;
    let portItems = this.dashboardConfig.portItems;
    let starboardItems = this.dashboardConfig.starboardItems;

    this.dashboardService.activateDashboard(helmViewModel, portItems, starboardItems);
  }

  deactivateDashboard() {
    
    this.dashboardService.deactivateDashboard();
  }
}
