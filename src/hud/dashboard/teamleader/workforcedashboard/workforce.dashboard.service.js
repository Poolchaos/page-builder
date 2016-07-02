import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
/*
*/
import {ApplicationService, UserSession, DatabaseService} from 'zailab.common';
import {WorkforceDashboardStore} from './workforce.dashboard.store';
import {WORKFORCE_DASHBOARD_ACTIONS} from './workforce.dashboard.actions';
import {GoogleChartAPI} from './googleChart/google.chart.api';
/*
*/
const logger = LogManager.getLogger('WorkforceDashboardService');
/*
*/
@inject(ApplicationService, Dispatcher, UserSession, DatabaseService, WorkforceDashboardStore, GoogleChartAPI)
export class WorkforceDashboardService {

  constructor(applicationService, dispatcher, userSession, databaseService, workforceDashboardStore, googleChartAPI) {

    this.applicationService = applicationService;
    this.dispatcher = dispatcher;
    this.userSession = userSession;
    this.databaseService = databaseService;
    this.workforceDashboardStore = workforceDashboardStore;
    this.chartAPI = googleChartAPI;
  }

  retrieveOrganisationServices() {
    
    let organisationId = this.userSession.organisationId;
    this.applicationService.displayOrganisationSelectedServicesSearch(organisationId).then(
      response => {

        if (response.displaySelectedServicesView && response.displaySelectedServicesView[0]) {
          this.dispatcher.dispatch(WORKFORCE_DASHBOARD_ACTIONS.ORGANISATION_SERVICES_RETRIEVED, response.displaySelectedServicesView[0].selectedServices);
        }
      });
  }

  retrieveDashboardData(date, serviceId) {

    let organisationId = this.userSession.organisationId;
    this.applicationService.displayOrganisationWorkforcemanagementWorkforceDashboard(organisationId, date, serviceId).then(
      response=> {
        if (response && response.displayWorkforceDashboardView && response.displayWorkforceDashboardView[0] && response.displayWorkforceDashboardView[0].tasks.length > 0) {

          let tasks = response.displayWorkforceDashboardView[0].tasks;        
          this.dispatcher.dispatch(WORKFORCE_DASHBOARD_ACTIONS.WORKFORCE_DATA_RETRIEVED, tasks);
        } else{
          
          
          this.dispatcher.dispatch(WORKFORCE_DASHBOARD_ACTIONS.WORKFORCE_DATA_FAILED);
        }
      });
  }
  
  selectTask(task){
    
    let formattedData = this.chartAPI.formatChartData(task, false); // format data for selectedTask
    let taskData = { taskName:task.taskName, taskData:formattedData, sla:task.sla};
    this.dispatcher.dispatch(WORKFORCE_DASHBOARD_ACTIONS.SELECT_TASK, taskData);
  }

  selectService(service) {
    
    this.dispatcher.dispatch(WORKFORCE_DASHBOARD_ACTIONS.SERVICE_SELECTED, service);
  }

}
