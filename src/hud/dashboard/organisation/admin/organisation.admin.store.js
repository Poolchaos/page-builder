/*
zailab
*/
import {ORGANISATION_ADMIN_ACTIONS} from './organisation.admin.actions';
/*
aurelia
*/
import {LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';

const logger = LogManager.getLogger('OrganisationAdminStore');

let STATE = {
  
  cos: null,
  services: null,
  sites: null
};

export class OrganisationAdminStore {
  
  get cos() {
    
    return STATE.cos;
  }
  
  get services() {
    
    return STATE.services;
  }
  
  get sites() {
    
    return STATE.sites;
  }
  
  @handle(ORGANISATION_ADMIN_ACTIONS.RETRIEVE_ADMIN_COS)
  handleRetrieveAdminCos(action, cos) {
    
    STATE.cos = cos;
  }
  
  @handle(ORGANISATION_ADMIN_ACTIONS.RETRIEVE_ADMIN_SERVICES)
  handleRetrieveAdminServices(action, services) {
    
    STATE.services = services;
  }

  @handle(ORGANISATION_ADMIN_ACTIONS.RETRIEVE_ADMIN_SITES)
  handleRetrieveAdminSites(action, sites) {
    
    STATE.sites = sites;
  }
  
  @handle(ORGANISATION_ADMIN_ACTIONS.CHANGE_ADMIN_COS)
  handleChangeAdminCos(action, model) {
    
    STATE.cos = model.items;
  }
  
  @handle(ORGANISATION_ADMIN_ACTIONS.CHANGE_ADMIN_SERVICES)
  handleChangeAdminServices(action, model) {
    
    STATE.services = model.items;
  }
  
  @handle(ORGANISATION_ADMIN_ACTIONS.CHANGE_ADMIN_SITES)
  handleChangeAdminSites(action, model) {
    
    STATE.sites = model.items;
  }
}