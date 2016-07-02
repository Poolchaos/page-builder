/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {handle, waitFor} from 'aurelia-flux';
/*
*/
import {AssessmentService} from './assessment.service';
import {AssessmentStore} from './assessment.store';
import {ASSESSMENT_ACTIONS} from './assessment.actions';
/*
*/
const logger = LogManager.getLogger('Assessment');
/*
*/
@inject(Router, AssessmentService, AssessmentStore)
export class Assessment {

  constructor(router, assessmentService, assessmentStore) {

    this.router = router;
    this.assessmentService = assessmentService;
    this.assessmentStore = assessmentStore;
  }
  
  configureRouter(config, router) {
    
    config.map([

      {route: '',                   redirect: 'selectform'},
      {route: 'selectform',         name: 'selectform', moduleId: 'hud/dashboard/qualityassessor/assessment/selectform/selectform',  nav: false, title: 'Select Form'},
      {route: 'questions/:formId',  name: 'questions',  moduleId: 'hud/dashboard/qualityassessor/assessment/questions/questions',    nav: false, title: 'Questions'}
      
    ]);
    
    this.router = router;
  }
  
  activate(params){
    let interactionId = params.interactionId;
    let callType = params.callType;

    this.assessmentService.retrieveRecording(interactionId, callType)
    
  }
  
  
  @handle(ASSESSMENT_ACTIONS.RETRIEVE_QUESTIONS)
  @waitFor(AssessmentStore)
  handleRetrieveQuestions(action, questions){
    
    logger.debug('handleRetrieveQuestions >> questions > ', questions);
  }
  
}
