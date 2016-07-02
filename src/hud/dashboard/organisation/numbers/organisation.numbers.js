import {ORGANISATION_NUMBERS_ACTIONS} from './organisation.numbers.actions';
import {OrganisationNumbersService} from './organisation.numbers.service';
import {OrganisationNumbersStore} from './organisation.numbers.store';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
/*
*/
const logger = LogManager.getLogger('OrganisationNumbers');
/*
*/
@inject(OrganisationNumbersStore, OrganisationNumbersService)
export class OrganisationNumbers {

  settings = {
    add: {enabled: false},
    delete: {enabled: false},
    select: {enabled: false},
    edit: {enabled: true}
  };

  display = 'data';
  successfulQueryCounter = 0;

  options = {
    change: telephoneNumber => this.change(telephoneNumber)
  };

  resolve = null;

  guide = 'This is a list of your telephone numbers in your organisation and how they have been allocated. A number can be allocated to a member or an interaction flow.';

  constructor(organisationNumbersStore, organisationNumbersService) {

    this.organisationNumbersStore = organisationNumbersStore;
    this.organisationNumbersService = organisationNumbersService;
  }

  canActivate() {

    this.organisationNumbersService.retrieveNumbers();

    return new Promise((resolve) => this.resolve = resolve);
  }

  get itemcount() {
    return this.organisationNumbersStore.numbers.length;
  }

  change(telephoneNumber) {
    if (!telephoneNumber.isDisabled) {
      this.organisationNumbersService.openChangeNumberPrompt(telephoneNumber);
    }
  }

  @handle(ORGANISATION_NUMBERS_ACTIONS.RETRIEVE_ORGANISATION_NUMBERS)
  @waitFor(OrganisationNumbersStore)
  handleRetrieveOrganisationNumbers() {

    if (!this.organisationNumbersStore.numbers || this.organisationNumbersStore.numbers.length === 0) {

      this.noDataMessage = 'Please contact ZaiLab to purchase or port numbers.';
    }

    if (this.resolve !== null) {
      this.resolve(true);
      this.resolve = null;
    }
  }

  @handle(ORGANISATION_NUMBERS_ACTIONS.ASSIGN_NUMBER_TO_MEMBER)
  @waitFor(OrganisationNumbersStore)
  handleAssignMemberToNumber(action, model) {

    for (let item of model.items) {

      if (item.isSelected) {

        for (let number of this.organisationNumbersStore.numbers) {

          if (number.telephoneNumberId === item.telephoneNumberId) {

            let telephoneNumberId = number.telephoneNumberId;
            let telephoneNumber = number.telephoneNumber;
            let memberId = item.memberId;
            let userId = item.userId;
            let firstName = item.firstName;
            let surname = item.surname;
            let email = item.email;

            this.organisationNumbersService.assignTelephoneNumberToMember(telephoneNumberId, telephoneNumber, memberId, userId, firstName, surname, email);

            break;
          }
        }
      }
    }
  }

  @handle(ORGANISATION_NUMBERS_ACTIONS.UNASSIGN_NUMBER_FROM_MEMBER)
  @waitFor(OrganisationNumbersStore)
  handleAcceptUnassignNumberFromMember(action, model) {

    let item = {
      telephoneNumberId: model.item.id
    };

    for (let number of this.organisationNumbersStore.numbers) {

      if (number.telephoneNumberId === item.telephoneNumberId) {

        let telephoneNumberId = number.telephoneNumberId;
        let telephoneNumber = number.telephoneNumber;
        let memberId = number.assignee.id;

        this.organisationNumbersService.unassignTelephoneNumberFromMember(telephoneNumberId, telephoneNumber, memberId);
      }
    }
  }
}
