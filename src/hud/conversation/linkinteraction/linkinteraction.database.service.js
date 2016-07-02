/*
*/
import {inject, LogManager} from 'aurelia-framework';
/*
*/
import {DatabaseService} from 'zailab.common';
/*
*/
const logger = LogManager.getLogger('LinkInteractionDatabaseService');
/*
*/
@inject(DatabaseService)
export class LinkInteractionDatabaseService {

  constructor(databaseService) {
    
    this.databaseService = databaseService;
  }

  onInteractionUpdated(memberId, callback) {

    subscribeInteractionListView(this.databaseService, 'insert', memberId, callback);
    subscribeInteractionListView(this.databaseService, 'update', memberId, callback);
  }

}
/*
*/
function subscribeInteractionListView(databaseService, operation, memberId, callback) {

  let nameSpace = 'query-service-conversation.interactionListView';
  let keyField = 'memberIds';
  let keyValue = memberId;

  databaseService.subscribeOplog(nameSpace, operation, keyField, keyValue, callback);
};
