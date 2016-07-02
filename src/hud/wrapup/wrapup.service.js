import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
import {WRAP_UP_ACTIONS} from './wrapup.actions';
import {ApplicationService} from '../../_common/services/application.service';
import {UserSession} from '../../_common/stores/user.session';
import {WebSocket} from '../../_common/services/websocket';

const logger = LogManager.getLogger('WrapUpService');

@inject(Dispatcher, ApplicationService, UserSession, WebSocket)
export class WrapUpService {
  
  constructor(dispatcher, applicationService, userSession, webSocket) {
    
    this.dispatcher = dispatcher;
    this.applicationService = applicationService;
    this.userSession = userSession;
    this.webSocket = webSocket;
  }
  
  activateWrapUp() {
    
    this.dispatcher.dispatch(WRAP_UP_ACTIONS.ACTIVATE_WRAP_UP);
  }
  
  completeWrapUp() {
    
    var userId = this.userSession.user.userId;
    
//    this.applicationService.changeToPreviousStatus(userId);
    let message = {
      feature: 'passport',
      name: 'com.zailab.user.user.api.commands.ChangeToPreviousStatusCommand',
      state: {
        userId: userId
      }
    };
    this.webSocket.publish(message);
    
    
    this.dispatcher.dispatch(WRAP_UP_ACTIONS.COMPLETE_WRAP_UP);
  }
}