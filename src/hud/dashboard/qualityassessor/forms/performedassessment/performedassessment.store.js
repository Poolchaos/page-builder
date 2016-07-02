/*
 */
import {inject, LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
/*
 */
import {PERFORMED_ASSESSMENT_ACTIONS} from './performedassessment.actions';
/*
 */
const logger = LogManager.getLogger('PerformedAssessmentService');
/*
 */
let STATE = {
  assessment: {
    sections: []
  }
};
/*
 */
export class PerformedAssessmentStore {

  get assessment(){

    return STATE.assessment;
  }

  get recordingElement(){

    return STATE.recordingElement;
  }

  @handle(PERFORMED_ASSESSMENT_ACTIONS.RETRIEVE_ASSESSMENT)
  handleRetrieveAssessment(action, assessment){
		
		for(let section of assessment.sections) {
			section.expanded = true;
		}
    if(assessment.score.percentageAchieved < assessment.passRequirement){
      assessment.outcome = 'Fail';
    }
    else{
      assessment.outcome = 'Pass';
    }

    STATE.assessment = assessment;
  }

  @handle(PERFORMED_ASSESSMENT_ACTIONS.RETRIEVE_RECORDING)
  handleRetrieveRecording(action, recordingURL) {
    
    if(!recordingURL) {
      return;
    }
    
    STATE.recordingElement = '<audio class=\'recording\' media-player=\'audio1\' data-playlist=\'playlist1\' controls=\'controls\' ><source src=' + recordingURL + ' type=\'audio/wav\'></audio>';
  }
}
