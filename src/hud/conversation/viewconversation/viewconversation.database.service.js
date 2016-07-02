/*
*/
import {inject, LogManager} from 'aurelia-framework';
/*
*/
import {DatabaseService} from 'zailab.common';
/*
*/
const logger = LogManager.getLogger('ViewConversationDatabaseService');
/*
*/
@inject(DatabaseService)
export class ViewConversationDatabaseService {

  constructor(databaseService) {
    
    this.databaseService = databaseService;
  }

  onConversationJourneyUpdated(conversationId, callback) {

    subscribeConversationJourneyView(this.databaseService, 'insert', conversationId, callback);
    subscribeConversationJourneyView(this.databaseService, 'update', conversationId, callback);
  }

  onContactJourneyUpdated(interactionId, callback) {

    subscribeContactJourneyView(this.databaseService, 'insert', interactionId, callback);
    subscribeContactJourneyView(this.databaseService, 'update', interactionId, callback);
  }
}
/*
*/
function subscribeConversationJourneyView(databaseService, operation, conversationId, callback) {

  let nameSpace = 'query-service-conversation.conversationJourneyView';
  let keyField = '_id';
  let keyValue = conversationId;

  databaseService.subscribeOplog(nameSpace, operation, keyField, keyValue, callback);
};

function subscribeContactJourneyView(databaseService, operation, interactionId, callback) {

  let nameSpace = 'query-service-conversation.contactJourneyView';
  let keyField = '_id';
  let keyValue = interactionId;

  databaseService.subscribeOplog(nameSpace, operation, keyField, keyValue, callback);
};
