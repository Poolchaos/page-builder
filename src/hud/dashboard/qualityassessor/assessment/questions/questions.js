/*
 */
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {handle, waitFor} from 'aurelia-flux';
/*
 */
import {AssessmentStore} from '../assessment.store';
import {AssessmentService} from '../assessment.service';
import {ASSESSMENT_ACTIONS} from '../assessment.actions';

const logger = LogManager.getLogger('Questions');

import uuid from 'node-uuid';
/*
 */
@inject(Router, AssessmentService, AssessmentStore)
export class Questions {

  interactionId;
  formId;
  
  constructor(router, assessmentService, assessmentStore){

    this.router = router;
    this.assessmentService = assessmentService;
    this.assessmentStore = assessmentStore;
  }

  activate(params){
    this.interactionId = params.interactionId;
    this.formId = params.formId;
    this.firstName = params.firstName;
    this.surname = params.surname;
    this.memberId = params.memberId;
    this.channel = params.channel;
    
    this.assessmentService.retrieveQuestions(this.formId);
  }
	
  deactivate(){
    
    this.assessmentService.clearStore();
  }
  
	toggleExpandSection(section, index){

		let sectionEl = `#section_${index}`;
		if(!section.expanded){
			
			toggleAccordion(sectionEl, true);
		} else{
			
			toggleAccordion(sectionEl, false);
		}
		
		section.expanded = !section.expanded;
		
	}
  
  setAnswer(question, weight, polarAnswer){

    if(polarAnswer === 'no'){
      question.noWeight = weight;
      question.yesWeight = null;
    }
    else{
      question.yesWeight = weight;
      question.noWeight = null;
    }

    question.value = weight;

    return true;
  }

  back(){
    
    this.assessmentService.clearStore();
    this.router.navigateBack();
  }

  cancel(){

    this.router.parent.parent.parent.navigate('interactionlog');
  }

  get activateSubmit(){
    
    let canAtivate = true;
    
    if(!this.assessmentStore.formQuestions || !this.assessmentStore.formQuestions.sections){
      
      return false;
    }

    for(let section of this.assessmentStore.formQuestions.sections){

      for(let question of section.questions){

        if(question.value === undefined){
          canAtivate = false;
        }
        
      }
      
    }
    
    return canAtivate;
  }
  
  submit(){
    let sections = [];
    
    for(let section of this.assessmentStore.formQuestions.sections){
      let sec = { name: section.name, questions: [] };
      
      for(let question of section.questions){

        if(question.value === undefined){
          return;
        }
        
        sec.questions.push({
          id: question.id,
          type: question.type,
          value: question.value,
          yesWeight: question.yesWeight ? question.yesWeight : null,
          noWeight: question.noWeight ? question.noWeight : null

        });
      }

      sections.push(sec); 
    }

    let assessment = {
      interactionId: this.interactionId,
      formId: this.formId,
      memberId: this.memberId,
      channel: this.channel,
      sections: sections
    };

    this.assessmentService.submitAssessment(assessment);
  }

  @handle(ASSESSMENT_ACTIONS.SHOW_SUCCESS)
  @waitFor(AssessmentStore)
  handleShowSuccessMessage(){
    
    this.router.parent.navigate(`forms/view/${this.memberId}`);
  }

}
/*
*/
function setFocus(elementId) {

  let element = document.getElementById(elementId);
  if (element === null) {
    setTimeout(() => {
      setFocus(elementId);
    }, 100);
  } else {
    element.focus();
  }
}
/*
*/
function toggleAccordion(elementId, expand){

	let childHeight = $(elementId).find("ul:first").height(); 
	
	if(expand){
		$(elementId).height(childHeight);
		
		setTimeout(()=>{
			$(elementId).height('auto');
		}, 200);
		
		return;
	}
	
	$(elementId).height(childHeight);
	$(elementId).height(0);

}