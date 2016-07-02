/*
 */
import {CONVERSATION_ACTIONS} from './conversation.actions';
/*
 */
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
/*
 */
import {WebSocket, ApplicationService, UserSession} from 'zailab.common';
import {DateTimeTools} from 'zailab.common';
/*
 */
import uuid from 'node-uuid';
/*
 */
const logger = LogManager.getLogger('ConversationService');
/*
 */
@inject(Dispatcher, WebSocket, ApplicationService, UserSession, DateTimeTools)
export class ConversationService {

  constructor(dispatcher, webSocket, applicationService, userSession, dateTimeTools) {

    this.dispatcher = dispatcher;
    this.webSocket = webSocket;
    this.applicationService = applicationService;
    this.userSession = userSession;
    this.dateTimeTools = dateTimeTools;

    this.subscribe();

  }

  subscribe() {

    let contactCreatedEvent = 'com.zailab.organisation.contact.api.events.ContactCreatedEvent';
    let conversationCreatedEvent = 'com.zailab.organisation.conversation.api.events.ConversationCreatedEvent';
    let contactAddedToConversationEvent = 'com.zailab.organisation.conversation.api.events.ContactAddedToConversationEvent';
    let telephoneAddedToContactEvent = 'com.zailab.organisation.contact.api.events.TelephoneNumberAddedEvent';
    let emailAddedToContactEvent = 'com.zailab.organisation.contact.api.events.EmailAddedEvent';

    let contactUpdatedEvent = 'com.zailab.organisation.contact.api.events.UpdateTitleEvent';

    this.webSocket.subscribe({name: contactCreatedEvent, callback: data => {
      
      logger.debug(contactCreatedEvent + ' > data = ', data);
      this.contactCreatedEvent(data);
    }});
    this.webSocket.subscribe({name: contactUpdatedEvent, callback: data=> this.contactUpdatedEvent(data)});
    this.webSocket.subscribe({name: conversationCreatedEvent, callback: data=> this.conversationCreatedEvent(data)});
    //this.webSocket.subscribe({name: contactAddedToConversationEvent, callback: data=> this.contactAddedToConversationEvent(data)});
    this.webSocket.subscribe({name: telephoneAddedToContactEvent, callback: data=> this.telephoneAddedToContactEvent(data)});
    this.webSocket.subscribe({name: emailAddedToContactEvent, callback: data=> this.emailAddedToContactEvent(data)});

  }

  clearStore() {

    this.dispatcher.dispatch(CONVERSATION_ACTIONS.CLEAR_STORE);

  }

  searchContact(firstName, surname, email, number) {

    this.applicationService.searchContactsSearch(firstName, surname, email, number).then(
      (response) => {

        if (response && response[0]) {

          this.dispatcher.dispatch(CONVERSATION_ACTIONS.SEARCH_CONTACT, response);
          return;

        }

        this.dispatcher.dispatch(CONVERSATION_ACTIONS.SEARCH_CONTACT, []);

      },
      (error) => {
        
        this.dispatcher.dispatch(CONVERSATION_ACTIONS.SEARCH_CONTACT, []);
      }
    );

  }
  
  showConversation() {
    
    this.dispatcher.dispatch(CONVERSATION_ACTIONS.CAN_VIEW_CONVERSATION);
  }

  selectContact(contact) {

    this.dispatcher.dispatch(CONVERSATION_ACTIONS.SELECT_CONTACT, contact);
  }

  searchConversations(contactId){

    let organisationId = this.userSession.organisationId;
    let status = 'Pending';

    this.applicationService.selectContactSearch(organisationId, contactId, status).then(response=> {
      if (response.conversationSearchView && response.conversationSearchView[0]) {

        this.dispatcher.dispatch(CONVERSATION_ACTIONS.SEARCH_CONVERSATION, response.conversationSearchView);
        return;

      }

      this.dispatcher.dispatch(CONVERSATION_ACTIONS.SEARCH_CONVERSATION, []);

    });
  }

  createContact(firstName, surname, email, homeNumber, workNumber, mobileNumber) {

    let organisationId = this.userSession.organisationId;

    let message = {
      feature: 'conversation',
      name: 'com.zailab.organisation.contact.api.commands.CreateContactCommand',
      state: {
        organisationId: organisationId,
        contactId: uuid.v4(),
        firstName: firstName,
        surname: surname,
        email: email ? email : '',
        homeNumber: homeNumber ? homeNumber : '',
        workNumber: workNumber ? workNumber : '',
        mobileNumber: mobileNumber ? mobileNumber : ''
      }
    };

    this.webSocket.publish(message);
    
    logger.debug('createContact > published message = ', message);
  }

  changeFirstName(firstName, contactId){
    let organisationId = this.userSession.organisationId;

    let message = {
      feature: 'conversation',
      name: 'com.zailab.organisation.contact.api.commands.ChangeFirstNameCommand',
      state: {
        firstName: firstName,
        organisationId: organisationId,
        contactId:contactId
      }
    };

    this.webSocket.publish(message);
  }

