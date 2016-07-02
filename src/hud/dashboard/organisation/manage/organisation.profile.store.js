/*
*/
import {ORGANISATION_PROFILE_ACTIONS} from './organisation.profile.actions';
/*
*/
import {handle} from 'aurelia-flux';
import {LogManager} from 'aurelia-framework';
/*
*/
const logger = LogManager.getLogger('OrganisationProfileStore');
/*
*/
let STATE = {

  profilePicture: null,
  organisationInfo: null,
  outboundFlows: null,
  selectedOutboundFlow: null
};

export class OrganisationProfileStore {

  get profilePicture() {

    return STATE.profilePicture;
  }

  get organisationInfo() {

    return STATE.organisationInfo;
  }

  @handle(ORGANISATION_PROFILE_ACTIONS.RETRIEVE_ORGANISATION_INFO)
  handleRetrievePersonalInfo(action, info) {

    STATE.organisationInfo = info;
  }

  @handle(ORGANISATION_PROFILE_ACTIONS.CHANGE_NAME)
  handleChangeName(action, model) {
    STATE.organisationInfo.organisationName = model.item.name;
  }

  @handle(ORGANISATION_PROFILE_ACTIONS.CHANGE_PICTURE)
  handleChangePicture(action, model) {
    STATE.profilePicture = model;
  }
}
/*
*/
function getSelectedItem(items) {

  for (let item of items) {
    if (item.selected) {

      return item;
    }
  }
}
