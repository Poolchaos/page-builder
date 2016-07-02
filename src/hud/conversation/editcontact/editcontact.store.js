import {EDIT_CONTACT_ACTIONS} from './editcontact.actions';
/*
*/
import {handle} from 'aurelia-flux';
import {LogManager} from 'aurelia-framework';
/*
 Logger
 */
const logger = LogManager.getLogger('EditContactStore');
/*
*/
let STATE = {
  
  contactId: null,
  error: null,

  isChangeTitle: false,
  isTitlesVisible: false,
  isChangeFirstName: false,
  isChangeSurname: false,
  isChangeHomeNumber : false,
  isChangeWorkNumber: false,
  isChangeMobileNumberOne: false,
  isChangeMobileNumberTwo: false,
  isChangeEmailAddress: false,

  contact: {
    
    title: null,
    firstName: null,
    surname: null,
    homeNumber: null,
    workNumber: null,
    mobileNumberOne: null,
    mobileNumberTwo: null,
    emailAddress: null
  },
  
  contactHistory: {
    
    title: null,
    firstName: null,
    surname: null,
    homeNumber: null,
    workNumber: null,
    mobileNumberOne: null,
    mobileNumberTwo: null,
    emailAddress: null
  }
};
/*
*/
export class EditContactStore {
  
  get contact() {
    return STATE.contact;
  }  
  
  get error() {
    return STATE.error;
  }

  get contactId(){
    return STATE.contactId;
  }

  get titles() {
    return ['Mr', 'Mrs', 'Miss', 'Dr', 'Prof'];
  }
  
  get isChangeTitle() {
    return STATE.isChangeTitle;
  }
  
  get isTitlesVisible() {
    return STATE.isTitlesVisible;
  }
  
  get isChangeFirstName() {
    return STATE.isChangeFirstName;
  }

  get isChangeSurname() {
    return STATE.isChangeSurname;
  }

  get isChangeHomeNumber(){
    return STATE.isChangeHomeNumber;
  }
  get isChangeWorkNumber(){
    return STATE.isChangeWorkNumber;
  }

  get isChangeMobileNumberOne(){
    return STATE.isChangeMobileNumberOne;
  }

  get isChangeMobileNumberTwo(){
    return STATE.isChangeMobileNumberTwo;
  }

  get isChangeEmailAddress(){
    return STATE.isChangeEmailAddress;
  }

  get contactHistory() {
    return STATE.contactHistory;
  }

  @handle(EDIT_CONTACT_ACTIONS.RETRIEVE_CONTACT)
  handleRetrieveContact(action, contact) {
    
    logger.debug('handleRetrieveContact > contact = ', contact);

    let email = findEmail(contact.emails) || {};

    STATE.contactId = contact.contactId;
    
    STATE.contact.title = contact.title || '';
    STATE.contact.firstName = contact.firstName || '';
    STATE.contact.surname = contact.surname || '';
    STATE.contact.homeNumber = findNumberByType(contact.telephoneNumbers, 'HOME') || '';
    STATE.contact.workNumber = findNumberByType(contact.telephoneNumbers, 'WORK') || '';
    STATE.contact.mobileNumberOne = findNumberByType(contact.telephoneNumbers, 'MOBILE') || '';
    STATE.contact.mobileNumberTwo = findNumberByType(contact.telephoneNumbers, 'MOBILE') || '';
    STATE.contact.emailAddress = email.email || '';
    STATE.contact.emailType = email.type || 'PERSONAL';

    STATE.contactHistory.title = STATE.contact.title;
    STATE.contactHistory.firstName = STATE.contact.firstName;
    STATE.contactHistory.surname = STATE.contact.surname;
    STATE.contactHistory.homeNumber = STATE.contact.homeNumber;
    STATE.contactHistory.workNumber = STATE.contact.workNumber;
    STATE.contactHistory.mobileNumberOne = STATE.contact.mobileNumberOne;
    STATE.contactHistory.mobileNumberTwo = STATE.contact.mobileNumberTwo;
    STATE.contactHistory.emailAddress = STATE.contact.emailAddress;
  }

  @handle(EDIT_CONTACT_ACTIONS.SET_ERROR)
  handleSetError(action, error) {

    return STATE.error = error;
  }

  @handle(EDIT_CONTACT_ACTIONS.CHANGE_TITLE)
  handleChangeTitle() {
    
    logger.debug('handleChangeTitle');
    
    return STATE.isChangeTitle = true;
  }

