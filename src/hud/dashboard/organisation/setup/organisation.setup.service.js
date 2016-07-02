/*
*/
import {UserSession, ApplicationService} from 'zailab.common';
import {ORGANISATION_SETUP_ACTIONS} from './organisation.setup.actions';
import {ORGANISATION_ACTIONS} from '../organisation.actions';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
import {EventAggregator} from 'aurelia-event-aggregator';
/*
*/
const logger = LogManager.getLogger('OrganisationSetupService');
/*
*/
@inject(UserSession, ApplicationService, Dispatcher, EventAggregator)
export class OrganisationSetupService {
  
  constructor(userSession, applicationService, dispatcher, eventAggregator) {
    
    this.userSession = userSession;
    this.applicationService = applicationService;
    this.dispatcher = dispatcher;
    this.eventAggregator = eventAggregator;
  }
  
  retrieveName() {
    
    let organisationId = this.userSession.organisationId;
    
    this.applicationService.changeOrganisationSearch(organisationId).then( response => {
      
      if(response.changeOrganisationView && response.changeOrganisationView[0]) {
        
        let name = response.changeOrganisationView[0].organisationName;
        
        this.dispatcher.dispatch(ORGANISATION_SETUP_ACTIONS.RETRIEVE_ORGANISATION_NAME, name);
      }
      
    });
    
  }
  
  changeOrganisationName(organisationName) {
    
    let organisationId = this.userSession.organisationId;

    this.applicationService.changeOrganisationInformation(organisationId, organisationName);
    
    this.eventAggregator.publish(ORGANISATION_ACTIONS.UPDATE_ORGANISATION_WIDGET, organisationName);
  }
}