/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Validation} from 'aurelia-validation';
import {handle, waitFor} from 'aurelia-flux';
/*
*/
import {CONVERSATION_ACTIONS} from '../conversation.actions';
import {ConversationStore} from '../conversation.store';
import {ConversationService} from '../conversation.service';
/*
*/
const logger = LogManager.getLogger('CreateContact');
/*
*/
@inject(Router, Validation, ConversationStore, ConversationService)
export class CreateContact {

  firstName;
  surname;
  email;
  homeNumber;
  workNumber;
  cellNumber;

  error;

  constructor(router, validation, conversationStore, conversationService) {

    this.router = router;
    this.validation = validation;
    this.conversationStore = conversationStore;
    this.conversationService = conversationService;
  }

  activate() {
    
    let firstName = this.conversationStore.selectedContact.firstName;
    let surname = this.conversationStore.selectedContact.surname;
    let email = this.conversationStore.selectedContact.email;
    let homeNumber = this.conversationStore.selectedContact.homeNumber;
    let workNumber = this.conversationStore.selectedContact.workNumber;
    let cellNumber = this.conversationStore.selectedContact.cellNumber;
    
    if(firstName || surname || email || homeNumber || workNumber || cellNumber) {
      
      logger.debug(' this.conversationStore.selectedContact >>>> ', this.conversationStore.selectedContact);
      
      this.firstName = this.conversationStore.selectedContact.firstName;
      this.surname = this.conversationStore.selectedContact.surname;
      this.email = this.conversationStore.selectedContact.email;
      this.homeNumber = this.conversationStore.selectedContact.homeNumber;
      this.workNumber = this.conversationStore.selectedContact.workNumber;
      this.cellNumber = this.conversationStore.selectedContact.cellNumber;
    } else {
    
      this.firstName = this.conversationStore.searchContact.firstName;
      this.surname = this.conversationStore.searchContact.surname;
      this.email = this.conversationStore.searchContact.email;
      this.homeNumber = this.conversationStore.searchContact.homeNumber;
      this.workNumber = this.conversationStore.searchContact.workNumber;
      this.cellNumber = this.conversationStore.searchContact.contactNumber;
    }

    this.validation = this.validation.on(this)
        .ensure('firstName').matches(/^([a-zA-Z'\s-])+$/).withMessage('Must be a valid first name.').hasMaxLength(30).withMessage('First name cannot exceed 30 characters.')
        .ensure('surname').matches(/^([a-zA-Z'\s-])+$/).withMessage('Must be a valid surname.').hasMaxLength(30).withMessage('Surname cannot exceed 30 characters.')
        .ensure('homeNumber').isNumber().withMessage('Must be a number.').hasMinLength(10).withMessage('Must be between 10 and 15 digits.').hasMaxLength(15).withMessage('Must be between 10 and 15 digits.')
        .ensure('workNumber').isNumber().withMessage('Must be a number.').hasMinLength(10).withMessage('Must be between 10 and 15 digits.').hasMaxLength(15).withMessage('Must be between 10 and 15 digits.')
        .ensure('cellNumber').isNumber().withMessage('Must be a number.').hasMinLength(10).withMessage('Must be between 10 and 15 digits.').hasMaxLength(15).withMessage('Must be between 10 and 15 digits.')
        .ensure('email').isEmail().withMessage('Please enter a valid email.').hasMaxLength(50).withMessage('Email cannot exceed 50 characters.');

  }

  attached() {
    setTimeout(() => {

      this.setFocus('firstName');
    }, 500);
  }

  setFocus(field) {

    let firstElement = document.getElementById(field);
    if (firstElement !== null) {
      firstElement.focus();
    } else {

      setTimeout(() => {

        this.setFocus(field);
      }, 100);
    }
  }

  cancel() {

    this.router.navigate('contact/search');
  }

  create() {

    this.error = '';

    this.validation.validate().then(() => {

      if (!this.homeNumber && !this.workNumber && !this.cellNumber) {
        this.error = 'Please specify at least one contact number.';
        return;
      }

      this.conversationService.createContact(this.firstName, this.surname, this.email, this.homeNumber, this.workNumber, this.cellNumber);

    }).catch(err=> {
      
      logger.debug('create > err = ', err);
    });

  }

  @handle(CONVERSATION_ACTIONS.CREATE_CONTACT)
  @waitFor(ConversationStore)
  createContact(event, data) {

    setTimeout(() => {
      this.router.navigate('create');
    });
  }

}
