import {handle} from 'aurelia-flux';
import {ORGANISATION_NUMBERS_ACTIONS} from './organisation.numbers.actions';
import {LogManager} from 'aurelia-framework';
/*
*/
let STATE = {

  numbers: []
};

const logger = LogManager.getLogger('OrganisationNumbersStore');
/*
*/
export class OrganisationNumbersStore {

  get numbers() {

    return STATE.numbers;
  }

  @handle(ORGANISATION_NUMBERS_ACTIONS.RETRIEVE_ORGANISATION_NUMBERS)
  handleNumbersRetrieved(action, numbers) {

    for (var number of numbers) {

      number.data = [number.telephoneNumber];
      let assignee = number.assignee ? (number.assignee.flowName ? number.assignee.flowName : number.assignee.firstName + ' ' + number.assignee.surname) : null;
      let iconClass;

      if (assignee) {

        number.data.push(assignee);

        if (number.assignee.flowName) {

          iconClass = 'o-crud-list__icon--flow';
          number.isDisabled = true;
        } else if (number.assignee.firstName) {

          number.hoverText = 'Unassign';
          iconClass = 'o-crud-list__icon--member';
          number.data.push(number.assignee.email);
        }
      } else {

        if (number.numberType === 'SMS') {

          iconClass = 'o-crud-list__icon--sms';
          number.isDisabled = true;
        } else {
          
          number.hoverText = 'Assign';
          iconClass = 'o-crud-list__icon--assign';
        }
      }

      number.labelClassName = iconClass;
    }

    STATE.numbers = numbers;
  }

  @handle(ORGANISATION_NUMBERS_ACTIONS.ASSIGN_NUMBER_TO_MEMBER)
  handleNumberAssignedToMember(action, model) {

    logger.debug('handleNumberAssignedToMember > model = ', model);

    for (let item of model.items) {

      if (item.isSelected) {

        let length = this.numbers.length;
        for(let i = 0; i < length; i++) {

          let number = this.numbers[i];

          if (number.telephoneNumberId === item.telephoneNumberId) {

            number.status = 'ASSIGNED';
            number.labelClassName = 'o-crud-list__icon--member';
            number.data = number.data.concat([item.firstName + ' ' + item.surname, item.email]);

            number.assignee = item;

            this.numbers.splice(i, 1);
            this.numbers.push(number);
            break;
          }
        }

        break;
      }
    }
  }

  @handle(ORGANISATION_NUMBERS_ACTIONS.UNASSIGN_NUMBER_FROM_MEMBER)
  handleUnassignNumberFromMember(action, model) {

    let item = {
      telephoneNumberId: model.item.id
    };

    let length = this.numbers.length;
    for(let i = 0; i < length; i++) {

      let number = this.numbers[i];

      if (number.telephoneNumberId === item.telephoneNumberId) {

        number.status = 'UNASSIGNED';
        number.labelClassName = 'o-crud-list__icon--assign';
        number.data = [number.telephoneNumber];

        this.numbers.splice(i, 1);
        this.numbers.push(number);
        break;
      }
    }
  }

}
