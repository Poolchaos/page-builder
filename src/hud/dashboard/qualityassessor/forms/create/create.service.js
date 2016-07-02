import {
    inject, LogManager
}
    from 'aurelia-framework';
import {
    Dispatcher
}
    from 'aurelia-flux';
import {
    CREATE_ACTIONS
}
    from './create.actions';

import {
    ApplicationService, UserSession, WebSocket
}
    from 'zailab.common';
/*
 */
import uuid from 'node-uuid';
/*
 */
const logger = LogManager.getLogger('CreateService');

@
inject(ApplicationService, Dispatcher, UserSession, WebSocket)
export class CreateService {


  constructor(applicationService, dispatcher, userSession, webSocket) {
    this.applicationService = applicationService;
    this.dispatcher = dispatcher;
    this.userSession = userSession;
    this.webSocket = webSocket;
    this.subscribe();
  }

  subscribe() {
    this.webSocket.subscribe({
      name: 'com.zailab.organisation.form.api.events.FormPublishedEvent',
      callback: data => {
        this.dispatcher.dispatch(CREATE_ACTIONS.SHOW_SUCCESS);
        this.clearState();
      }
    });
  }

  clearState() {
    this.dispatcher.dispatch(CREATE_ACTIONS.CLEAR_STATE);
  }

  retrievePersonalInfo() {

    let personId = this.userSession.user.personId;

    this.applicationService.userInfoSearch(personId).then(response => {

      if (response.displayPersonInformationView && response.displayPersonInformationView[0]) {

        let personalInfo = response.displayPersonInformationView[0];
        this.dispatcher.dispatch(CREATE_ACTIONS.RETRIEVE_PERSONAL_INFO, personalInfo);
      }
    });
  }

  getSectionData() {
    this.dispatcher.dispatch(CREATE_ACTIONS.FETCH_FORMATTED_SECTIONS, []);
  }

  publishForm(formId, name, passRequirement, channels, sections, member) {

    let organisationId = this.userSession.organisationId

    for(let section of sections){

      for(let question of section.questions){
        question.yesWeight = parseInt(question.yesWeight);
        question.noWeight = parseInt(question.noWeight);
      }
    }

    let message = {
      feature: 'qualityassurance',
      name: 'com.zailab.organisation.form.api.commands.PublishFormCommand',
      state: {
        formId: uuid.v4(),
        organisationId: organisationId,
        name: name,
        channels: channels,
        sections: sections,
        createdBy: member,
        passRequirement: parseInt(passRequirement)
      }
    };

    this.webSocket.publish(message);
  }

  calculateScore(question) {
    this.dispatcher.dispatch(CREATE_ACTIONS.CALCULATE_SCORE, question);
  }

  addQuestion(question) {
    this.dispatcher.dispatch(CREATE_ACTIONS.ADD_QUESTION, question);
  }

  removeQuestion(question) {
    this.dispatcher.dispatch(CREATE_ACTIONS.REMOVE_QUESTION, question);
  }


  toggleEditQuestion(isInEditState){
    this.dispatcher.dispatch(CREATE_ACTIONS.TOGGLE_EDIT_QUESTION, isInEditState);
  }

  blankQuestionValidation(reason){
      this.dispatcher.dispatch(CREATE_ACTIONS.BLANK_QUESTION_VALIDATION, reason);
  }

  sectionValidation(reason){
      this.dispatcher.dispatch(CREATE_ACTIONS.SECTION_VALIDATION, reason);
  }

  clearValidation(reason){
    this.dispatcher.dispatch(CREATE_ACTIONS.CLEAR_VALIDATION, reason);
  }

  blankYesWeightValidation(reason){
    this.dispatcher.dispatch(CREATE_ACTIONS.BLANK_YES_WEIGHT, reason);
  }

  blankNoWeightValidation(reason){
    this.dispatcher.dispatch(CREATE_ACTIONS.BLANK_NO_WEIGHT, reason);
  }

  yesWeightNotNumeric(reason){
    this.dispatcher.dispatch(CREATE_ACTIONS.NOT_NUMERIC_YES_WEIGHT, reason);
  }
  noWeightNotNumeric(reason){
    this.dispatcher.dispatch(CREATE_ACTIONS.NOT_NUMERIC_NO_WEIGHT, reason);
  }
  equalWeight(reason){
    this.dispatcher.dispatch(CREATE_ACTIONS.EQUAL_WEIGHT, reason);
  }
  negativeNoWeight(reason){
    this.dispatcher.dispatch(CREATE_ACTIONS.NEGATIVE_NO_WEIGHT, reason);
  }
  negativeYesWeight(reason){
    this.dispatcher.dispatch(CREATE_ACTIONS.NEGATIVE_YES_WEIGHT, reason);
  }

  noWeightNotWholeNumber(reason){
    this.dispatcher.dispatch(CREATE_ACTIONS.NO_WEIGHT_NOT_WHOLE_NUMBER, reason);
  }

  yesWeightNotWholeNumber(reason){
    this.dispatcher.dispatch(CREATE_ACTIONS.YES_WEIGHT_NOT_WHOLE_NUMBER, reason);
  }


}