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
import {customElement, inject, bindable, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
/*
Logger
*/
const logger = LogManager.getLogger('DashboardInterface');
/*
Dashboard Interface - this module is an interface for dashboard sub modules, it acts as the proxy to control a generic template with common actions and view.
*/
@customElement('stale-dashboard-interface')
@inject(DashboardService, DashboardStore, PromptService)
export class DashboardInterface {

  constructor(dashboardService, dashboardStore, promptService) {

    this.dashboardService = dashboardService;
    this.dashboardStore = dashboardStore;

    this.promptService = promptService;
  }

  attached() {

    setTimeout(() => {

      this.dashboardService.attached();
    }, 200);
  }

  selectPortOption(option) {

    this.dashboardService.selectPortOption(option);

    this.promptService.openPrompt(option);
  }

  selectStarboardOption(option) {

    this.dashboardService.selectStarboardOption(option);

    this.promptService.openPrompt(option);
  }
}
