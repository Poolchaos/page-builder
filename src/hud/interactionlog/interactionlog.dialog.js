import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher, handle} from 'aurelia-flux';
import {DialogController} from 'aurelia-dialog';
import {Router} from 'aurelia-router';
/*
*/
import {CallHistoryStore} from './interactionlog.store';
import {AgentCallHistoryService} from './interactionlog.service';
import {CALL_HISTORY_ACTIONS} from './interactionlog.actions';
/*
*/
import {UserSession} from 'zailab.common';
/*
*/
const logger = LogManager.getLogger('CallHistoryDialog');
/*
*/
@inject(DialogController, Router, Dispatcher, CallHistoryStore, AgentCallHistoryService, UserSession)
export class CallHistoryDialog {

  members = [];
  _pagesize = 6;

  constructor(controller, router, dispatcher, callHistoryStore, agentCallHistoryService, userSession) {
    
    this.controller = controller;
    this.router = router;
    this.controller.settings.lock = false;
    this.callHistoryStore = callHistoryStore;
    this.agentCallHistoryService = agentCallHistoryService;
    this.userSession = userSession;
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

  select(){
    return false;
  }

  get settings() {
    return {
      select: {enabled: false}
    };
  }

  performQA(){
    let interactionMembers = this.callHistoryStore.selectedCall.members;
    let interactionId =  this.callHistoryStore.selectedCall.recordingId ? this.callHistoryStore.selectedCall.recordingId : 'noRecording';
    let memberId = interactionMembers && interactionMembers.length > 0 ? interactionMembers[0].memberId : 'noMembers';
    let callType =  this.callHistoryStore.selectedCall.type;
    let channel = this.callHistoryStore.selectedCall.channel;

    //first name and surname are returned as 'fullname' in the view
    let firstName = this.callHistoryStore.selectedCall.members[0].fullName;
    let surname = ' ';

    this.controller.cancel();
    this.dispatcher.dispatch('remove.blur.event');

    this.router.navigate(`hud/dashboard/qualityassessor/assessment/${interactionId}?callType=${callType}&memberId=${memberId}&firstName=${firstName}&surname=${surname}&channel=${channel}`);
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
