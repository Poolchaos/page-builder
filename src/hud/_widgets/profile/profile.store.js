/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
import {PROFILE_ACTIONS} from './profile.actions';
/*
*/
import {EventAggregator}from 'aurelia-event-aggregator';
import {ensure, Validation}from 'aurelia-validation';

/*
*/
const logger = LogManager.getLogger('ProfileStore');
/*
*/
let STATE = {
  
  extension: null,
  telephoneNumber: null,
  user: null,
  
  outboundFlowStatuses: []
}
/*
*/
@inject(EventAggregator)
export class ProfileStore {
  
  selectedFiles = [];
  currentOutboundFlowStatus = {
    flowName: 'Private'
  };
  userProfilePicture;
	organisationProfilePicture;
  error;
  editStates = {
    firstName: false,
    devices: false,
    email: false,
    password: false
  };
  userInfo = {};
  username;
  email;
  newPassword;
  confirmPassword;
  previousEmail;
  newEmail;
  firstName;
  surname;
  previousUsername;
  newUsername;
  businessRuleError;
  changingProfilePicture;

  constructor(eventAggregator){
    
    this.eventAggregator = eventAggregator;
    this.eventAggregator.subscribe('update.user.name', payload => this.updateName(payload));

  }

  updateName(payload){
    
    this.firstName = payload.firstName;
    this.surname = payload.surname;
    STATE.user.firstName = this.firstName;
    STATE.user.surname = this.surname;
  }

  get user(){

    return STATE.user;
  }

  get outboundFlowStatuses() {
    
    return STATE.outboundFlowStatuses;
  }

  get extension() {
    
    return STATE.extension;
  }

  get telephoneNumber() {
    
    return STATE.telephoneNumber;
  }

/*  @handle(PROFILE_ACTIONS.USER_INFO_RETRIEVED)
  handleUserInfoRetrieved(message, userInfo) {
    this.userInfo = userInfo;
    this.newUsername = userInfo.username;
    this.newEmail = userInfo.email;
    this.changingProfilePicture = false;
    var placeHolderImage = 'target/_assets/img/profile_pic-holder.png';
    this.userProfilePicture = userInfo.profilePicture ? userInfo.profilePicture : placeHolderImage;
  }  

  @handle(PROFILE_ACTIONS.USER_INFO_FAILED)
  handleUserInfoFailed(message, errorMessage) {
    this.error = errorMessage;
  }*/
  
  @handle(PROFILE_ACTIONS.CHANGING_PROFILE_PICTURE)
  handleChangingProfilePicture(message) {
    this.changingProfilePicture = true;
  }

  @handle(PROFILE_ACTIONS.CHANGE_PROFILE_PICTURE_SUCCESSFUL)
  handleChangeProfilePictureSuccessful(message, imgBase64) {
    this.changingProfilePicture = false;
    this.userProfilePicture = 'data:image/png;base64,' + imgBase64;
  } 
   
  @handle(PROFILE_ACTIONS.SET_ERROR)
  handleSetError(message, errorMessage) {
    this.error = errorMessage;
  }    

@handle(PROFILE_ACTIONS.PASSWORD_CHECK) // Interim solution.
  handlePasswordCheck(message) {
    this.businessRuleError = 'Please ensure that your information is entered correctly.';
  }  

@handle(PROFILE_ACTIONS.CLEAR_PASSWORD)
  handleClearPassword(message) {
    this.userInfo.oldPassword = '';
    this.oldPassword = '';
  }

  @handle(PROFILE_ACTIONS.OUTBOUND_CALL_OPTIONS_RETRIEVED)
  handleOutboundCallOptionsRetrieved(message, outboundCallOptions) {

    STATE.outboundFlowStatuses = outboundCallOptions;
//    this.outboundFlowStatuses = outboundCallOptions;
  }

  @handle(PROFILE_ACTIONS.SELECTED_OUTBOUND_CALL_OPTION_RETRIEVED)
  handleSelectedOutboundCallOptionRetrieved(message, selectedOutboundCallOption) {
    this.currentOutboundFlowStatus = selectedOutboundCallOption;
  }

  @handle(PROFILE_ACTIONS.OUTBOUND_PRIVATE_CALL_OPTION_SELECTED)
  handleOutboundPrivateCallOptionSelected() {
    this.currentOutboundFlowStatus.flowName = 'Private';
  }
  
  @handle(PROFILE_ACTIONS.OUTBOUND_CALL_OPTION_SELECTED)
  handleOutboundCallOptionSelected(message, selectedFlow) {
    
    for(var flow of this.outboundFlowStatuses) {
      
      flow.selected = false;
      if(flow.flowId === selectedFlow.flowId){
        
        flow.selected = true;
      }
    }
    
    this.currentOutboundFlowStatus = selectedFlow;
  }

  @handle(PROFILE_ACTIONS.CHANGE_EDIT_STATE_SELECTED)
  handleChangeEditStateSelected(message, payload) {
    this.businessRuleError = '';
    this.editStates = {
      firstName: false,
      devices: false,
      email: false,
      password: false
    };
    this.editStates[payload.prop] = payload.state;
  }

  @handle(PROFILE_ACTIONS.CHANGE_PASSWORD_SUCCESSFUL)
  handleChangePasswordSuccessful(message, response) {
    this.businessRuleError = '';
    this.editStates.password = false;
    this.userInfo.oldPassword = '';
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }

  @handle(PROFILE_ACTIONS.CHANGE_USERNAME_SUCCESSFUL)
  handleChangeUsernameSuccessful(message, response) {
    this.userInfo.username = response.newUsername;
    this.editStates.username = false;
    this.userInfo.oldPassword = '';
    this.oldPassword = '';
    this.businessRuleError = '';
  }

  @handle(PROFILE_ACTIONS.CHANGE_EMAIL_SUCCESSFUL)
  handleChangeEmailSuccessful(message, response) {
    this.userInfo.email = response.newEmail;
    this.userInfo.oldPassword = '';
    this.oldPassword = '';
    this.editStates.email = false;
    this.businessRuleError = '';
  }  

  @handle(PROFILE_ACTIONS.CHANGE_USER_INFO_SUCCESSFUL)
  handleChangeUserInfoSuccessful(message, response) {
    this.userInfo.firstName = response.firstName;
    this.userInfo.surname = response.surname;
    this.userInfo.oldPassword = '';
    this.oldPassword = '';
    this.editStates.firstName = false;
    this.editStates.surname = false;
  }

  @handle(PROFILE_ACTIONS.RETRIEVE_ORGANISATION_PROFILE_PICTURE_SUCCESSFUL)
  handleOrganisationProfilePicture(message, orgInfo) {
		var placeHolderImage = 'target/_assets/img/groupProfile_pic-holder.png';
		this.organisationProfilePicture = orgInfo.organisationProfilePicture ? 'data:image/png;base64,' + orgInfo.organisationProfilePicture : placeHolderImage;
  }

  @handle(PROFILE_ACTIONS.RETRIEVE_MEMBER_COMMS)
  handleRetrieveMemberComms(action, memberComms) {
    
    STATE.extension = memberComms.extension;
    STATE.telephoneNumber = memberComms.telephoneNumber;
  }  

  @handle(PROFILE_ACTIONS.RETRIEVE_PERSONAL_INFO)
  handleRetrievePersonalInfo(action, personalInfo) {
    STATE.user = personalInfo;
  }

  // TODO CLEANUP
  @handle('logout')
  handleLogout() {
    this.userInfo = null;
    this.userProfilePicture = null;
  }

}