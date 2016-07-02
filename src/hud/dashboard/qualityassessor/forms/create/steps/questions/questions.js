/*
 */
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {handle, waitFor} from 'aurelia-flux';
/*
 */
import {CreateStore} from '../../create.store';
import {CreateService} from '../../create.service';
import {CREATE_ACTIONS} from '../../create.actions';

const logger = LogManager.getLogger('FormQuestions');

import uuid from 'node-uuid';
/*
 */

@inject(Router, CreateService, CreateStore)
export class Questions {

  constructor(router, createService, createStore){

    this.router = router;
    this.createService = createService;
    this.createStore = createStore;

  }

  activate(){
    this.createService.getSectionData();
  }

  get disablePublish(){
    
    let noQuestions = true;
    
    for(let section of this.createStore.formattedSections){
      
      if(section.questions && section.questions.length > 0){
        noQuestions = false;
      }
    }

    return noQuestions;
  }
  
  get totalScore(){

    let score = 0;
    let noWeight = 0;
    let yesWeight = 0;

    for(let section of this.createStore.formattedSections){

      if((section.yesWeight && section.yesWeight > 0) || (section.noWeight && section.noWeight > 0)){

        noWeight = parseInt(!section.noWeight ? 0 : section.noWeight);
        yesWeight = parseInt(!section.yesWeight ? 0 : section.yesWeight);

        score += yesWeight > noWeight ? yesWeight : noWeight;
      }

      for (let question of section.questions){

        noWeight = parseInt(!question.noWeight ? 0 : question.noWeight);
        yesWeight = parseInt(!question.yesWeight ? 0 : question.yesWeight);
        score += yesWeight > noWeight ? yesWeight : noWeight;
      }

    }

    if(!isNaN(score)){
      return score;
    }

  }

  back(){
    this.router.navigateBack();
  }

  cancel(){
    this.router.parent.parent.navigate('forms');
    this.createService.clearState();
  }

  isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }



  keyPressed(event, section){

    if(section === undefined){
      return;
    }

    let question = {
      yesWeight: section.yesWeight === undefined ? 0 : section.yesWeight,
      noWeight: section.noWeight === undefined ? 0 : section.noWeight
    };

    this.createService.calculateScore(question);
    this.createService.clearValidation('cancel');
  }



  addQuestion(section, sectionIndex){

    this.createService.toggleEditQuestion(true);

    let question = {
      description: section.description,
      yesWeight: section.yesWeight,
      noWeight: section.noWeight,
      sectionIndex: sectionIndex
    };

    this.createService.addQuestion(question);


    section.description = '';
    section.yesWeight = '';
    section.noWeight = '';
  }

  removeQuestion(sectionName, index){
    let question = {
      sectionName: sectionName,
      index: index
    };

    this.createService.removeQuestion(question);
    this.createService.toggleEditQuestion(false);
    this.createService.clearValidation('cancel');
  }


  publish(){

    let formId = this.createStore.formId;
    let name = this.createStore.formName;
    let passRequirement = this.createStore.passRequirement;
    let channels = this.createStore.channelItems;
    let sections = this.createStore.formattedSections;
    let member  = this.createStore.member;


    let oneSectionQuestion = false;
    for(let section of this.createStore.formattedSections){
      if((!section.questions || section.questions.length ===0) && !oneSectionQuestion) {
        this.createService.sectionValidation('oneQuestionPerSection');
        return;
      }
      oneSectionQuestion = true;
    }



    this.createService.publishForm(formId, name, passRequirement, channels, sections, member);
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

  toggleEditQuestion(question, elementId) {
    let inEditState = !this.createStore.isInEditState;

    if(!question.description){
      this.createService.blankQuestionValidation('questionDescriptionBlank');
    }else if(!question.yesWeight){
      this.createService.blankYesWeightValidation('noYesWeightEntered');
    }
    else if(!question.noWeight){
      this.createService.blankNoWeightValidation('noNoWeightEntered');
    }
    else if(!isNumeric(question.yesWeight)){
      this.createService.yesWeightNotNumeric('yesWeightNotNumeric');
    }
    else if(!isNumeric(question.noWeight)){
      this.createService.noWeightNotNumeric('noWeightNotNumeric');
    }
    else if(parseInt(question.noWeight) === parseInt(question.yesWeight)){
      this.createService.equalWeight('equalWeight');
    }

    else if((question.yesWeight%1 != 0) || question.yesWeight.substr(0,1) === '.'){
      this.createService.yesWeightNotWholeNumber('yesWeightNotWholeNumber');
    } else if((question.noWeight%1 != 0 || question.noWeight.substr(0,1) === '.')){
      this.createService.noWeightNotWholeNumber('noWeightNotWholeNumber');
    }
    else if(question.noWeight < 0){
      this.createService.negativeNoWeight('negativeNoWeight');
    }
    else if(question.yesWeight < 0){
      this.createService.negativeYesWeight('negativeYesWeight');
    }
    else{
      this.createService.toggleEditQuestion(inEditState);
      question.isInEditState = !question.isInEditState;
    }

    setTimeout(() => {
      setFocus(elementId);
    }, 200);
  }

  @handle(CREATE_ACTIONS.SHOW_SUCCESS)
  @waitFor(CreateStore)
  handleShowSuccessMessage(){

    this.router.parent.parent.navigate('forms');
  }


  @handle(CREATE_ACTIONS.ADD_QUESTION)
  handleAddQuestion(action, question){
    logger.debug('handleAddQuestion >', this.createStore.formattedSections);
    let sectionIndex = question.sectionIndex;
    let section = this.createStore.formattedSections[sectionIndex];
    let lastQuestionIndex = section.questions.length -1;

    let inputId = 'txtQuestion_' + section.name + '_' + lastQuestionIndex;

    setTimeout(() => {
      setFocus(inputId);
    }, 200);

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

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
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