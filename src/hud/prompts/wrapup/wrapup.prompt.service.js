import {inject, LogManager} from 'aurelia-framework';
import {handle, Dispatcher} from 'aurelia-flux';
import {ApplicationService} from '../../../_common/services/application.service';
import {WRAP_UP_ACTIONS} from './wrapup.prompt.actions';
import {HUD_ACTIONS} from '../../hud.actions';
import {UserSession} from '../../../_common/stores/user.session';
import {WebSocket} from '../../../_common/services/websocket';
import {DatabaseService} from '../../../_common/services/database.service';

const logger = LogManager.getLogger('WrapUpPromptService');

@inject(Dispatcher, ApplicationService, UserSession, WebSocket, DatabaseService)
export class WrapUpPromptService {
  
  constructor(dispatcher, applicationService, userSession, webSocket, databaseService) {
    this.dispatcher = dispatcher;
    this.applicationService = applicationService;
    this.userSession = userSession;
    this.webSocket = webSocket;
    this.databaseService = databaseService;
    
    this.registerEvents();
  }

  registerEvents() {
    
    this.applicationService.onStatusChanged(event => {
      
      logger.debug('onStatusChanged >>> event = ', event);
      this.dispatcher.dispatch(WRAP_UP_ACTIONS.STATUS_CHANGE_SUCCESSFUL);
    }); 
  }
  
  updateTime(time){
    this.dispatcher.dispatch(WRAP_UP_ACTIONS.UPDATE_TIME, time)
  }
  
  changeStatus(status){

    var userId = this.userSession.user.userId;

    let message = {
      feature: 'passport',
      name: 'com.zailab.user.user.api.commands.SystemChangeStatusCommand',
      state: {
        userId: userId,
        status: status,
        isFinalCallStatusChange: true,
      }
    };
    this.webSocket.publish(message);
    
  }
  
  @handle(HUD_ACTIONS.AGENT_STATUS_CHANGED)
  handleAgentStatusChanged() {

    this.dispatcher.dispatch(WRAP_UP_ACTIONS.STATUS_CHANGE_SUCCESSFUL);
  };
  
  @handle(HUD_ACTIONS.AGENT_STATUS_LOGGED)
  handleAgentStatusLogged() {

    this.dispatcher.dispatch(WRAP_UP_ACTIONS.STATUS_CHANGE_SUCCESSFUL);
  };
  
}