  @handle(EDIT_CONTACT_ACTIONS.ACCEPT_TITLE_CHANGE)
  handleAcceptTitleChange(action, title) {
    
    logger.debug('handleAcceptTitleChange > title = ', title);
    
    STATE.contact.title = title;
    STATE.contactHistory.title = title;
    
    STATE.isChangeTitle = false;
    STATE.isTitlesVisible = false;
  }

  @handle(EDIT_CONTACT_ACTIONS.CANCEL_TITLE_CHANGE)
  handleCancelTitleChange() {
    
    logger.debug('handleCancelTitleChange');
    
    STATE.contact.title = STATE.contactHistory.title;
    
    STATE.isChangeTitle = false;
    STATE.isTitlesVisible = false;
  }

  @handle(EDIT_CONTACT_ACTIONS.TOGGLE_TITLES)
  handleToggleTitles() {
    
    logger.debug('handleToggleTitles');
    
    STATE.isTitlesVisible = !STATE.isTitlesVisible;
  }

  @handle(EDIT_CONTACT_ACTIONS.CHANGE_FIRST_NAME)
  handleChangeFirstName() {
    
    logger.debug('handleChangeFirstName');
    
    STATE.isChangeFirstName = true;
  }

  @handle(EDIT_CONTACT_ACTIONS.CHANGE_SURNAME)
  handleChangeSurname() {

    logger.debug('handleChangeSurname');

    STATE.isChangeSurname = true;
  }

  @handle(EDIT_CONTACT_ACTIONS.CHANGE_HOME_NUMBER)
  handleChangeHomeNumber() {

    logger.debug('handleChangeHomeNumber');

    STATE.isChangeHomeNumber = true;
  }

  @handle(EDIT_CONTACT_ACTIONS.CHANGE_WORK_NUMBER)
  handleChangeWorkNumber() {

    logger.debug('handleChangeWorkNumber');

    STATE.isChangeWorkNumber = true;
  }

  @handle(EDIT_CONTACT_ACTIONS.CHANGE_MOBILE_NUMBER_ONE)
  handleChangeMobileNumberOne() {

    logger.debug('handleChangeMobileNumberOne');

    STATE.isChangeMobileNumberOne = true;
  }

  @handle(EDIT_CONTACT_ACTIONS.CHANGE_MOBILE_NUMBER_TWO)
  handleChangeMobileNumberTwo() {

    logger.debug('handleChangeMobileNumberTwo');

    STATE.isChangeMobileNumberTwo = true;
  }

  @handle(EDIT_CONTACT_ACTIONS.CHANGE_EMAIL_ADDRESS)
  handleChangeEmailAddress() {

    logger.debug('handleChangeEmailAddress');

    STATE.isChangeEmailAddress = true;
  }

  @handle(EDIT_CONTACT_ACTIONS.ACCEPT_FIRST_NAME_CHANGE)
  handleAcceptFirstNameChange(action, firstName) {
    
    logger.debug('handleAcceptFirstNameChange > firstName = ', firstName);
    
    STATE.contact.firstName = firstName;
    STATE.contactHistory.firstName = firstName;
    
    STATE.isChangeFirstName = false;
  }

  @handle(EDIT_CONTACT_ACTIONS.ACCEPT_SURNAME_CHANGE)
  handleAcceptSurnameChange(action, surname) {

    logger.debug('handleAcceptSurnameChange > surname = ', surname);

    STATE.contact.surname = surname;
    STATE.contactHistory.surname = surname;

    STATE.isChangeSurname= false;
  }

  @handle(EDIT_CONTACT_ACTIONS.ACCEPT_HOME_NUMBER_CHANGE)
  handleAcceptHomeNumberChange(action, homeNumber) {

    logger.debug('handleAcceptHomeNumberChange > homeNumber = ', homeNumber);

    STATE.contact.homeNumber = homeNumber;
    STATE.contactHistory.homeNumber = homeNumber;

    STATE.isChangeHomeNumber = false;
  }

  @handle(EDIT_CONTACT_ACTIONS.ACCEPT_WORK_NUMBER_CHANGE)
  handleAcceptWorkNumberChange(action, workNumber) {

    logger.debug('handleAcceptWorkNumberChange > workNumber = ', workNumber);

    STATE.contact.workNumber = workNumber;
    STATE.contactHistory.workNumber = workNumber;

    STATE.isChangeWorkNumber = false;
  }

