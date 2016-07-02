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
import {EditContactService} from './editcontact.service';
/*
 */
const logger = LogManager.getLogger('CreateContact');
/*
 */
@inject(Router, Validation, ConversationStore, ConversationService, EditContactService)
export class EditContact {

  isTitlesOpen = false;
  isNumbersOpen = false;
  number;
  contact = {};
  contactId;
  error;
  oldNumber;
  oldMobileNumber;
  oldHomeNumber;
  oldWorkNumber;
  oldPersonalEmail;
  oldWorkEmail;

  constructor(router, validation, conversationStore, conversationService, editContactService) {

    this.router = router;
    this.validation = validation;
    this.conversationStore = conversationStore;
    this.conversationService = conversationService;
    this.editContactService = editContactService;
    this.init();
  }

  init() {

    if (this.conversationStore.contactToEdit.telephoneNumbers) {
      
      for (let number of this.conversationStore.contactToEdit.telephoneNumbers) {

        if (number.type === 'MOBILE') {
          this.oldMobileNumber = number.number;
        } else if (number.type === 'WORK') {
          this.oldWorkNumber = number.number;
        } else if (number.type === 'HOME') {
          this.oldHomeNumber = number.number;
        }
      }
    }

    if (this.conversationStore.contactToEdit.emails) {

      for (let email of this.conversationStore.contactToEdit.emails) {
        
        if (email.type === 'PERSONAL') {
          this.oldPersonalEmail = email.email;
        } else if (email.type === 'WORK') {
          this.oldWorkEmail = email.email;
        }
      }
    }
  }

  activate(params) {
    
    this.editContactService.retrieveConversationAttributes(params.conversationId);
    this.contactId = params.contactId;
    this.validation = this.validation.on(this)
        .ensure('contact.firstName').isNotEmpty().withMessage('Please do not leave this blank.').hasLengthBetween(2,30).withMessage('Must be between 2 and 30 characters.').matches(/^([a-zA-Z'\s-])+$/)
        .ensure('contact.surname').isNotEmpty().withMessage('Please do not leave this blank.').hasLengthBetween(2,30).withMessage('Must be between 2 and 30 characters.').matches(/^([a-zA-Z'\s-])+$/)
        .ensure('contact.homeNumber').isNumber().withMessage('Must be a number.').hasMinLength(10).withMessage('Must be a minimum of 10 digits.')
        .ensure('contact.workNumber').isNumber().withMessage('Must be a number.').hasMinLength(10).withMessage('Must be a minimum of 10 digits.')
        .ensure('contact.mobileNumber').isNumber().withMessage('Must be a number.').hasMinLength(10).withMessage('Must be a minimum of 10 digits.')
        .ensure('contact.email').isEmail().withMessage('Please enter a valid email.');
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

    this.router.navigate('search/contact');
  }

  titles() {

    this.isTitlesOpen = !this.isTitlesOpen;
  }

  selectTitle(title) {

    this.contact.title = title;
    this.titles();
  }

  changeFirstName(firstName){
    
    this.conversationService.changeFirstName(firstName, this.contactId);
  }

  changeSurname(surname){
    
    this.conversationService.changeSurname(surname, this.contactId);
  }

  changeTitle(title){
    
    this.conversationService.changeTitle(title, this.contactId);
  }

  changeTelephoneNumber(telephoneNumber, type){
    
    if((!this.oldMobileNumber || !this.oldWorkNumber || !this.oldHomeNumber) && telephoneNumber){
      this.conversationService.addTelephoneNumber(telephoneNumber, this.contactId, type);
    }
    else if((this.oldMobileNumber || this.oldWorkNumber || this.oldHomeNumber) && !telephoneNumber){
      this.conversationService.removeTelephoneNumber(telephoneNumber, this.contactId, type);
    }
    else if((this.oldMobileNumber || this.oldWorkNumber || this.oldHomeNumber) && telephoneNumber){
      this.conversationService.changeTelephoneNumber(telephoneNumber, this.contactId, type, this.oldNumber);
    }
  }

  changeEmail(email, type){
    
    if((!this.oldPersonalEmail || !this.oldWorkEmail) && email){
      this.conversationService.addEmail(email, this.contactId, type);
    }
    else if((this.oldPersonalEmail || this.oldWorkEmail) && !email){
      this.conversationService.removeEmail(email, this.contactId, type);
    }
    else if(type === 'PERSONAL'){
      this.conversationService.changeEmail(email, this.contactId, this.oldPersonalEmail, type);
    }
    else if(type === 'WORK'){
      this.conversationService.changeEmail(email, this.contactId, this.oldWorkEmail, type);
    }
  }

  @handle(CONVERSATION_ACTIONS.SEARCH_CONTACT)
  @waitFor(ConversationStore)
  handleSearchContact(event, contacts) {
    
    this.contact = contacts[0];
    this.contact.numberType = this.contact.numberType ? this.contact.numberType : this.conversationStore.numberTypes[0];
  }
}
