import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher, handle, waitFor} from 'aurelia-flux';
/*
*/
import {UserSession} from 'zailab.common';
/*
*/
import {ExpandedChartUtils} from './expanded.chart.utils';
import {WorkforceDashboardService} from '../../workforce.dashboard.service';
import {WorkforceDashboardStore} from '../../workforce.dashboard.store';
import {WORKFORCE_DASHBOARD_ACTIONS} from '../../workforce.dashboard.actions';
import {GoogleChartAPI} from '../../googleChart/google.chart.api';
/*
*/
const logger = LogManager.getLogger('ExpandedChart');
/*
*/
@inject(ExpandedChartUtils, WorkforceDashboardService, WorkforceDashboardStore, Dispatcher, UserSession, GoogleChartAPI)
export class ExpandedChart {

  constructor(expandedChartUtils, workforceDashboardService, workforceDashboardStore, dispatcher, userSession, googleChartAPI) {
    
    this.expandedChartUtils = expandedChartUtils;
    this.workforceDashboardStore = workforceDashboardStore;
    this.workforceDashboardService = workforceDashboardService;
    this.dispatcher = dispatcher;
    this.userSession = userSession;
    this.chartAPI = googleChartAPI;
  }

  activate(params) {

    this.workforceDashboardService.retrieveOrganisationServices();
    this.expandedChartUtils.setDatesForecast();
  }

  selectService(service) {
    this.workforceChart.innerHTML = '';
    this.workforceDashboardStore.selectedService = service;
    var date = this.workforceDashboardStore.selectedDate.dateQuery;
    
    this.workforceDashboardService.retrieveDashboardData(date, service.serviceId);
  }

  selectDate(date) {

    this.workforceChart.innerHTML = '';
    let serviceId = this.workforceDashboardStore.selectedService.serviceId;
    this.workforceDashboardStore.selectedDate = date;
    this.workforceDashboardService.retrieveDashboardData(date.dateQuery, serviceId);
  }

  selectTask(task) {
    this.workforceDashboardService.selectTask(task);
  }

  get taskNoDataClass() {
    
    if (this.workforceDashboardStore.workforceViewTasks === null || this.workforceDashboardStore.workforceViewTasks.length === 0) {
      return 'o-dropdown__button--no-data';
    }
    
    return '';
  }

  @handle(WORKFORCE_DASHBOARD_ACTIONS.WORKFORCE_DATA_RETRIEVED);
  @waitFor(WorkforceDashboardStore);
  handleWorkforceDashboardDataRetrieved() {

    if(this.workforceDashboardStore.workforceViewTasks.length > 0){
      
      let firstTask = this.workforceDashboardStore.workforceViewTasks[0];
      this.selectTask(firstTask);
    }
    
    
  }

  @handle(WORKFORCE_DASHBOARD_ACTIONS.SELECT_TASK);
  @waitFor(WorkforceDashboardStore);
  handleSelectTask() {

    let taskData = this.workforceDashboardStore.selectedTask.taskData;
    this.chartAPI.initChart(()=> this.chartAPI.setChartData(taskData));
  }

  @handle(WORKFORCE_DASHBOARD_ACTIONS.ORGANISATION_SERVICES_RETRIEVED);
  @waitFor(WorkforceDashboardStore);
  handleServicesRetrieved() {

    let serviceId = this.workforceDashboardStore.services[0].serviceId;
    var date = this.workforceDashboardStore.selectedDate.dateQuery;
    this.workforceDashboardService.retrieveDashboardData(date, serviceId);
  }

}
