/*
*/
import {LogManager, inject} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
/*
 */
import {CONVERSATION_HISTORY_ACTIONS} from './conversationhistory.actions';
/*
*/
import {ApplicationService, UserSession} from 'zailab.common';
/*
*/
const logger = LogManager.getLogger('ConversationHistoryService');
/*
*/
@inject(ApplicationService, Dispatcher, UserSession)
export class ConversationHistoryService {

  constructor(applicationService, dispatcher, userSession) {
    
    this.applicationService = applicationService;
    this.dispatcher = dispatcher;
    this.userSession = userSession;
  }
  
  retrieveConversations(searchCriteria) {

    let memberId = this.userSession.memberId;
    let oneDay = 86399000;
    
    let fromDate = getTimestamp(searchCriteria.fromDate);
    let toDate = getTimestamp(searchCriteria.toDate);

    if(toDate){
      toDate += oneDay;
    }
    
    this.applicationService.conversationHistoryViewSearch(memberId, searchCriteria.channel, fromDate, toDate, searchCriteria.conversationName, searchCriteria.contactName).then(
      response => {

        this.dispatcher.dispatch(CONVERSATION_HISTORY_ACTIONS.RETRIEVE_CONVERSATION_HISTORY, {response: response, searchCriteria: searchCriteria});
      },
      err => {
        
        logger.warn('conversationHistoryViewSearch > err > ', err);
        this.dispatcher.dispatch(CONVERSATION_HISTORY_ACTIONS.RETRIEVE_CONVERSATION_HISTORY, {response: null, searchCriteria: searchCriteria});
      });
  }
}
/*
*/
function getTimestamp(date) {
  if (date) {
      return new Date(date).getTime();
  } else {
      return '';
    }
  }
