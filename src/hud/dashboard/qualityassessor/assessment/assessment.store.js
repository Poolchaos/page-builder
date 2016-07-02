/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
/*
*/
import {ASSESSMENT_ACTIONS} from './assessment.actions';
/*
*/
import uuid from 'node-uuid';
/*
*/
const logger = LogManager.getLogger('AssessmentStore');
/*
*/
let STATE = {
  hideButton: false,
  formQuestions: {},
  formattedSections:[],
  recordingElement: null,
  sectionItems : ['Greeting', 'Account Verification', 'Contact Information Confirmation', 'Problem Solving Abilities', 'Followed Protocol', 'Etiquette', 'Soft Skills', 'Interaction Handling', 'Customer Service Quality', 'Script Compliance', 'Closure', 'Follow Up']
};
/*
*/
@inject()
export class AssessmentStore {
  
  constructor(){
  }

  get formQuestions(){
    
    return STATE.formQuestions;
  }

  get hideButton(){

    return STATE.hideButton;
  }
  
  get recordingElement(){
    
    return STATE.recordingElement;
  }

  get sectionItems(){
    return STATE.sectionItems;
  }

  get formattedSections(){
    return STATE.formattedSections;
  }
  
  @handle(ASSESSMENT_ACTIONS.RETRIEVE_RECORDING)
  handleRetrieveRecording(action, call) {


    let uri = call.recordingURL;

    if (call.type === 'Kiosk Call' && uri) {
      STATE.recordingElement = '<video class=\'video_recording\' media-player=\'audio1\' data-playlist=\'playlist1\' controls=\'controls\' ><source src=' + uri + ' type=\'video/webm\'></video>';
    } else {
      STATE.recordingElement = '<audio class=\'recording\' media-player=\'audio1\' data-playlist=\'playlist1\' controls=\'controls\' ><source src=' + uri + ' type=\'audio/wav\'></audio>';
    }
    
  }


  //reconfigure to match template functionality
  @handle(ASSESSMENT_ACTIONS.FETCH_FORMATTED_SECTIONS)
  handleFetchFormattedData(event, data) {
    for(let section of STATE.sectionItems) {
      let formattedSection = {
        name: section,
        questions: [{
          id: uuid.v4(),
          type: null,
          description: null,
          yesWeight: null,
          noWeight: null
        }]
      }

      STATE.formattedSections.push(formattedSection);
    }
  }

  @handle(ASSESSMENT_ACTIONS.SHOW_SUCCESS)
  handleShowSuccessMessage(actions, score){
  }

  @handle(ASSESSMENT_ACTIONS.RETRIEVE_QUESTIONS)
  handleRetrieveQuestions(action, assessment){
    
		for(let section of assessment.sections) {
			section.expanded = true;
		}

    STATE.formQuestions = assessment;
  }

  @handle(ASSESSMENT_ACTIONS.CLEAR_STORE)
  handleClearStore(action, questions) {

    STATE.formQuestions = {};
  }

  @handle(ASSESSMENT_ACTIONS.HIDE_BUTTON)
  handleHideButton(action, value) {

    STATE.hideButton = value;
  }





}