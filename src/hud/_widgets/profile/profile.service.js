import {HttpClient} from 'aurelia-http-client';
import {ImageService} from 'zailab.common';
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
import {PROFILE_ACTIONS} from './profile.actions';
import {UserSession} from '../../../_common/stores/user.session';
import {ApplicationService} from '../../../_common/services/application.service';
import {UrlFactory} from '../../../_common/factories/url.factory';
/*
*/
const logger = LogManager.getLogger('ProfileService');

@inject(HttpClient, ApplicationService, UserSession, Dispatcher, UrlFactory)
export class ProfileService {

  constructor(httpClient, applicationService, userSession, dispatcher, urlFactory) {

    this.httpClient = httpClient;
    this.applicationService = applicationService;
    this.userSession = userSession;
    this.dispatcher = dispatcher;
    this.urlFactory = urlFactory;
    this.registerEvents();
  }

  registerEvents() {

    //    this.applicationService.onOutboundPrivateCallOptionSelected(() => this.dispatcher.dispatch(PROFILE_ACTIONS.OUTBOUND_PRIVATE_CALL_OPTION_SELECTED));

    this.applicationService.onOutboundFlowOptionSelectedForMember(response => this.dispatcher.dispatch(PROFILE_ACTIONS.OUTBOUND_CALL_OPTION_SELECTED, response.state));

    this.applicationService.onPasswordChanged(event => this.dispatcher.dispatch(PROFILE_ACTIONS.CHANGE_PASSWORD_SUCCESSFUL, event.state));

    this.applicationService.onEmailChanged(event => this.dispatcher.dispatch(PROFILE_ACTIONS.CHANGE_EMAIL_SUCCESSFUL, event.state));

    this.applicationService.onUsernameChanged(event => this.dispatcher.dispatch(PROFILE_ACTIONS.CHANGE_USERNAME_SUCCESSFUL, event.state));

    this.applicationService.onUserInformationChanged(event => this.dispatcher.dispatch(PROFILE_ACTIONS.CHANGE_USER_INFO_SUCCESSFUL, event.state));

    this.applicationService.onProfilePictureChanged(event => this.dispatcher.dispatch(PROFILE_ACTIONS.CHANGE_PROFILE_PICTURE_SUCCESSFUL, event.state.profilePicture));
  }

/*  retrieveUserInfo(userId) {

    this.applicationService.displayUserPassportUserInformation(userId).then(
      response => {
        logger.debug('displayUserPassportUserInformation > response: ', response);

        if (response.displayUserInformationView) {
          let userInfo = response.displayUserInformationView[0];
          this.retrieveProfilePicture(userInfo);
        }
      },
      error => {
        this.dispatcher.dispatch(PROFILE_ACTIONS.USER_INFO_ERROR, error);
      }
    );
  }

  retrieveProfilePicture(userInfo) {

    let uri = this.urlFactory.build(`media/images/${userInfo.personId}`);

    this.httpClient.get(uri).then(
      response=> {
        userInfo.profilePicture = 'data:image/png;base64,' + response;;
        this.dispatcher.dispatch(PROFILE_ACTIONS.USER_INFO_RETRIEVED, userInfo);
      },error=> {
        userInfo.profilePicture = null;
        this.dispatcher.dispatch(PROFILE_ACTIONS.USER_INFO_RETRIEVED, userInfo);
      });

  }*/

  retrieveOutboundCallOptions() {

    let memberId = this.userSession.memberId;
    let uri = this.urlFactory.build(`member/displayMemberProfileView/${memberId}`);

    this.httpClient.get(uri).then(
      (response) => {
        if (response.outboundFlowOptions) {

          let noneSelected = true;
          
          for (let flow of response.outboundFlowOptions) {
            if(flow.selected){
              noneSelected = false;
            }
          }
          
          response.outboundFlowOptions.push({
            flowName: 'None',
            flowId: null,
            selected: noneSelected
          });


          this.dispatcher.dispatch(PROFILE_ACTIONS.OUTBOUND_CALL_OPTIONS_RETRIEVED, response.outboundFlowOptions);
        }

        this.dispatcher.dispatch(PROFILE_ACTIONS.RETRIEVE_MEMBER_COMMS, {extension: response.extension, telephoneNumber: response.telephoneNumber});
      },
      (error) => {

        this.dispatcher.dispatch(PROFILE_ACTIONS.OUTBOUND_CALL_OPTIONS_FAILED,    error);
      }
    );
  }

