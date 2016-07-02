/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
/*
*/
import {UserSession, ApplicationService} from 'zailab.common';
/*
*/
import {SELECT_FORM_ACTIONS} from './selectform.actions';
/*
*/
const logger = LogManager.getLogger('SelectFormService');
/*
*/
@inject(Dispatcher, UserSession, ApplicationService)
export class SelectFormService {
  
  constructor(dispatcher, userSession, applicationService){
    
    this.dispatcher = dispatcher;
    this.userSession = userSession;
    this.applicationService = applicationService;
  }
  
  retrieveForms(){
    
    let organisationId = this.userSession.organisationId;
    
    this.applicationService.qaListViewSearch(organisationId).then(
      response => {

        if(response && response.QAListView){
          this.dispatcher.dispatch(SELECT_FORM_ACTIONS.RETRIEVE_FORMS, response.QAListView);
        } else{
          this.dispatcher.dispatch(SELECT_FORM_ACTIONS.RETRIEVE_FORMS, []);
        }
      },
      error => this.dispatcher.dispatch(SELECT_FORM_ACTIONS.RETRIEVE_FORMS, []));

  }
  
}