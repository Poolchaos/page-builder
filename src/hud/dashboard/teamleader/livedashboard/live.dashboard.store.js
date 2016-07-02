import {inject} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
import {LIVE_DASHBOARD_ACTIONS} from './live.dashboard.actions';
import {LiveDashboardUtils} from './live.dashboard.utils';
import {EventAggregator} from 'aurelia-event-aggregator';

@inject(LiveDashboardUtils, EventAggregator)
export class LiveDashboardStore{

  constructor(liveDashboardUtils, eventAggregator){
    this.utils = liveDashboardUtils;
    this.currentDateTime = this.utils.getCurrentDateTime();
    this.eventAggregator = eventAggregator;
    this.eventAggregator.subscribe(LIVE_DASHBOARD_ACTIONS.DASHBOARD_UPDATED, data => {this.handleLiveDashbardUpdated(null, data)});
  }
  
  selectedService;
  organisationId;
  dashboardData;
  dateTimer;
  services;
  error;
  
  
  @handle(LIVE_DASHBOARD_ACTIONS.VIEW_ACTIVATED)
  handleViewActivated(message) {
    this.dateTimer = setInterval(()=>{this.currentDateTime = this.utils.getCurrentDateTime()}, 1000);
  }
 
  @handle(LIVE_DASHBOARD_ACTIONS.ORGANISATION_ID_RETIEVED)
  handleOrganisationIdRetrieved(message, organisationId) {
    this.organisationId = organisationId;
  }  

  @handle(LIVE_DASHBOARD_ACTIONS.LIVE_DASHBOARD_RETRIEVED)
  handleLiveDashbardRetrieved(message, dashboardData) {
    
    this.dashboardData = null;
    
    if(!dashboardData){
      return;
    }
    
    this.formatDashboardData(dashboardData).then(result => {

      result.totalCalls = result.abandonedCalls + result.numberOfCallsHandled;
      result.percentageAnswered = Math.ceil((result.numberOfCallsHandled / result.totalCalls) * 100);
      result.percentageAnswered = !isNaN(result.percentageAnswered) ? result.percentageAnswered : 0;

      this.dashboardData = result;
    });
  }

  @handle(LIVE_DASHBOARD_ACTIONS.DASHBOARD_UPDATED)
  handleLiveDashbardUpdated(message, updatedProps) {

    if(!this.dashboardData){
      return;
    }
    
    var unformattedData = JSON.parse(JSON.stringify(this.dashboardData)); // 'Deep copy' to prevent binding.
    for(var property in updatedProps){
      unformattedData[property] = updatedProps[property];
    }
    
    this.formatDashboardData(unformattedData).then(result=>{
      
      result.totalCalls = result.abandonedCalls + result.numberOfCallsHandled;
      result.percentageAnswered = Math.ceil((result.numberOfCallsHandled / result.totalCalls) * 100);
      result.percentageAnswered = !isNaN(result.percentageAnswered) ? result.percentageAnswered : 0;
      
      this.dashboardData = result;
    });
  }

  @handle(LIVE_DASHBOARD_ACTIONS.LIVE_DASHBOARD_FAILED)
  handleLiveDashboardFailed(message, errorMessage) {
    this.error = errorMessage;
  }

  @handle(LIVE_DASHBOARD_ACTIONS.ORGANISATION_SERVICES_RETRIEVED)
  handleOrganisationServicesRetrieved(message, services) {
    this.services = services;
    this.selectedService = services[0];
  }  
   
  @handle(LIVE_DASHBOARD_ACTIONS.ORGANISATION_SERVICES_FAILED)
  handleOrganisationServicesFailed(message, error) {
    this.error = error;
  }  

  @handle(LIVE_DASHBOARD_ACTIONS.SERVICE_SELECTED)
  handleServiceSelected(message, service) {
    this.selectedService = service;
  }

  formatDashboardData(dashboardData){
    return new Promise((resolve, reject)=>{
      var formattedData = dashboardData;
      formattedData.waitTimeBreakdown = this.utils.calculateBarChartBarHeights(formattedData.waitTimeBreakdown);
      formattedData.averageWaitTime = this.utils.convertMillisecondsToTime(formattedData.averageWaitTime);
      formattedData.longestWaitTime = this.utils.convertMillisecondsToTime(formattedData.longestWaitTime);
      formattedData.averageHandleTime = this.utils.convertMillisecondsToTime(formattedData.averageHandleTime);
      resolve(formattedData);
    });
  }

}