/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
/*
*/
import {UserSession, ApplicationService} from 'zailab.common';
/*
*/
import {VIEW_ACTIONS} from './view.actions.js';
/*
*/
const logger = LogManager.getLogger('ViewService');
/*
*/
@inject(Dispatcher, UserSession, ApplicationService)
export class ViewService {
  
  constructor(dispatcher, userSession, applicationService){
    
    this.dispatcher = dispatcher;
    this.userSession = userSession;
    this.applicationService = applicationService;
  }
  
  retrieveForms(memberId){
    
    let organisationId = this.userSession.organisationId;

    this.applicationService.agentAssessedFormsViewSearch(organisationId, memberId).then(
        response => {
          if(response.agentAssessedFormsView){
            this.dispatcher.dispatch(VIEW_ACTIONS.RETRIEVE_FORMS, response.agentAssessedFormsView);
          } else{
            this.dispatcher.dispatch(VIEW_ACTIONS.RETRIEVE_FORMS, []);
          }
        },
        error => this.dispatcher.dispatch(VIEW_ACTIONS.RETRIEVE_FORMS, []));
  }

  searchPerformedAssessments(fromDate, toDate, organisationId, formName, performedBy){

  }

}