/*
*/
import {WebSocket, UserSession}  from 'zailab.common';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
/*
*/
import {UPDATE_CONVERSATION_ACTIONS} from './updateconversationstatus.actions';
/*
*/
const logger = LogManager.getLogger('UpdateConversationStatusService');
/*
*/
@inject(Dispatcher, WebSocket, UserSession)
export class UpdateConversationStatusService {

  constructor(dispatcher, webSocket, userSession) {
    
    this.dispatcher = dispatcher;
    this.webSocket = webSocket;
    this.userSession = userSession;
    this.subscribe();
  }
  
  subscribe(){
    
    let conversationStatusReviewedEvent = 'com.zailab.organisation.conversation.api.events.ConversationStatusReviewedEvent';

    this.webSocket.subscribe({name: conversationStatusReviewedEvent, callback: data=> this.conversationStatusReviewedEventHandler(data)});
  }
  
  conversationStatusReviewedEventHandler(){
    
    this.dispatcher.dispatch(UPDATE_CONVERSATION_ACTIONS.UPDATE_CONVERSATION_STATUS);
  }
  
  changeStatus(conversationId, interactionId, status){

    let message = {
      feature: 'conversation',
      name: 'com.zailab.organisation.conversation.api.commands.ReviewConversationStatusCommand',
      state: {
        conversationId: conversationId,
        interactionId: interactionId,
        status: status.toUpperCase()
      }
    };

    this.webSocket.publish(message);
  }
  
}