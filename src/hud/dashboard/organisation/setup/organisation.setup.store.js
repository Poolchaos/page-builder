/*
zailab
*/
import {ORGANISATION_SETUP_ACTIONS} from './organisation.setup.actions';
/*
aurelia
*/
import {LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';

const logger = LogManager.getLogger('OrganisationSetupStore');

let STATE = {
  
  name: null,
  services: null,
  sites: null
};

export class OrganisationSetupStore {
  
  get name() {
    
    return STATE.name;
  }
  
  get services() {
    
    return STATE.services;
  }
  
  get sites() {
    
    return STATE.sites;
  }
  
  @handle(ORGANISATION_SETUP_ACTIONS.RETRIEVE_ORGANISATION_NAME)
  handleRetrieveOrganisationName(action, name) {
    
    logger.debug('handleRetrieveOrganisationName > name > ', name)
    STATE.name = name;
  }
  
  @handle(ORGANISATION_SETUP_ACTIONS.RETRIEVE_ORGANISATION_SERVICES)
  handleRetrieveOrganisationServices(action, services) {
    
    STATE.services = services;
  }

  @handle(ORGANISATION_SETUP_ACTIONS.RETRIEVE_ORGANISATION_SITES)
  handleRetrieveOrganisationSites(action, sites) {
    
    STATE.sites = sites;
  }
  
  @handle(ORGANISATION_SETUP_ACTIONS.CHANGE_ORGANISATION_NAME)
  handleChangeOrganisationName(action, model) {
    
    STATE.name = model.item.name;
  }
  
  @handle(ORGANISATION_SETUP_ACTIONS.CHANGE_ORGANISATION_SERVICES)
  handleChangeOrganisationServices(action, model) {
    
    STATE.services = model.items;
  }
  
  @handle(ORGANISATION_SETUP_ACTIONS.CHANGE_ORGANISATION_SITES)
  handleChangeOrganisationSites(action, model) {
    
    STATE.sites = model.items;
  }

  @handle(ORGANISATION_SETUP_ACTIONS.ACCEPT_CHANGE_ORGANISATION_SITE_NAME)
  handleAcceptChangeOrganisationSiteName(action, model) {
    
  }

  @handle(ORGANISATION_SETUP_ACTIONS.CANCEL_CHANGE_ORGANISATION_SITE_NAME)
  handleCancelChangeOrganisationSiteName(action, model) {
    
    for (let item of STATE.sites) {
      
      if (item.id === model.item.id) {
        
        item.name = model.item.name;
        break;
      }
    }
  }

  @handle(ORGANISATION_SETUP_ACTIONS.ACCEPT_CHANGE_ORGANISATION_SERVICE_NAME)
  handleAcceptChangeOrganisationServiceName(action, model) {
    
  }

  @handle(ORGANISATION_SETUP_ACTIONS.CANCEL_CHANGE_ORGANISATION_SERVICE_NAME)
  handleCancelChangeOrganisationServiceName(action, model) {
    
    for (let item of STATE.services) {
      
      if (item.id === model.item.id) {
        
        item.name = model.item.name;
        break;
      }
    }
  }
}