  retrieveSelectedOutboundCallOption() {
    let agentId = this.userSession.agent;
    this.applicationService.displayOrganisationAgentSelectedOutboundCallOption(agentId)
      .then(
        response => {
          if (response.displaySelectedOutboundCallOptionView && response.displaySelectedOutboundCallOptionView[0])
          this.dispatcher.dispatch(PROFILE_ACTIONS.SELECTED_OUTBOUND_CALL_OPTION_RETRIEVED, response.displaySelectedOutboundCallOptionView[0]);
        },
        error    => this.dispatcher.dispatch(PROFILE_ACTIONS.SELECTED_OUTBOUND_CALL_OPTION_FAILED,    error));
  }

	retrieveOrganisationInfo(organisationId) {
  this.applicationService.retrieveOrganisationInfoSearch(organisationId).then(
      (response) => {

        let ownerIdCheck = this.userSession.loggedInUser.userAccessRoles[0].ownerId;
        let ownerId = ownerIdCheck ? ownerIdCheck : this.userSession.loggedInUser.userAccessRoles[1].ownerId;

        this.dispatcher.dispatch(PROFILE_ACTIONS.RETRIEVE_ORGANISATION_PROFILE_PICTURE_SUCCESSFUL, response.displayOrganisationView[0]);
      },
      (error) => this.dispatcher.dispatch(PROFILE_ACTIONS.RETRIEVE_ORGANISATION_PROFILE_PICTURE_FAIL, error)
    );
	}	
  
  retrievePersonalInfo() {
    
    let personId = this.userSession.user.personId;
    
    this.applicationService.userInfoSearch(personId).then(response => {

      if(response.displayPersonInformationView && response.displayPersonInformationView[0]){
        
        let personalInfo = response.displayPersonInformationView[0];
        this.dispatcher.dispatch(PROFILE_ACTIONS.RETRIEVE_PERSONAL_INFO, personalInfo);
      }
    });
	}

  selectOutboundCallOption(flowId) {

    let memberId = this.userSession.memberId;
    this.applicationService.selectOutboundFlowOptionForMember(memberId, flowId);
  }

  changeEditState(prop, state) {
    var payload = {
      prop: prop,
      state: state
    };
    this.dispatcher.dispatch(PROFILE_ACTIONS.CHANGE_EDIT_STATE_SELECTED, payload);

    if (state === false) {
      var userId = this.userSession.user.userId;
      this.retrieveUserInfo(userId);
    }
  }

  clearPasswordInput() {
    this.dispatcher.dispatch(PROFILE_ACTIONS.CLEAR_PASSWORD);
  }

  setError(error) {
    this.dispatcher.dispatch(PROFILE_ACTIONS.SET_ERROR, error);
  }

  changeUserInfo(firstName, surname, userId, gender, dateOfBirth, telephoneNumbers) {
    this.applicationService.changeUserInformation(firstName, surname, userId, gender, dateOfBirth, telephoneNumbers);
  }

  changeUsername(previousUsername, newUsername, password) {
    this.dispatcher.dispatch(PROFILE_ACTIONS.PASSWORD_CHECK); // Interim solution
    var passportId = this.userSession.user.passportId;
    this.applicationService.changeUsername(previousUsername, newUsername, passportId, password);
  }

  changeEmail(previousEmail, newEmail) {
    this.dispatcher.dispatch(PROFILE_ACTIONS.PASSWORD_CHECK); // Interim solution
    var passportId = this.userSession.user.passportId;
    this.applicationService.changeEmail(previousEmail, newEmail, passportId);
  }

  changePassword(previousPassword, newPassword) {
    this.dispatcher.dispatch(PROFILE_ACTIONS.PASSWORD_CHECK); // Interim solution
    var passportId = this.userSession.user.passportId;
    this.applicationService.changePassword(previousPassword, newPassword, passportId);
  }

  selectProfilePicture() {
    this.dispatcher.dispatch(PROFILE_ACTIONS.CHANGING_PROFILE_PICTURE);
  }

  changeProfilePicture(imgBase64) {

    var userId = this.userSession.user.userId;

    this.httpClient.put(this.urlFactory.build('media/images/' + userId), atob(imgBase64));

    //this.applicationService.changeProfilePicture(userId, imgBase64);
  }

}
