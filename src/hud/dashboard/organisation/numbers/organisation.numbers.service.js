/**/
import {Dispatcher} from 'aurelia-flux';
import {inject, LogManager} from 'aurelia-framework';
/**/
import {ORGANISATION_NUMBERS_ACTIONS} from './organisation.numbers.actions';
/**/
import {ApplicationService, UserSession} from 'zailab.common';

const logger = LogManager.getLogger('OrganisationNumbersService');
/*
*/
import {PromptFactory, PromptService} from 'zailab.framework';

@inject(Dispatcher, ApplicationService, UserSession, PromptFactory, PromptService)
export class OrganisationNumbersService {

  constructor(dispatcher, applicationService, userSession, promptFactory, promptService) {

    this.dispatcher = dispatcher;
    this.applicationService = applicationService;
    this.userSession = userSession;
    this.promptFactory = promptFactory;
    this.promptService = promptService;
  }

  retrieveNumbers() {

    let organisationId = this.userSession.organisationId;
    let numbers = [];

    this.applicationService.organisationTelephoneNumbersSearch(organisationId)
      .then((response) => {

        if (response.displayOrganisationTelephoneNumbersView) {

          numbers = response.displayOrganisationTelephoneNumbersView[0].telephoneNumbers;
        }
        this.dispatcher.dispatch(ORGANISATION_NUMBERS_ACTIONS.RETRIEVE_ORGANISATION_NUMBERS, numbers);
      }, (error) => {

        this.dispatcher.dispatch(ORGANISATION_NUMBERS_ACTIONS.RETRIEVE_ORGANISATION_NUMBERS, numbers);
      }
    );
  }

  retrievePromptMember(callback) {

    let organisationId = this.userSession.organisationId;
    this.applicationService.organisationTelephoneNumbersMembersSearch(organisationId)
        .then((response) => callback(response, null), (error) => callback(null, error));
  }

  openChangeNumberPrompt(telephoneNumber) {
    if (telephoneNumber.status === 'ASSIGNED') {

      let title = 'Are you sure you want to unassign this number?';
      let acceptAction = ORGANISATION_NUMBERS_ACTIONS.UNASSIGN_NUMBER_FROM_MEMBER;

      let option = this.promptFactory.buildFormPrompt(title, {id: telephoneNumber.telephoneNumberId}, acceptAction);
      option.promptModel.icon = 'numbers';

      this.promptService.openPrompt(option);
    } else {

      this.retrievePromptMember((response, error) => {

        if (error) {
          logger.error('retrievePromptMember > error = ', error);
          return;
        }

        let members = response.displayMemberView;
        for (let member of members) {

          member.id = member.memberId;
          member.telephoneNumberId = telephoneNumber.telephoneNumberId;

          if (member.telephoneNumber) {
            member.clickable = false;
          } else {
            member.isSelected = true;
          }
            
          
          
          member.text = [member.firstName + ' ' + member.surname, member.email];
          //temp taken out profile picture until styling is fixed
          member.pictureId = member.personId;
          member.defaultPicture = 'target/_assets/img/profile_pic-holder.png';
        }

        let title = 'Please assign number to member';
        let acceptAction = ORGANISATION_NUMBERS_ACTIONS.ASSIGN_NUMBER_TO_MEMBER;
        let option = this.promptFactory.buildSingleSelectOnlyPrompt(title, members, acceptAction);
        option.promptModel.icon = 'members';
        option.promptModel.display = 'text';

        this.promptService.openPrompt(option);
      });
    }
  }

  assignTelephoneNumberToMember(telephoneNumberId, telephoneNumber, memberId, userId, firstName, surname, email) {

    let organisationId = this.userSession.organisationId;

    this.applicationService.assignTelephoneNumberToMember(telephoneNumberId, telephoneNumber, memberId, userId, firstName, surname, email, organisationId);
  }

  unassignTelephoneNumberFromMember(telephoneNumberId, telephoneNumber, memberId) {

    let organisationId = this.userSession.organisationId;

    this.applicationService.unassignTelephoneNumberFromMember(telephoneNumberId, telephoneNumber, memberId, organisationId);
  }
}
