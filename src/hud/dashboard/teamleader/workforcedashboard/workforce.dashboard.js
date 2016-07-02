import {Router} from 'aurelia-router';
import {inject, LogManager} from 'aurelia-framework';
/*
*/
import {WorkforceDashboardService} from './workforce.dashboard.service';
import {WorkforceDashboardStore} from './workforce.dashboard.store';
/*
*/
const logger = LogManager.getLogger('WorkforceDashboard');
/*
*/
@inject(Router, WorkforceDashboardService, WorkforceDashboardStore)
export class WorkforceDashboard {

  constructor(router, workforceDashboardService, workforceDashboardStore) {

    this.router = router;
    this.workforceDashboardService = workforceDashboardService;
    this.workforceDashboardStore = workforceDashboardStore;
  }

  configureRouter(config, router) {

    let routeMap = [
      //{route: '',                           name: 'serviceselection', moduleId: 'hud/dashboard/teamleader/workforcedashboard/views/serviceselection/service.selection', nav: false, title: 'Service Selection'},
      {route: '',   name: 'expandedchart',    moduleId: 'hud/dashboard/teamleader/workforcedashboard/views/expandedchart/expanded.chart',       nav: false, title: 'Workforce Dashboard'}
    ];

    config.map(routeMap);
    this.router = router;

  }

}
