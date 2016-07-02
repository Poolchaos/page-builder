/*
*/
import {ORGANISATION_ACTIONS} from './organisation.actions';
import {UserSession} from '../../../_common/stores/user.session';
import {OrganisationWidgetStore} from '../../_widgets/organisation/organisation.store';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
/*
*/
const logger = LogManager.getLogger('OrganisationStore');
/*
*/
let STATE = {

  name: null,
  organisationInfo: {},
  userInfo: null,
  numbers: []
};
/*
*/
@inject(UserSession)
export class OrganisationStore {

  constructor(userSession) {

    this.userSession = userSession;
  }

  get organisation() {
    return STATE.organisationInfo;
  }

  set organisation(organisation) {
    STATE.organisationInfo = organisation;
  }

  get isReady() {
    return STATE.organisation ? true : false;
  }

  get name() {
    return STATE.organisation.name;
  }

  get services() {
    return STATE.organisation.services;
  }

  get sites() {
    return STATE.organisation.sites;
  }

  get userInfo() {
    return STATE.userInfo;
  }

  get numbers() {
    return STATE.numbers;
  }

  @handle(ORGANISATION_ACTIONS.COMPLETE_SETUP)
  handleCompleteSetup(action, organisation) {

    logger.debug('handleCompleteSetup');
    STATE.organisation = organisation;
  }

  @handle(ORGANISATION_ACTIONS.USER_INFO_RETRIEVED)
  handleUserInfoRetrieved(action, userInfo) {
    STATE.userInfo = userInfo;
  }

  @handle(ORGANISATION_ACTIONS.ADD_NUMBER)
  handleAddNumber(actions, number) {
    STATE.numbers.push(number);
  }

  @handle(ORGANISATION_ACTIONS.RETRIEVE_ORGANISATION_INFO)
  @waitFor(OrganisationWidgetStore)
  handleRetrieveOrganisationInfo(action, organisation) {

    STATE.organisation = organisation;
    this.userSession.accountActivated = organisation.activated;
  }

}
