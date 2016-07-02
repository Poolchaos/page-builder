/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
/*
*/
import {UserSession, ApplicationService} from 'zailab.common';
/*
*/
import {LIST_ACTIONS} from './list.actions';
import {CREATE_ACTIONS} from '../create/create.actions';
/*
*/
const logger = LogManager.getLogger('ListService');
/*
*/
@inject(Dispatcher, UserSession, ApplicationService)
export class ListService {
  
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
          this.dispatcher.dispatch(LIST_ACTIONS.RETRIEVE_FORMS, response.QAListView);
        } else{
          this.dispatcher.dispatch(LIST_ACTIONS.RETRIEVE_FORMS, []);
        }
      },
      error => this.dispatcher.dispatch(LIST_ACTIONS.RETRIEVE_FORMS, []));

  }

  clearState(){
    this.dispatcher.dispatch(CREATE_ACTIONS.CLEAR_STATE);
  }
  
}