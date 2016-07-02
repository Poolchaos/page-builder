/*
 */
import {inject, LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
import {CREATE_ACTIONS} from './create.actions';
import {UserSession} from 'zailab.common';
/*
 */
const logger = LogManager.getLogger('CreateFormStore');

import uuid from 'node-uuid';
import toastr from 'toastr';
/*
 */

let STATE = {
  member : {
    memberId: null,
    firstName: null,
    surname: null
  },
  successMessage: null,
  formattedSections:[],
  formName: '',
  passRequirement: '',
  formId: null,
  channelItems : ['Phone Call', 'Email', 'Web Call', 'Kiosk Call'],
  sectionItems : ['Greeting', 'Account Verification', 'Contact Information Confirmation', 'Problem Solving Abilities', 'Followed Protocol', 'Etiquette', 'Soft Skills', 'Interaction Handling', 'Customer Service Quality', 'Script Compliance', 'Closure', 'Follow Up'],
  totalScore: 0,
  isInEditState: false,
  validationReason : null,
  isQuestionCorrect: false,
  isWeightsCorrect: false,
  isYesWeightCorrect: false,
  isNoWeightCorrect: false,
  sectionValidationReason : null,
  isSectionCorrect: false,
  isYesWeightNumeric: false,
  isNegativeYesWeight: false,
  isNegativeNoWeight: false,
  isNoWeightWholeNumber: false,
  isYesWeightWholeNumber: false,
  isNoWeightNumeric: false,
  isVisible: false,
  isPublishButtonVisible: false
};
@inject(UserSession)
export class CreateStore {

  constructor(userSession){
    this.userSession = userSession;
  }

  set formName(formName){
    STATE.formName = formName;
  }

  get formName(){
    return STATE.formName;
  }

  get isPublishButtonVisible(){
    return STATE.isPublishButtonVisible;
  }

  get isNoWeightWholeNumber(){
    return STATE.isNoWeightWholeNumber;
  }

  get isVisible(){
    return STATE.isVisible;
  }

  get isYesWeightWholeNumber(){
    return STATE.isYesWeightWholeNumber;
  }

  get isNoWeightNumeric(){
    return STATE.isNoWeightNumeric;
  }
  get isNegativeNoWeight(){
    return STATE.isNegativeNoWeight;
  }

  get isNegativeYesWeight(){
    return STATE.isNegativeYesWeight;
  }

  get sectionValidationReason(){
    return STATE.sectionValidationReason;
  }

  get isYesWeightNumeric(){
    return STATE.isYesWeightNumeric;
  }

  get isSectionCorrect(){
    return STATE.isSectionCorrect;
  }

  get isQuestionCorrect(){
    return STATE.isQuestionCorrect;
  }

  get isYesWeightCorrect(){
    return STATE.isYesWeightCorrect;
  }

  get isNoWeightCorrect(){
    return STATE.isNoWeightCorrect;
  }

  get isWeightsCorrect(){
    return STATE.isWeightsCorrect;
  }

  get isInEditState(){
    return STATE.isInEditState;
  }

  set passRequirement(passRequirement){
    STATE.passRequirement = passRequirement;
  }

  get passRequirement(){
    return STATE.passRequirement;
  }

  get formattedSections(){
    return STATE.formattedSections;
  }

  get channelItems(){
    return STATE.channelItems;
  }

  get sectionItems(){
    return STATE.sectionItems;
  }

  get member(){
    return STATE.member;
  }

  get successMessage(){
    return STATE.successMessage;
  }


  get totalScore(){
    return STATE.totalScore;
  }

  get validationReason(){
    return STATE.validationReason;
  }

  @handle(CREATE_ACTIONS.CLEAR_STATE)
  handleClearState(){
    STATE = {
      member : {
        memberId: null,
        firstName: null,
        surname: null
      },
      successMessage: null,
      formattedSections:[],
      formName: '',
      passRequirement: '',
      formId: null,
      channelItems : ['Phone Call', 'Email', 'Web Call', 'Kiosk Call'],
      sectionItems : ['Greeting', 'Account Verification', 'Contact Information Confirmation', 'Problem Solving Abilities', 'Followed Protocol', 'Etiquette', 'Soft Skills', 'Interaction Handling', 'Customer Service Quality', 'Script Compliance', 'Closure', 'Follow Up'],
      totalScore : 0
    };
  }


  @handle(CREATE_ACTIONS.FETCH_FORMATTED_SECTIONS)
  handleFetchFormattedData(event, data) {
    for(let section of STATE.sectionItems) {
      let formattedSection = {
        name: section,
        questions: []
      }

      STATE.formattedSections.push(formattedSection);
    }

    STATE.formattedSections[0].expanded = true;
  }

  @handle(CREATE_ACTIONS.RETRIEVE_PERSONAL_INFO)
  handleRetrievePersonalInfo(action, data){
    STATE.member.firstName = data.firstName;
    STATE.member.surname  = data.surname;

    STATE.member.memberId =  this.userSession.memberId;
  }

  @handle(CREATE_ACTIONS.SHOW_SUCCESS)
  handleShowSuccessMessage(){

    /*toastr.options = {
     'positionClass': 'toast-top-center',
     'preventDuplicates': true,
     'progressBar': true
     };
     toastr.success('Form submitted successfully');*/
  }

  @handle(CREATE_ACTIONS.ADD_QUESTION)
  handleAddQuestion(action, question){

    let sections = STATE.formattedSections;
    let sectionIndex = question.sectionIndex;

    sections[sectionIndex].questions.push({
      id: uuid.v4(),
      type: 'POLAR_QUESTION',
      description: question.description,
      yesWeight: question.yesWeight ? parseInt(question.yesWeight) : null,
      noWeight: question.noWeight ? parseInt(question.noWeight) : null,
      isInEditState: true
    });

  }

  @handle(CREATE_ACTIONS.REMOVE_QUESTION)
  handleRemoveQuestion(action, question){
    let sections = STATE.formattedSections;
    let name = question.sectionName;
    let index = question.index;

    for(let section of sections){
      if (section.name === name) {
        section.questions.splice(index, 1);
      }
    }
  }

  @handle(CREATE_ACTIONS.TOGGLE_EDIT_QUESTION)
  handleToggleEditQuestion(action, isInEditState){


    if(!STATE.isYesWeightCorrect || !STATE.isNoWeightCorrect || !STATE.isQuestionCorrect){
      STATE.isVisible =  true;
    }
    else{
      STATE.isVisible =  false;
    }

    STATE.isInEditState = isInEditState;
  }

  @handle(CREATE_ACTIONS.SECTION_VALIDATION)
  handleSectionValidationError(action, reason){

    if(reason === 'oneQuestionPerSection'){
      reason = 'Please add at least one question.';
      STATE.isSectionCorrect =  true;


    }

    STATE.sectionValidationReason = reason;
    setTimeout(() => {
      STATE.isSectionCorrect =  false;
    }, 5000);

  }

  @handle(CREATE_ACTIONS.BLANK_QUESTION_VALIDATION)
  handleBlankQuestion(action, reason){
    if(reason === 'questionDescriptionBlank'){
      reason = 'Please enter a question.';
      STATE.isQuestionCorrect = true;
    }
    STATE.validationReason = reason;
  }

  @handle(CREATE_ACTIONS.BLANK_YES_WEIGHT)
  handleBlankYesWeight(action, reason){
    logger.debug('-1-');
    if(reason === 'noYesWeightEntered'){
      reason = 'Please enter a score.';
      STATE.isYesWeightCorrect = true;
    }
    STATE.validationReason = reason;
  }

  @handle(CREATE_ACTIONS.BLANK_NO_WEIGHT)
  handleBlankNoWeight(action, reason){
    logger.debug('-2-');
    if(reason === 'noNoWeightEntered'){
      reason = 'Please enter a score.';
      STATE.isNoWeightCorrect = true;
    }
    STATE.validationReason = reason;
  }

  @handle(CREATE_ACTIONS.NOT_NUMERIC_YES_WEIGHT)
  handleNotNumericYesWeight(action, reason){
    if(reason === 'yesWeightNotNumeric'){
      reason = 'Scores can only contain numbers.';
      STATE.isYesWeightNumeric = true;
    }
    STATE.validationReason = reason;
  }

  @handle(CREATE_ACTIONS.NOT_NUMERIC_NO_WEIGHT)
  handleNotNumericNoWeight(action, reason){
    if(reason === 'noWeightNotNumeric') {
      reason = 'Scores can only contain numbers.';
      STATE.isNoWeightNumeric = true;
    }
    STATE.validationReason = reason;
  }

  @handle(CREATE_ACTIONS.EQUAL_WEIGHT)
  handleEqualWeight(action, reason){

    if(reason === 'equalWeight'){
      reason = 'Scores for YES and NO cannot be the same.';
      STATE.isWeightsCorrect = true;
    }

    STATE.validationReason = reason;
  }

  @handle(CREATE_ACTIONS.NEGATIVE_YES_WEIGHT)
  handleNegativeYesWeight(action, reason){

    if(reason === 'negativeYesWeight'){
      reason = 'Scores cannot be a negative.';
      STATE.isNegativeYesWeight = true;
    }

    STATE.validationReason = reason;
  }

  @handle(CREATE_ACTIONS.NEGATIVE_NO_WEIGHT)
  handleNegativeNoWeight(action, reason){

    if(reason === 'negativeNoWeight'){
      reason = 'Scores cannot be a negative.';
      STATE.isNegativeNoWeight = true;
    }

    STATE.validationReason = reason;
  }

  @handle(CREATE_ACTIONS.YES_WEIGHT_NOT_WHOLE_NUMBER)
  handleNoWeightNotWholeNumber(action, reason){
    if(reason === 'yesWeightNotWholeNumber'){
      reason = 'No weight must be whole number.';
      STATE.isYesWeightWholeNumber = true;
    }

    STATE.validationReason = reason;
  }

  @handle(CREATE_ACTIONS.NO_WEIGHT_NOT_WHOLE_NUMBER)
  handleYesWeightNotWholeNumber(action, reason){
    if(reason === 'noWeightNotWholeNumber'){
      logger.debug('inside if state');
      reason = 'Yes weight must be whole number.';
      STATE.isNoWeightWholeNumber = true;
    }

    STATE.validationReason = reason;
  }

  @handle(CREATE_ACTIONS.CLEAR_VALIDATION)
  handleClearValidation(action, reason){
    STATE.isQuestionCorrect = false;
    STATE.isYesWeightCorrect = false;
    STATE.isNoWeightCorrect = false;
    STATE.isYesWeightNumeric = false;
    STATE.isNoWeightNumeric = false;
    STATE.isWeightsCorrect = false;
    STATE.isNegativeYesWeight = false;
    STATE.isNegativeNoWeight = false;
    STATE.isNoWeightWholeNumber = false;
    STATE.isYesWeightWholeNumber = false;
  }

}
