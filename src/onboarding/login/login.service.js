/*
*/
import {inject} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
import {EventAggregator} from 'aurelia-event-aggregator';
/*
*/
import {LOGIN_ACTIONS} from './login.actions';
/*
*/
import {EncryptTools, WINDOW_EVENTS} from 'zailab.common';
/*
*/
import {ApplicationService} from '../../_common/services/application.service';
import {UserSession} from '../../_common/stores/user.session';
import {WebSocket} from '../../_common/services/websocket';
/*
*/
import uuid from 'node-uuid';
/*
*/
@inject(ApplicationService, UserSession, Dispatcher, WebSocket, EventAggregator)
export class LoginService {

  capslockOnPasswordDetection;
  capslockOffPasswordDetection;

  constructor(applicationService, userSession, dispatcher, webSocket, eventAggregator) {

    this.applicationService = applicationService;
    this.userSession = userSession;
    this.dispatcher = dispatcher;
    this.webSocket = webSocket;
    this.eventAggregator = eventAggregator;
  }

  enableCapslockOnPasswordDetection() {

    this.capslockOnPasswordDetection = this.eventAggregator.subscribe(WINDOW_EVENTS.ON_CAPSLOCK_DETECTED, (data) => { // TODO this gets called for every key event - not safe

        this.dispatcher.dispatch(LOGIN_ACTIONS.CAPS_LOCK_ERROR, data.settings.message);
    });

    this.capslockOffPasswordDetection = this.eventAggregator.subscribe(WINDOW_EVENTS.OFF_CAPSLOCK_DETECTED, (data) => { // TODO this gets called for every key event - not safe
      
        this.dispatcher.dispatch(LOGIN_ACTIONS.CLEAR_ERROR);
    });
  }

  disableCapslockOnPasswordDetection() {

    this.capslockOnPasswordDetection.dispose();
    this.capslockOffPasswordDetection.dispose();
  }

  submitLogin(identity, password) {
    var encryptedPassword = EncryptTools.encrypt(password);

    this.applicationService.authenticateUserLogin(identity, encryptedPassword)
      .then(
        res => {
  
          this.userSession.loggedInUser = res;
          this.dispatcher.dispatch(LOGIN_ACTIONS.LOGIN_PASSED, res);

          let passportId = res.passportId;
          this.applicationService.reportLoginSucceeded(passportId);
          
          return true;
        },
        err => {
          this.dispatcher.dispatch(LOGIN_ACTIONS.LOGIN_FAILED);
          let passportId = uuid.v4();
          this.applicationService.reportLoginFailed('Login failed', passportId);
          return 'Something is not correct with what you have entered.';
        });
  }
  
  retrieveOrganisationChannels(organisationId){

    this.applicationService.displayOrganisationChannels(organisationId).then(
      response=>{

        this.userSession.user.hasSMSChannel = false;
        
        if(response && response.displayChannelsView){
          
          for(let channel of response.displayChannelsView){
            if(channel.channelName === 'SMS'){
              this.userSession.user.hasSMSChannel = true;
            }
          }
        }
        
      });
  }
  
  retrieveOrganisationInfo(organisationId) {
    this.applicationService.retrieveOrganisationInfoSearch(organisationId).then(
    response => {
      if (response.displayOrganisationView) {
        let organisationInfo = response.displayOrganisationView[0];
        this.userSession.user.organisationUpgraded = organisationInfo.activated;
      }
    },
    error=> {}
    );
  }

  changeSystemAgentStatus(status) {

    var userId = this.userSession.user.userId;

    let message = {
      feature: 'passport',
      name: 'com.zailab.user.user.api.commands.SystemChangeStatusCommand',
      state: {
        userId: userId,
        status: status
      }
    };
    this.webSocket.publish(message);
  }

  setError(error) {
    this.dispatcher.dispatch(LOGIN_ACTIONS.SET_ERROR, error);
  }
}
