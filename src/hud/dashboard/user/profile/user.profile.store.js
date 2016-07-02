/*
*/
import {USER_PROFILE_ACTIONS} from './user.profile.actions';
/*
*/
import {handle} from 'aurelia-flux';
import {LogManager} from 'aurelia-framework';
/*
*/
const logger = LogManager.getLogger('UserProfileStore');
/*
*/
let STATE = {

  profilePicture: null,
  userInfo: null,
  outboundFlows: null,
  selectedOutboundFlow: null,
  comms: null,
  devices: null
};

export class UserProfileStore {

  get profilePicture() {

    return STATE.profilePicture;
  }

  get userInfo() {

    return STATE.userInfo;
  }  
  
  get comms() {

    return STATE.comms;
  }  
  
  get devices() {

    return STATE.devices;
  }

  get outboundFlows() {

    for(let flow of STATE.outboundFlows){
      
      flow.isSelected = flow.selected ? true : false;
      flow.labelClassName = 'o-crud-list__icon o-crud-list__icon--channel-outgoing';
      flow.name = flow.flowName;
    }

    return STATE.outboundFlows;
  }

  get selectedOutboundFlow() {

    return STATE.selectedOutboundFlow;
  }

  @handle(USER_PROFILE_ACTIONS.RETRIEVE_PERSONAL_INFO)
  handleRetrievePersonalInfo(action, info) {

    STATE.userInfo = info;
  }

  @handle(USER_PROFILE_ACTIONS.RETRIEVE_OUTBOUND_CALL_OPTIONS)
  handleRetrieveOutboundCallOptionsInfo(action, options) {

    let selectedItem = getSelectedItem(options);

    STATE.selectedOutboundFlow = selectedItem;
    STATE.outboundFlows = options;
  }  

  @handle(USER_PROFILE_ACTIONS.RETRIEVE_MEMBER_COMMS)
  handleRetrieveComms(action, info) {

    STATE.comms = { telephoneNumber: info.telephoneNumber, extension: info.extension };
  }

  @handle(USER_PROFILE_ACTIONS.RETRIEVE_MEMBER_DEVICES)
  handleRetrieveMemberDevices(action, model) {
    STATE.devices = model.devices;
  }

  @handle(USER_PROFILE_ACTIONS.CHANGE_NAME)
  handleChangeName(action, model) {
    STATE.userInfo.firstName = model.item.firstName;
    STATE.userInfo.surname = model.item.surname;
  }    
   
  @handle(USER_PROFILE_ACTIONS.CHANGE_PASSWORD)
  handleChangePassword(action, model) {

  }  

  @handle(USER_PROFILE_ACTIONS.CHANGE_OUTBOUND_FLOW)
  handleChangeOutboundFlow(action, model) {

    STATE.selectedOutboundFlow = getIsSelectedItem(model.items);
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
/*
*/
function getIsSelectedItem(items) {

  for (let item of items) {

    if (item.isSelected) {

      return item;
    }
  }
}