  changeSurname(surname, contactId){
    let organisationId = this.userSession.organisationId;

    let message = {
      feature: 'conversation',
      name: 'com.zailab.organisation.contact.api.commands.ChangeSurnameCommand',
      state: {
        surname: surname,
        organisationId: organisationId,
        contactId:contactId
      }
    };

    this.webSocket.publish(message);
  }

  changeTitle(title, contactId){
    let organisationId = this.userSession.organisationId;

    let message = {
      feature: 'conversation',
      name: 'com.zailab.organisation.contact.api.commands.ChangeTitleCommand',
      state: {
        title: title,
        organisationId: organisationId,
        contactId:contactId
      }
    };

    this.webSocket.publish(message);
  }

  addTelephoneNumber(homeNumber, contactId, type){
    let organisationId = this.userSession.organisationId;

    let message = {
      feature: 'conversation',
      name: 'com.zailab.organisation.contact.api.commands.AddTelephoneNumberCommand',
      state: {
        newTelephoneNumber: homeNumber,
        organisationId: organisationId,
        contactId:contactId,
        type : type
      }
    };

    this.webSocket.publish(message);
  }

  removeTelephoneNumber(homeNumber, contactId, type){
    logger.debug('removeTelephoneNumber', !homeNumber);

    if(!homeNumber) {
      homeNumber = '';
    }

    let organisationId = this.userSession.organisationId;

    let message = {
      feature: 'conversation',
      name: 'com.zailab.organisation.contact.api.commands.RemoveTelephoneNumberCommand',
      state: {
        newTelephoneNumber: homeNumber,
        organisationId: organisationId,
        contactId:contactId,
        type : type
      }
    };

    this.webSocket.publish(message);
  }

  changeTelephoneNumber(homeNumber, contactId, type, oldNumber){
    let organisationId = this.userSession.organisationId;

    let message = {
      feature: 'conversation',
      name: 'com.zailab.organisation.contact.api.commands.ChangeTelephoneNumberCommand',
      state: {
        newTelephoneNumber: homeNumber,
        organisationId: organisationId,
        contactId:contactId,
        type : type,
        oldTelephoneNumber: oldNumber
      }
    };

    this.webSocket.publish(message);
  }

  addEmail(email, contactId, type){
    let organisationId = this.userSession.organisationId;

    let message = {
      feature: 'conversation',
      name: 'com.zailab.organisation.contact.api.commands.AddEmailCommand',
      state: {
        email: email,
        organisationId: organisationId,
        contactId:contactId,
        type:type
      }
    };

    this.webSocket.publish(message);
  }

  removeEmail(email, contactId){
    let organisationId = this.userSession.organisationId;
    if(!email) {
      email = '';
    }
    let message = {
      feature: 'conversation',
      name: 'com.zailab.organisation.contact.api.commands.RemoveEmailCommand',
      state: {
        email: email,
        organisationId: organisationId,
        contactId:contactId,
        type:type
      }
    };

    this.webSocket.publish(message);
  }

  changeEmail(email, contactId, oldEmail, type){
    let organisationId = this.userSession.organisationId;

    let message = {
      feature: 'conversation',
      name: 'com.zailab.organisation.contact.api.commands.ChangeEmailCommand',
      state: {
        newEmail: email,
        organisationId: organisationId,
        contactId:contactId,
        type:type,
        oldEmail: oldEmail
      }
    };

    this.webSocket.publish(message);
  }

  contactCreatedEvent(data) {

    let contact = data.state;

    this.dispatcher.dispatch(CONVERSATION_ACTIONS.CREATE_CONTACT, contact);
  }

  conversationCreatedEvent(data) {
    let conversation = data.state;

    this.dispatcher.dispatch(CONVERSATION_ACTIONS.CREATE_CONVERSATION, conversation);
  }

  contactAddedToConversationEvent(data){
    let contactToConversation = data.state;

    this.dispatcher.dispatch(CONVERSATION_ACTIONS.CREATE_CONVERSATION, contactToConversation);
  }

  telephoneAddedToContactEvent(data){
    let telephoneNumbers = data.state;

    this.dispatcher.dispatch(CONVERSATION_ACTIONS.TELEPHONE_NUMBER_ADDED_TO_CONTACT, telephoneNumbers);
  }

  emailAddedToContactEvent(data){
    let email = data.state;

    this.dispatcher.dispatch(CONVERSATION_ACTIONS.EMAIL_ADDED_TO_CONTACT, email);
  }

  selectConversation(conversation) {
    
    this.dispatcher.dispatch(CONVERSATION_ACTIONS.SELECT_CONVERSATION, conversation);
  }

  createConversation(info) {

    let organisationId = this.userSession.organisationId;
    let memberId = this.userSession.memberId;

    let message = {
      feature: 'conversation',
      name: 'com.zailab.organisation.conversation.api.commands.CreateConversationCommand',
      state: {
        organisationId: organisationId,
        conversationId: uuid.v4(),
        conversationName: info.conversationName,
        contactId: info.contactId,
        memberId: memberId
      }
    };

    this.webSocket.publish(message);
  }

  setConversationType(type) {
    this.dispatcher.dispatch(CONVERSATION_ACTIONS.SET_CONVERSATION_TYPE, type);
  }

}
