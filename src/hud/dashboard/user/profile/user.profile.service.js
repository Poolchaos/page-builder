/*
*/
import {USER_PROFILE_ACTIONS} from './user.profile.actions';
/*
*/
import {HttpClient} from 'aurelia-http-client';
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
/*
*/
import {ApplicationService, UrlFactory, UserSession, WebSocket} from 'zailab.common';
/*
*/
const logger = LogManager.getLogger('UserProfileService');
/*
*/
@inject(Dispatcher, ApplicationService, HttpClient, UrlFactory, UserSession, WebSocket)
export class UserProfileService {

  constructor(dispatcher, applicationService, httpClient, urlFactory, userSession, webSocket) {

    this.dispatcher = dispatcher;
    this.applicationService = applicationService;
    this.httpClient = httpClient;
    this.urlFactory = urlFactory;
    this.userSession = userSession;
    this.webSocket = webSocket;
  }

  retrievePersonalInfo() {

    let personId = this.userSession.user.personId;

    this.applicationService.userInfoSearch(personId).then(response => {

      if (response.displayPersonInformationView && response.displayPersonInformationView[0]) {

        let personalInfo = response.displayPersonInformationView[0];
        this.dispatcher.dispatch(USER_PROFILE_ACTIONS.RETRIEVE_PERSONAL_INFO, personalInfo);
      }
    });
  }

  retrieveMemberInformation() {

    let memberId = this.userSession.memberId;
    let uri = this.urlFactory.build(`member/displayMemberProfileView/${memberId}`);

    this.httpClient.get(uri).then(
      (response) => {
        if (response.outboundFlowOptions) {

          let noneSelected = true;

          for (let flow of response.outboundFlowOptions) {
            if (flow.selected) {
              noneSelected = false;
            }
          }

          response.outboundFlowOptions.push({
            flowName: 'None',
            flowId: null,
            selected: noneSelected
          });

          this.dispatcher.dispatch(USER_PROFILE_ACTIONS.RETRIEVE_OUTBOUND_CALL_OPTIONS, response.outboundFlowOptions);
        }else{
          
          let outboundFlowOptions = [{
            flowName: 'None', 
            flowId: null,
            selected: true
          }];
          this.dispatcher.dispatch(USER_PROFILE_ACTIONS.RETRIEVE_OUTBOUND_CALL_OPTIONS, outboundFlowOptions);
        }

        this.dispatcher.dispatch(USER_PROFILE_ACTIONS.RETRIEVE_MEMBER_COMMS, {extension: response.extension, telephoneNumber: response.telephoneNumber});
        this.dispatcher.dispatch(USER_PROFILE_ACTIONS.RETRIEVE_MEMBER_DEVICES, {devices: response.devices});
      }
    );
  }

  updateProfilePicture(base64) {

    let personId = this.userSession.user.personId;
    this.httpClient.put(this.urlFactory.build('media/images/' + personId), base64);
  }

  changePassword(oldPassword, newPassword) {

    var passportId = this.userSession.user.passportId;

    this.applicationService.changePassword(oldPassword, newPassword, passportId);

  }

  changeUserInfo(firstName, surname) {

    let personId = this.userSession.user.personId;

    let message = {
      feature: 'person',
      name: 'com.zailab.user.person.api.commands.ChangeProfileInformationCommand',
      state: {
        firstName: firstName,
        surname: surname,
        personId: personId,
        gender: '',
        dateOfBirth: '',
        telephoneNumbers: ''
      }
    };

    this.webSocket.publish(message);

  }

    selectOutboundCallOption(flowId) {

      let memberId = this.userSession.memberId;
      this.applicationService.selectOutboundFlowOptionForMember(memberId, flowId);
    }

  }
