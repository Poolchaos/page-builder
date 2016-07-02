import {EDIT_CONTACT_ACTIONS}  from './editcontact.actions';
import {ApplicationService, UserSession, WebSocket} from 'zailab.common';
/*
 aurelia
 */
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
/*
 Logger
 */
const logger = LogManager.getLogger('EditContactService');
const COMMANDS = {
  CHANGE_FIRST_NAME: 'com.zailab.organisation.contact.api.commands.ChangeFirstNameCommand',
  CHANGE_SURNAME: 'com.zailab.organisation.contact.api.commands.ChangeSurnameCommand',
  CHANGE_TITLE : 'com.zailab.organisation.contact.api.commands.ChangeTitleCommand',
  CHANGE_TELEPHONE_NUMBER : 'com.zailab.organisation.contact.api.commands.ChangeTelephoneNumberCommand',
  REMOVE_TELEPHONE_NUMBER :'com.zailab.organisation.contact.api.commands.RemoveTelephoneNumberCommand',
  ADD_TELEPHONE_NUMBER :'com.zailab.organisation.contact.api.commands.AddTelephoneNumberCommand',
  CHANGE_EMAIL_ADDRESS : 'com.zailab.organisation.contact.api.commands.ChangeEmailCommand',
  ADD_EMAIL_ADDRESS : 'com.zailab.organisation.contact.api.commands.AddEmailCommand',
  REMOVE_EMAIL_ADDRESS : 'com.zailab.organisation.contact.api.commands.RemoveEmailCommand'

};

let messageBus = null;

@inject(Dispatcher, ApplicationService, UserSession, WebSocket)
export class EditContactService {

  constructor(dispatcher, applicationService, userSession, webSocket) {

    this.dispatcher = dispatcher;
    this.applicationService = applicationService;

    messageBus = new MessageBus(userSession, webSocket);
  }

  retrieveContact(contactId) {

    logger.debug('retrieveContact > contactId > ', contactId);
    
    this.applicationService.findByContactIdSearch(contactId).then(

        (response) => {

          if (response && response.contactSearchView[0]) {

            logger.debug('retrieveContact >> response > ', response);
            
            let contact = response.contactSearchView[0];
            
            this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.RETRIEVE_CONTACT, contact);
            return;
          }

          this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.RETRIEVE_CONTACT, {});
        },