  @handle(EDIT_CONTACT_ACTIONS.ACCEPT_MOBILE_NUMBER_ONE_CHANGE)
  handleAcceptMobileNumberOneChange(action, mobileNumberOne) {

    logger.debug('handleAcceptMobileNumberOneChange > mobileNumberOne = ', mobileNumberOne);

    STATE.contact.mobileNumberOne = mobileNumberOne;
    STATE.contactHistory.mobileNumberOne = mobileNumberOne;

    STATE.isChangeMobileNumberOne = false;
  }

  @handle(EDIT_CONTACT_ACTIONS.ACCEPT_MOBILE_NUMBER_TWO_CHANGE)
  handleAcceptMobileNumberTwoChange(action, mobileNumberTwo) {

    logger.debug('handleAcceptMobileNumberTwoChange > mobileNumberTwo = ', mobileNumberTwo);

    STATE.contact.mobileNumberTwo = mobileNumberTwo;
    STATE.contactHistory.mobileNumberTwo = mobileNumberTwo;

    STATE.isChangeMobileNumberTwo = false;
  }

  @handle(EDIT_CONTACT_ACTIONS.ACCEPT_EMAIL_ADDRESS_CHANGE)
  handleAcceptEmailAddressChange(action, emailAddress) {

    logger.debug('handleAcceptEmailAddressChange > emailAddress = ', emailAddress);

    STATE.contact.emailAddress = emailAddress;
    STATE.contactHistory.emailAddress = emailAddress;

    STATE.isChangeEmailAddress = false;
  }



  @handle(EDIT_CONTACT_ACTIONS.CANCEL_FIRST_NAME_CHANGE)
  handleCancelFirstNameChange() {

    logger.debug('handleCancelFirstNameChange');

    STATE.contact.firstName = STATE.contactHistory.firstName;
    
    STATE.isChangeFirstName = false;
  }

  @handle(EDIT_CONTACT_ACTIONS.CANCEL_SURNAME_CHANGE)
  handleCancelSurnameChange() {

    logger.debug('handleCancelSurnameChange');

    STATE.contact.surname = STATE.contactHistory.surname;

    STATE.isChangeSurname = false;
  }

  @handle(EDIT_CONTACT_ACTIONS.CANCEL_HOME_NUMBER_CHANGE)
  handleCancelHomeNumberChange() {

    logger.debug('handleCancelHomeNumberChange');

    STATE.contact.homeNumber = STATE.contactHistory.homeNumber;

    STATE.isChangeHomeNumber = false;
  }

  @handle(EDIT_CONTACT_ACTIONS.CANCEL_WORK_NUMBER_CHANGE)
  handleCancelWorkNumberChange() {

    logger.debug('handleCancelWorkNumberChange');

    STATE.contact.workNumber = STATE.contactHistory.workNumber;

    STATE.isChangeWorkNumber = false;
  }

  @handle(EDIT_CONTACT_ACTIONS.CANCEL_MOBILE_NUMBER_ONE_CHANGE)
  handleCancelMobileNumberOneChange() {

    logger.debug('handleCancelMobileNumberOneChange');

    STATE.contact.mobileNumberOne = STATE.contactHistory.mobileNumberOne;

    STATE.isChangeMobileNumberOne = false;
  }

  @handle(EDIT_CONTACT_ACTIONS.CANCEL_MOBILE_NUMBER_TWO_CHANGE)
  handleCancelMobileNumberTwoChange() {

    logger.debug('handleCancelMobileNumberTwoChange');

    STATE.contact.mobileNumberTwo = STATE.contactHistory.mobileNumberTwo;

    STATE.isChangeMobileNumberTwo = false;
  }

  @handle(EDIT_CONTACT_ACTIONS.CANCEL_EMAIL_ADDRESS_CHANGE)
  handleCancelEmailAddressChange() {

    logger.debug('handleCancelEmailAddressChange');

    STATE.contact.emailAddress = STATE.contactHistory.emailAddress;

    STATE.isChangeEmailAddress = false;
  }
}
/*
*/
function findNumberByType(numbers, type) {
  
  if(!numbers){
    return;
  }
  
  for (let number of numbers) {
    if (number.type === type && !number.found) {
      number.found = true;
      return number.number;
    }
  }
  return null;
}
/*
*/
function findEmail(emails) {
  
  return emails && emails.length > 0 ? emails[0] : null;
}
