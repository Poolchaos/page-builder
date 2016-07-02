import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher, handle} from 'aurelia-flux';
import {DialogController} from 'aurelia-dialog';
/*
*/
import {TaskHistoryStore} from './task.history.store';
import {AgentTaskHistoryService} from './task.history.service';
import {TASK_HISTORY_ACTIONS} from './task.history.actions';
/*
*/
const logger = LogManager.getLogger('TaskHistoryDialog');
/*
*/
@inject(DialogController, Dispatcher, TaskHistoryStore, AgentTaskHistoryService)
export class TaskHistoryDialog {

  members = [];
  _pagesize = 6;

  constructor(controller, dispatcher, taskHistoryStore, agentTaskHistoryService) {
    
    this.controller = controller;
    this.controller.settings.lock = false;
    this.taskHistoryStore = taskHistoryStore;
    this.agentTaskHistoryService = agentTaskHistoryService;
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

/*	selectLog(call) {
    this.agentCallHistoryService.selectLog(call);
  }*/

  select(){
    return false;
  }

  get display() {

    return 'fullName';
  }

  get settings() {

    return {
      select: {enabled: false}
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
