import {inject, LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
import {CONVERSATION_HISTORY_ACTIONS} from './conversationhistory.actions';
import {UserSession, DateTimeTools} from 'zailab.common';
/*
 */

const logger = LogManager.getLogger('ConversationHistoryStore');
/*
 */

let STATE = {

  conversationHistory: [],
  searchCriteria: {
    fromDate: '',
    toDate: '',
    fromTime: '',
    toTime: '',
    channel: '',
    conversationName: '',
    contactName: ''
  }
};

@inject(UserSession, DateTimeTools)
export class ConversationHistoryStore {

  constructor(userSession, dateTimeTools) {

    this.userSession = userSession;
    this.dateTimeTools = dateTimeTools;
  }

  get searchCriteria() {

    return STATE.searchCriteria;
  }

  get conversationHistory() {

    return STATE.conversationHistory;
  }

  @handle(CONVERSATION_HISTORY_ACTIONS.RETRIEVE_CONVERSATION_HISTORY)
  handleConversationHistoryRetrieved(message, data) {

    STATE.searchCriteria = data.searchCriteria;

    logger.debug('handleConversationHistoryRetrieved', (data.searchCriteria.toDate - data.searchCriteria.fromDate));



    if (!data.response) {

      return;
    }

    let conversations = data.response;

    for (let conversation of conversations) {
      if (conversation.lastInteractionDetail && conversation.lastInteractionDetail.timestamp) {
        conversation.dateTime = this.dateTimeTools.convertToLocalTime(conversation.lastInteractionDetail.timestamp, 'UTC');
        conversation.formattedDateTime = conversation.dateTime.date + ' @ ' + conversation.dateTime.time;
      }
      else {
        conversation.dateTime = '';
      }
      conversation.status = conversation.status ? conversation.status.charAt(0).toUpperCase() + conversation.status.slice(1) : conversation.status;

      let channel = conversation.lastInteractionDetail && conversation.lastInteractionDetail.channel ? conversation.lastInteractionDetail.channel : '';

      switch (channel) {

        case 'Outbound Call':
          conversation.number = conversation.lastInteractionDetail.to ? conversation.lastInteractionDetail.to : '';
          conversation.icon = 'outbound';
          break;

        case 'Inbound Call':
          conversation.number = conversation.lastInteractionDetail.from ? conversation.lastInteractionDetail.from : '';
          conversation.icon = 'inbound';
          break;

        case 'Internal Call':
          conversation.number = conversation.lastInteractionDetail.to ? conversation.lastInteractionDetail.to : '';
          conversation.icon = 'internal';
          break;

        case 'Flow Call':
          conversation.number = conversation.lastInteractionDetail.from ? conversation.lastInteractionDetail.from : '';
          conversation.icon = 'flow';
          break;

        case 'Outbound Flow Call':
          conversation.number = conversation.lastInteractionDetail.to ? conversation.lastInteractionDetail.to : '';
          conversation.icon = 'outbound-flow';
          break;

        case 'Inbound Flow Call':
          conversation.number = conversation.lastInteractionDetail.from ? conversation.lastInteractionDetail.from : '';
          conversation.icon = 'inbound-flow';
          break;

        case 'Kiosk Call':
          conversation.number = conversation.lastInteractionDetail.from ? conversation.lastInteractionDetail.from : '';
          conversation.icon = 'kiosk';
          break;

        case 'Website Call':
          conversation.number = conversation.lastInteractionDetail.to ? conversation.lastInteractionDetail.to : '';
          conversation.icon = 'website';
          break;

        case 'SMS':
          conversation.number = conversation.lastInteractionDetail.to ? conversation.lastInteractionDetail.to : '';
          conversation.icon = 'sms-icon';
          break;

     }

    }

    STATE.conversationHistory = conversations;
  }

}