        (error) => {
          this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.RETRIEVE_CONTACT, {});
        }
    );
  }

  setError(error){
    
    this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.SET_ERROR, error);
  }
  
  changeTitle() {

    this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.CHANGE_TITLE);
  }

  cancelTitleChange() {

    this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.CANCEL_TITLE_CHANGE);
  }

  acceptTitleChange(contactId, title) {
    messageBus.publishMessage(COMMANDS.CHANGE_TITLE, {
      contactId: contactId,
      title: title
    });
    this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.ACCEPT_TITLE_CHANGE, title);
  }

  toggleTitles() {

    this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.TOGGLE_TITLES);
  }

  changeFirstName() {

    this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.CHANGE_FIRST_NAME);
  }

  changeSurname() {

    this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.CHANGE_SURNAME);
  }

  changeHomeNumber() {

    this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.CHANGE_HOME_NUMBER);
  }

  changeWorkNumber() {

    this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.CHANGE_WORK_NUMBER);
  }

  changeMobileNumberOne() {

    this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.CHANGE_MOBILE_NUMBER_ONE);
  }

  changeMobileNumberTwo() {

    this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.CHANGE_MOBILE_NUMBER_TWO);
  }

  changeEmailAddress() {

    this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.CHANGE_EMAIL_ADDRESS);
  }

  acceptFirstNameChange(contactId, firstName) {

    messageBus.publishMessage(COMMANDS.CHANGE_FIRST_NAME, {
      contactId: contactId,
      firstName: firstName
    });

    this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.ACCEPT_FIRST_NAME_CHANGE, firstName);
  }

  acceptSurnameChange(contactId, surname) {

    messageBus.publishMessage(COMMANDS.CHANGE_SURNAME, {
      contactId: contactId,
      surname: surname
    });

    this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.ACCEPT_SURNAME_CHANGE, surname);
  }

  acceptHomeNumberChange(contactId, homeNumber, originalHomeNumber) {

    let type = 'HOME'
    
    let contactCommand = contactTelephoneNumberCommandFactory(homeNumber, originalHomeNumber, contactId, type);

    if(!contactCommand){
      return;
    }
    
    messageBus.publishMessage(contactCommand.message, contactCommand.payload);
    
    this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.ACCEPT_HOME_NUMBER_CHANGE, homeNumber);
  }

  acceptWorkNumberChange(contactId, workNumber, originalWorkNumber) {

    let type = 'WORK'
    
    let contactCommand = contactTelephoneNumberCommandFactory(workNumber, originalWorkNumber, contactId, type);

    if(!contactCommand){
      return;
    }
    
    messageBus.publishMessage(contactCommand.message, contactCommand.payload);

    this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.ACCEPT_WORK_NUMBER_CHANGE, workNumber);
  }

  acceptMobileNumberOneChange(contactId, mobileNumberOne, originalMobileNumberOne) {

    let type = 'MOBILE'
    
    let contactCommand = contactTelephoneNumberCommandFactory(mobileNumberOne, originalMobileNumberOne, contactId, type);

    if(!contactCommand){
      return;
    }
    
    messageBus.publishMessage(contactCommand.message, contactCommand.payload);

    this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.ACCEPT_MOBILE_NUMBER_ONE_CHANGE, mobileNumberOne);
  }

  acceptMobileNumberTwoChange(contactId, mobileNumberTwo, originalMobileNumberTwo) {

    let type = 'MOBILE'
    
    let contactCommand = contactTelephoneNumberCommandFactory(mobileNumberTwo, originalMobileNumberTwo, contactId, type);

    if(!contactCommand){
      return;
    }
    
    messageBus.publishMessage(contactCommand.message, contactCommand.payload);
    this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.ACCEPT_MOBILE_NUMBER_TWO_CHANGE, mobileNumberTwo);
  }

  acceptEmailAddressChange(contactId, emailType, emailAddress, originalEmailAddress) {

    let message;

    let payload = {
      contactId: contactId,
      type: emailType
    };
    
     if(!originalEmailAddress && !emailAddress){
      return;
    }
    
    if (originalEmailAddress && emailAddress) {

        message = COMMANDS.CHANGE_EMAIL_ADDRESS;
        payload.newEmail = emailAddress;
        payload.oldEmail = originalEmailAddress;
    } 
    
    if(originalEmailAddress && !emailAddress){

        message = COMMANDS.REMOVE_EMAIL_ADDRESS;
        payload.email = originalEmailAddress;  
    } 
    
    if(!originalEmailAddress && emailAddress){
      
      message = COMMANDS.ADD_EMAIL_ADDRESS;
      payload.email = emailAddress;
    }
    
    messageBus.publishMessage(message, payload);

    this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.ACCEPT_EMAIL_ADDRESS_CHANGE, emailAddress);
  }

  cancelFirstNameChange() {

    this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.CANCEL_FIRST_NAME_CHANGE);
  }

  cancelSurnameChange() {

    this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.CANCEL_SURNAME_CHANGE);
  }

  cancelHomeNumberChange() {

    this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.CANCEL_HOME_NUMBER_CHANGE);
  }

  cancelWorkNumberChange() {

    this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.CANCEL_WORK_NUMBER_CHANGE);
  }

  cancelMobileNumberOneChange() {

    this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.CANCEL_MOBILE_NUMBER_ONE_CHANGE);
  }

  cancelMobileNumberTwoChange() {

    this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.CANCEL_MOBILE_NUMBER_TWO_CHANGE);
  }

  cancelEmailAddressChange() {

    this.dispatcher.dispatch(EDIT_CONTACT_ACTIONS.CANCEL_EMAIL_ADDRESS_CHANGE);
  }
  
}
/*
*/
function contactTelephoneNumberCommandFactory(newNumber, originalNumber, contactId, type){
  
  let payload = {
      contactId: contactId,
      type: type
    };
  
  let command = {
    payload: payload,
    message: ''
  };
  
    if(!originalNumber && !newNumber){
      return;
    }
    
    if (originalNumber && newNumber) {

        command.message = COMMANDS.CHANGE_TELEPHONE_NUMBER;
        command.payload.newTelephoneNumber = newNumber;
        command.payload.oldTelephoneNumber = originalNumber;
    } 
    
    if(originalNumber && !newNumber){

      command.message = COMMANDS.REMOVE_TELEPHONE_NUMBER;
      command.payload.telephoneNumber = originalNumber;    
    } 
    
    if(!originalNumber && newNumber){
      
      command.message = COMMANDS.ADD_TELEPHONE_NUMBER;
      command.payload.telephoneNumber = newNumber;  
    }
  
  return command;
  
}
/*
*/
class MessageBus {

  constructor(userSession, webSocket) {

    this.userSession = userSession;
    this.webSocket = webSocket;
  }

  publishMessage(name, payload){

    payload.organisationId = this.userSession.organisationId;

    let message = {
      feature: 'conversation',
      name: name,
      state: payload
    };
    this.webSocket.publish(message);
  }
}

