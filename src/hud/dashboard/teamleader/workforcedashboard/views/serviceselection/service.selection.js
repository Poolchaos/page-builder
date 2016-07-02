import {Router} from 'aurelia-router';
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher, handle, waitFor} from 'aurelia-flux';
/*
*/
import {UserSession} from 'zailab.common';
/*
*/
import {WorkforceDashboardService} from '../../workforce.dashboard.service';
import {WorkforceDashboardStore} from '../../workforce.dashboard.store';
import {WORKFORCE_DASHBOARD_ACTIONS} from '../../workforce.dashboard.actions';
/*
*/
const logger = LogManager.getLogger('ServiceSelection');
/*
*/
@inject(Router, WorkforceDashboardService, WorkforceDashboardStore, Dispatcher, UserSession)
export class ServiceSelection {
  
  constructor(router, workforceDashboardService, workforceDashboardStore, dispatcher, userSession) {
    this.router = router;
    this.workforceDashboardService = workforceDashboardService;
    this.workforceDashboardStore = workforceDashboardStore;
    this.dispatcher = dispatcher;
    this.userSession = userSession;
  }
  
  activate() {

    this.workforceDashboardService.retrieveOrganisationServices();
  }
  
  selectService(service){
    
    this.router.navigateToRoute('expandedchart', {serviceId: service.serviceId}, {replace: true});
  }
  
}