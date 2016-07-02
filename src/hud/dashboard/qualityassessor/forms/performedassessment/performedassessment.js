/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
/*
*/
import {PerformedAssessmentService} from './performedassessment.service';
import {PerformedAssessmentStore} from './performedassessment.store';
/*
*/
const logger = LogManager.getLogger('PerformedAssessment');
/*
*/
@inject(Router, PerformedAssessmentService, PerformedAssessmentStore)
export class PerformedAssessment {

  constructor(router, performedAssessmentService, performedAssessmentStore){
    
    this.router = router;
    this.performedAssessmentService = performedAssessmentService;
    this.performedAssessmentStore = performedAssessmentStore;
  }
   
  activate(params){
    this.performedAssessmentService.retrieveAssessment(params.assessmentId);
  }
  
  back(){
    
    this.router.navigateBack();
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
