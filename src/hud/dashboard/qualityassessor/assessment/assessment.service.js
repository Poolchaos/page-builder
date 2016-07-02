/*
 */
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
/*
 */
import {ApplicationService, UserSession, WebSocket} from 'zailab.common';
/*
 */
import {ASSESSMENT_ACTIONS} from './assessment.actions';
/*
 */
import toastr from 'toastr';
/*
 */
const logger = LogManager.getLogger('AssessmentService');
/*
 */
@inject(Dispatcher, ApplicationService, UserSession, WebSocket)
export class AssessmentService {

  constructor(dispatcher, applicationService, userSession, webSocket){

    this.dispatcher = dispatcher;
    this.applicationService = applicationService;
    this.userSession = userSession;
    this.webSocket = webSocket;
    this.subscribe();
  }

  //configure event
  subscribe() {

    this.webSocket.subscribe({
      name: 'com.zailab.organisation.interaction.api.events.InteractionScoredEvent',
      callback: data => {
        let score = data.state.score;

        toastr.options = {
          'positionClass': 'toast-top-center',
          'progressBar': true,
          'timeOut': "10000"
        };
        
        setTimeout(()=>{
          toastr.info('Result: ' + score.totalAchieved + '/' + score.maxmimum + ` (${score.percentageAchieved}%)`, 'QA successfully performed');
          this.dispatcher.dispatch(ASSESSMENT_ACTIONS.SHOW_SUCCESS);
        }, 500);
      }
    });
  }

  clearStore(){

    this.dispatcher.dispatch(ASSESSMENT_ACTIONS.CLEAR_STORE);
  }

  retrieveRecording(interactionId, callType){

    let call = {type:callType};
    let organisationId = this.userSession.organisationId;

    this.applicationService.playCallLogSearch(interactionId, organisationId, callType).then(
        result => {
          call.recordingURL = result.url;
          this.dispatcher.dispatch(ASSESSMENT_ACTIONS.RETRIEVE_RECORDING, call);
        },
        error => {
          this.dispatcher.dispatch(ASSESSMENT_ACTIONS.RETRIEVE_RECORDING, call);
        });

  }

  retrieveQuestions(formId){

    this.applicationService.performQaViewSearch(formId).then(
        response=>{

          if(response.performQAView && response.performQAView[0]){
            this.dispatcher.dispatch(ASSESSMENT_ACTIONS.RETRIEVE_QUESTIONS, response.performQAView[0]);
            this.dispatcher.dispatch(ASSESSMENT_ACTIONS.HIDE_BUTTON, false);
          }
        }, error=>{
          this.dispatcher.dispatch(ASSESSMENT_ACTIONS.RETRIEVE_QUESTIONS, {});
        });
  }

  submitAssessment(assessment){
    this.dispatcher.dispatch(ASSESSMENT_ACTIONS.HIDE_BUTTON, true);
    assessment.organisationId = this.userSession.organisationId;
    assessment.assessorMemberId = this.userSession.memberId;


    let message = {
      feature: 'qualityassurance',
      name: 'com.zailab.organisation.interaction.api.commands.AssessInteractionCommand',
      state: assessment
    };

    this.webSocket.publish(message);
  }

}