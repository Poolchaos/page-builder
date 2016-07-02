/*
 */
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Validation} from 'aurelia-validation';
import {handle, waitFor} from 'aurelia-flux';
/*
 */
import {EDIT_CONTACT_ACTIONS} from './editcontact.actions';
import {ConversationStore} from '../conversation.store';
import {EditContactService} from './editcontact.service';
import {EditContactStore} from './editcontact.store';
/*
 */
const logger = LogManager.getLogger('EditContact');
/*
 */
@
inject(Router, Validation, ConversationStore, EditContactService, EditContactStore)
export class EditContact {

  resolve;
  conversationId;
  contactId;

  constructor(router, validation, conversationStore, editContactService, editContactStore) {

    this.router = router;
    this.validation = validation;
    this.conversationStore = conversationStore;
    this.editContactService = editContactService;
    this.editContactStore = editContactStore;
  }

  canActivate(params) {

    this.contactId = params.contactId;

    this.editContactService.retrieveContact(this.contactId);

    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }

  activate(params) {

    this.conversationId = params.conversationId;


    this.validation = this.validation.on(this)
      .ensure('editContactStore.contact.firstName').matches(/^([a-zA-Z'\s-])+$/).withMessage('Must be a valid first name.').hasMaxLength(30).withMessage('First name cannot exceed 30 characters.')
      .ensure('editContactStore.contact.surname').matches(/^([a-zA-Z'\s-])+$/).withMessage('Must be a valid surname.').hasMaxLength(30).withMessage('Surname cannot exceed 30 characters.')
      .ensure('editContactStore.contact.homeNumber').isNumber().withMessage('Must be a number.').hasMinLength(10).withMessage('Must be between 10 and 15 digits.').hasMaxLength(15).withMessage('Must be between 10 and 15 digits.')
      .ensure('editContactStore.contact.workNumber').isNumber().withMessage('Must be a number.').hasMinLength(10).withMessage('Must be between 10 and 15 digits.').hasMaxLength(15).withMessage('Must be between 10 and 15 digits.')
      .ensure('editContactStore.contact.mobileNumberOne').isNumber().withMessage('Must be a number.').hasMinLength(10).withMessage('Must be between 10 and 15 digits.').hasMaxLength(15).withMessage('Must be between 10 and 15 digits.')
      .ensure('editContactStore.contact.mobileNumberTwo').isNumber().withMessage('Must be a number.').hasMinLength(10).withMessage('Must be between 10 and 15 digits.').hasMaxLength(15).withMessage('Must be between 10 and 15 digits.')
      .ensure('editContactStore.contact.emailAddress').isEmail().withMessage('Please enter a valid email.').hasMaxLength(50).withMessage('Email cannot exceed 50 characters.');

  }


  detached() {
    this.setError('');
    this.cancelTitleChange();
    this.cancelFirstNameChange();
    this.cancelSurnameChange();
    this.cancelHomeNumberChange();
    this.cancelWorkNumberChange();
    this.cancelMobileNumberOneChange();
    this.cancelMobileNumberTwoChange();
    this.cancelEmailAddressChange();
  }

  attached() {

    setFocus('title');
  }

  get disableBackButton() {

    return this.editContactStore.isChangeTitle || this.editContactStore.isChangeFirstName || this.editContactStore.isChangeSurname || this.editContactStore.isChangeSurname || this.editContactStore.isChangeHomeNumber || this.editContactStore.isChangeWorkNumber || this.editContactStore.isChangeMobileNumberOne || this.editContactStore.isChangeMobileNumberTwo || this.editContactStore.isChangeEmailAddress;
  }

  changeTitle() {

    this.editContactService.changeTitle();
  }

  cancelTitleChange() {

    this.editContactService.cancelTitleChange();
  }

  acceptTitleChange(title) {

    this.editContactService.acceptTitleChange(this.contactId, title);
  }

  get isChangeTitle() {

    return this.editContactStore.isChangeTitle;
  }

  toggleTitles() {

    this.editContactService.toggleTitles();
  }

  get isTitlesVisible() {

    return this.editContactStore.isTitlesVisible;
  }

  changeFirstName() {

    this.editContactService.changeFirstName();
  }

  changeSurname() {

    this.editContactService.changeSurname();
  }

  changeHomeNumber() {

    this.editContactService.changeHomeNumber();
  }

  changeWorkNumber() {

    this.editContactService.changeWorkNumber();
  }

  changeMobileNumberOne() {

    this.editContactService.changeMobileNumberOne();
  }

  changeMobileNumberTwo() {

    this.editContactService.changeMobileNumberTwo();
  }

  changeEmailAddress() {

    this.editContactService.changeEmailAddress();
  }




  acceptFirstNameChange() {
    this.validation.validate()
      .then(() => {
          this.editContactService.acceptFirstNameChange(this.contactId, this.editContactStore.contact.firstName);
        },
        error => {
          logger.warn('Telephone number incorrect', error);
        }
      )

  }

  acceptSurnameChange() {
    this.validation.validate()
      .then(() => {
          this.editContactService.acceptSurnameChange(this.contactId, this.editContactStore.contact.surname);
        },
        error => {
          logger.warn('Telephone number incorrect', error);
        }
      )
  }

  acceptHomeNumberChange() {

    let homeNumber = this.editContactStore.contact.homeNumber;

    if (this.checkValidTelephoneNumber(homeNumber)) {

      this.validation.validate()
        .then(() => {
            this.editContactService.acceptHomeNumberChange(this.contactId, homeNumber, this.editContactStore.contactHistory.homeNumber);
          },
          error => {
            logger.warn('Telephone number incorrect', error);
          });
    }
  }

  acceptWorkNumberChange() {

    let workNumber = this.editContactStore.contact.workNumber;

    if (this.checkValidTelephoneNumber(workNumber)) {

      this.validation.validate()
        .then(() => {
            this.editContactService.acceptWorkNumberChange(this.contactId, workNumber, this.editContactStore.contactHistory.workNumber);
          },
          error => {
            logger.warn('Telephone number incorrect', error);
          });

    }
  }


  acceptMobileNumberOneChange() {

    let mobileNumberOne = this.editContactStore.contact.mobileNumberOne;

    if (this.checkValidTelephoneNumber(mobileNumberOne)) {

      this.validation.validate()
        .then(() => {
            this.editContactService.acceptMobileNumberOneChange(this.contactId, mobileNumberOne, this.editContactStore.contactHistory.mobileNumberOne);
          },
          error => {
            logger.warn('Telephone number incorrect', error);
          });

    }
  }


  acceptMobileNumberTwoChange() {

    let mobileNumberTwo = this.editContactStore.contact.mobileNumberTwo;

    if (this.checkValidTelephoneNumber(mobileNumberTwo)) {

      this.validation.validate()
        .then(() => {
            this.editContactService.acceptMobileNumberTwoChange(this.contactId, mobileNumberTwo, this.editContactStore.contactHistory.mobileNumberTwo);
          },
          error => {
            logger.warn('Telephone number incorrect', error);
          });
    }
  }

  acceptEmailAddressChange() {
    let email = this.editContactStore.contact.emailAddress;
    if (this.checkValidEmail(email)) {
      this.validation.validate()
        .then(() => {
            this.editContactService.acceptEmailAddressChange(this.contactId, this.editContactStore.contact.emailType, this.editContactStore.contact.emailAddress, this.editContactStore.contactHistory.emailAddress);
          },
          error => {
            logger.warn('Email address incorrect', error);
          }
        );
    }
  }

  cancelFirstNameChange() {

    this.editContactService.cancelFirstNameChange();
  }

  cancelSurnameChange() {

    this.editContactService.cancelSurnameChange();
  }

  cancelHomeNumberChange() {

    this.editContactService.cancelHomeNumberChange();
    this.setError('');
  }

  cancelWorkNumberChange() {

    this.editContactService.cancelWorkNumberChange();
    this.setError('');
  }

  cancelMobileNumberOneChange() {

    this.editContactService.cancelMobileNumberOneChange();
    this.setError('');
  }

  cancelMobileNumberTwoChange() {

    this.editContactService.cancelMobileNumberTwoChange();
    this.setError('');
  }

  cancelEmailAddressChange() {

    this.editContactService.cancelEmailAddressChange();
    this.setError('');
  }

  cancel() {

    //this.router.navigate('search/contact'); // TODO should go to view
    this.router.parent.navigate(`conversation/view/${this.conversationId}/call`);
  }

  checkValidTelephoneNumber(number) {

    let isValid = true;

    this.setError('');

    let originalHomeNumber = this.editContactStore.contactHistory.homeNumber;
    let originalWorkNumber = this.editContactStore.contactHistory.workNumber;
    let originalMobileNumberOne = this.editContactStore.contactHistory.mobileNumberOne;
    let originalMobileNumberTwo = this.editContactStore.contactHistory.mobileNumberTwo;

    let homeNumber = this.editContactStore.contact.homeNumber;
    let workNumber = this.editContactStore.contact.workNumber;
    let mobileNumberOne = this.editContactStore.contact.mobileNumberOne;
    let mobileNumberTwo = this.editContactStore.contact.mobileNumberTwo;

    let isLastNumber = (!homeNumber && !workNumber && !mobileNumberOne && !mobileNumberTwo) ? true : false;

    if (!number && isLastNumber) {

      isValid = false;

      this.setError('Please specify at least one number.');

      return isValid;
    }

    if (!number) {
      return isValid;
    }

    if (number === originalHomeNumber || number === originalWorkNumber || number === originalMobileNumberOne || number === originalMobileNumberTwo) {

      this.setError('Cannot add duplicate number.');

      isValid = false;
    }

    return isValid;
  }

  checkValidEmail(email) {
    let isValid = true;
    this.setError('');
    let originalEmail = this.editContactStore.contactHistory.emailAddress;
    if (!email) {
      return isValid;
    }
   
    if (email === originalEmail) {
      this.setError('Cannot add duplicate email.');
      isValid = false;
    }


    return isValid;

  }

  setError(error) {

    this.editContactService.setError(error);
  }

  @
  handle(EDIT_CONTACT_ACTIONS.RETRIEVE_CONTACT)@ waitFor(EditContactStore)
  handleRetrieveContact() {

    if (this.resolve) {

      this.resolve(true);
      this.resolve = null;
    }
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