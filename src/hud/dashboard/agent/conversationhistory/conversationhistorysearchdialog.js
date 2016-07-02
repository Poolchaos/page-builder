import {LogManager, inject} from 'aurelia-framework';
import {Dispatcher, handle} from 'aurelia-flux';
import {DialogController} from 'aurelia-dialog';
import {UserSession} from 'zailab.common';
/*
*/
import {ConversationHistoryStore} from './conversationhistory.store';
import {ConversationHistoryService} from './conversationhistory.service';
/*
*/
const logger = LogManager.getLogger('ConversationHistorySearchDialog');
/*
*/
@inject(DialogController, Dispatcher, UserSession, ConversationHistoryStore, ConversationHistoryService)
export class ConversationHistorySearchDialog {

  searchCriteria;
  
  constructor(controller, dispatcher, userSession, conversationHistoryStore, conversationHistoryService) {
    
    this.controller = controller;
    this.controller.settings.lock = false;
    this.dispatcher = dispatcher;
    this.userSession = userSession;
    this.dispatcher.dispatch('blur.event');
    this.conversationHistoryStore = conversationHistoryStore;
    this.conversationHistoryService = conversationHistoryService;
  }

  activate(conversationHistoryViewModel) {

    this.controller.settings.lock = false;
    this.dispatcher.dispatch('blur.event');

  }

  activate(){
    
    this.searchCriteria = {
      fromDate: this.conversationHistoryStore.searchCriteria.fromDate,
      toDate: this.conversationHistoryStore.searchCriteria.toDate,
      channel: this.conversationHistoryStore.searchCriteria.channel,
      conversationName: this.conversationHistoryStore.searchCriteria.conversationName,
      contactName: this.conversationHistoryStore.searchCriteria.contactName
    };
    
    setSelectedChannel(this.searchCriteria.channel);
    
  }
  
  close() {
    
    this.controller.cancel();
    this.dispatcher.dispatch('remove.blur.event');
  }

  search() {

    this.conversationHistoryService.retrieveConversations(this.searchCriteria);
    this.close();
  }

  selectChannel(channel) {
    
    this.searchCriteria.channel = channel;
  }
  
}
/*
*/
function setSelectedChannel(channel) {

  let id = '';

  switch(channel) {
    case '':
      id = 'all';
      break;
    case 'Inbound Call':
      id = 'flow';
      break;
    case 'Outbound Call':
      id = 'outbound_flow';
      break;
    case 'Kiosk Call':
      id = 'kiosk';
      break;
    case 'Website Call':
      id = 'website';
      break;
  }

  getElement(id);
}

function getElement(id) {

  var firstElement = document.getElementById(id);
  if (firstElement !== null) {

    firstElement.checked = 'checked';
    } else {

      setTimeout(() => {

        getElement(id);
      }, 100);
    }
}