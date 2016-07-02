/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
/*
*/
import {ApplicationService} from 'zailab.common';
/*
*/
import {PERFORMED_ASSESSMENT_ACTIONS} from './performedassessment.actions';
/*
*/
const logger = LogManager.getLogger('PerformedAssessmentService');
/*
*/
@inject(ApplicationService, Dispatcher)
export class PerformedAssessmentService {

  constructor(applicationService, dispatcher){

    this.applicationService = applicationService;
    this.dispatcher = dispatcher;
  }
   
  retrieveAssessment(assessmentId){

    this.applicationService.agentAssessedFormViewSearch(assessmentId).then(
      response=>{
        
        if(response.agentAssessedFormView && response.agentAssessedFormView[0]){

          this.dispatcher.dispatch(PERFORMED_ASSESSMENT_ACTIONS.RETRIEVE_ASSESSMENT, response.agentAssessedFormView[0]);
        }else{
          
          this.dispatcher.dispatch(PERFORMED_ASSESSMENT_ACTIONS.RETRIEVE_ASSESSMENT, {});
        }      }, 
      error=>{
        
        this.dispatcher.dispatch(PERFORMED_ASSESSMENT_ACTIONS.RETRIEVE_ASSESSMENT, {});
      })
  }
  
}
