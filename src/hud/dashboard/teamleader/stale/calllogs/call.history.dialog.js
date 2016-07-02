import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher, handle} from 'aurelia-flux';
import {DialogController} from 'aurelia-dialog';
/*
*/
import {CallHistoryStore} from './call.history.store';
import {AgentCallHistoryService} from './call.history.service';
import {CALL_HISTORY_ACTIONS} from './call.history.actions';
/*
*/
const logger = LogManager.getLogger('CallHistoryDialog');
/*
*/
@inject(DialogController, Dispatcher, CallHistoryStore, AgentCallHistoryService)
export class CallHistoryDialog {

  members = [];
  _pagesize = 6;

  constructor(controller, dispatcher, callHistoryStore, agentCallHistoryService) {

    this.controller = controller;
    this.controller.settings.lock = false;
    this.callHistoryStore = callHistoryStore;
    this.agentCallHistoryService = agentCallHistoryService;
    this.dispatcher = dispatcher;
    this.dispatcher.dispatch('blur.event');
  }

  activate() {

    this.controller.settings.lock = false;
    this.dispatcher.dispatch('blur.event');
    
    performBlackestOfTheBlackestOfMagique(this.controller);
  }

  close() {
    this.controller.cancel();
    this.dispatcher.dispatch('remove.blur.event');
  }

	selectLog(call) {
    this.agentCallHistoryService.selectLog(call);
  }

  get display() {

    return 'fullName';
  }

select() {
  return false;
}

  get settings() {

    return {
      select: {enabled: false},
      edit: {enabled: false}
    };
  }

}
/*
*/
function performBlackestOfTheBlackestOfMagique(controller) {
    
  // 4 secnonds 30 fps
  
  for (let i = 0; i < 4 * 30; i++) {
    
    setTimeout(() => {
      
      controller.centerDialog();
    }, (1000 / 30) * (i + 1));  
  }
}
