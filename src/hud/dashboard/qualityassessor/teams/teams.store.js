/*
*/
import {TEAMS_ACTIONS} from './teams.actions';
/*
*/
import {LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
/*
*/
const logger = LogManager.getLogger('TeamsStore');
/*
*/
let STATE = {
  services: [],
  isServicesVisible: false,
  isChangeService: false,
  members: [],
  selectedService: {}
};
/*
*/
export class TeamsStore {

  get isChangeService() {
    return STATE.isChangeService;
  }

  get isServicesVisible() {
    return STATE.isServicesVisible;
  }

  get services() {
    return STATE.services;
  }

  get members(){
    return STATE.members;
  }

  get selectedService(){
    return STATE.selectedService;
  }

  @handle(TEAMS_ACTIONS.RETRIEVE_SERVICES)
  handleRetrieveServices(action, services) {

    let selectedServices = [];
    
    for(let service of services){
      
      if(service.selected){
        selectedServices.push(service);
      }
    }
    
    services = selectedServices;
    services[0].isSelected = true;
    STATE.selectedService = services[0];
    STATE.services = services;
  }

  @handle(TEAMS_ACTIONS.TOGGLE_SERVICES)
  handleToggleServices() {
    
    STATE.isServicesVisible = !STATE.isServicesVisible;
  }

  @handle(TEAMS_ACTIONS.CHANGE_SERVICE)
  handleChangeService() {
    
    return STATE.isChangeService = true;
  }


  @handle(TEAMS_ACTIONS.RETRIEVE_MEMBERS)
  handleRetrieveMembers(action, members) {

    for(let member of members){
      member.fullName = member.firstName + ' ' + member.surname;
      if(member.roleName === 'QA'){
        member.roleName = 'Quality Assessor';
      }
    }
    
    STATE.members = members;
  }

  @handle(TEAMS_ACTIONS.SELECT_SERVICE)
  handleSelectService(action, service) {
    
    STATE.selectedService = service;
  }

}

