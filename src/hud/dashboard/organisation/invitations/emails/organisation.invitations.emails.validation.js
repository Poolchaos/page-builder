/*
*/
import {LogManager} from 'aurelia-framework';
import {ValidationRule} from 'aurelia-validation';
/*
*/
const logger = LogManager.getLogger('UniqueEmailValidationRule');
/*
*/
export class UniqueEmailValidationRule extends ValidationRule {

  constructor(emails) {

    super(emails, onEmailValidation, message);
  }
}
/*
*/
function onEmailValidation(emailAddress, emails) {
  
  // Invitation Emails
  for (let email of emails.invitationEmails) {
    if (email.address.toLowerCase() === emailAddress.toLowerCase()) {
      return false;
    }
  }  
  
  // Pending Invitations
  for (let pendingInvitation of emails.pendingInvitations) {
    if (pendingInvitation.email.toLowerCase() === emailAddress.toLowerCase()) {
      return false;
    }
  }  
  
  // Organisation Members
  for (let organisationMember of emails.organisationMembers) {
    if (organisationMember.email.toLowerCase() === emailAddress.toLowerCase()) {
      return false;
    }
  }
  
  return true;
}
/*
*/
function message() {

  return 'This email has already been added.';
}
