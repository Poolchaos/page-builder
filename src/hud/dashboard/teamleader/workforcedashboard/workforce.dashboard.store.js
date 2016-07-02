import {inject, LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
/*
*/
import {WORKFORCE_DASHBOARD_ACTIONS} from './workforce.dashboard.actions';
/*
*/
const logger = LogManager.getLogger('WorkforceDashboardStore');
/*
*/
let STATE = {
  
  sla: null,
  services: null,
  noData: null,
  selectedTask: null,
  selectedService: null,
  selectedDate: null,
  maxGraphVal: 10,
  workforceViewTasks: null,
  daysOfWeek: [],
  dates: []
  
};

export class WorkforceDashboardStore{

  /*
  */
  get daysOfWeek(){
    
    return STATE.daysOfWeek;
  }   
  
  set daysOfWeek(val){
    
    STATE.daysOfWeek = val;
  }    
  
  get dates(){
    
    return STATE.dates;
  }   
  
  set dates(val){
    
    STATE.dates = val;
  }  
  
  get sla(){
    
    return STATE.sla;
  }    

  get services(){
    
    return STATE.services ? STATE.services : [];
  }  
  
  get selectedTask(){
    
    return STATE.selectedTask;
  }   
  
  get noData(){
    
    return STATE.noData;
  }  
  
  get selectedService(){
    
    return STATE.selectedService;
  }   
  
  set selectedService(val){
    
    STATE.selectedService = val;
  }  
  
  get maxGraphVal(){
    
    return STATE.maxGraphVal;
  }  
  
  get workforceViewTasks(){
    
    return STATE.workforceViewTasks;
  }  
  
  get selectedDate(){
    
    return STATE.selectedDate;
  }  
  
  set selectedDate(val){
    
    STATE.selectedDate = val;
  }
  /*
  */  
  set sla(val){
    
    STATE.sla = val;
  }   
  
  set maxGraphVal(val){
    
    STATE.maxGraphVal = val;
  } 
  /*
  */
  
  
  @handle(WORKFORCE_DASHBOARD_ACTIONS.ORGANISATION_SERVICES_RETRIEVED)
  handleOrganisationServicesRetrieved(message, services) {

    STATE.services = services;
    STATE.selectedService = services[0];
  }

  @handle(WORKFORCE_DASHBOARD_ACTIONS.SERVICE_SELECTED)
  handleServiceSelected(message, service) {

    STATE.selectedService = service;
  }

  @handle(WORKFORCE_DASHBOARD_ACTIONS.WORKFORCE_DATA_RETRIEVED)
  handleWorkForeDataRetrieved(message, tasks) {

    STATE.noData = false;
    STATE.workforceViewTasks = tasks;
  }    

  @handle(WORKFORCE_DASHBOARD_ACTIONS.WORKFORCE_DATA_FAILED)
  handleWorkForeDataFailed(message, tasks) {
    
    STATE.noData = true;
    STATE.workforceViewTasks = [];
    STATE.selectedTask = null;
  }  

  @handle(WORKFORCE_DASHBOARD_ACTIONS.SELECT_TASK)
  handleSelectTask(message, task) {

    STATE.selectedTask = task;
  }

}
