/*
*/
import {inject, LogManager} from 'aurelia-framework';
/*
*/
import {DatabaseService} from '../../../../_common/services/database.service';
/*
*/
const logger: Logger = LogManager.getLogger('OrganisationInvitationsDatabaseService');
/*
*/
@inject(DatabaseService)
export class OrganisationInvitationsDatabaseService {

  constructor(databaseService) {
    this.databaseService = databaseService;
  }

  onPendingInvitesUpdated(organisationId, callback) {

    subscribe(this.databaseService, 'insert', organisationId, callback);
    subscribe(this.databaseService, 'update', organisationId, callback);
  }

  onPageClose(organisationId) {
    
    unSubscribe(this.databaseService, 'insert', organisationId);
    unSubscribe(this.databaseService, 'update', organisationId);
  }
}
/*
*/
function subscribe(databaseService, operation, organisationId, callback) {

  let nameSpace = 'query-service-registration.pendingInvitationView';
  let keyField = '_id';
  let keyValue = organisationId;

  databaseService.subscribeOplog(nameSpace, operation, keyField, keyValue, callback);
};

function unSubscribe(databaseService, operation, organisationId) {

  let nameSpace = 'query-service-registration.pendingInvitationView';
  let keyField = '_id';
  let keyValue = organisationId;

  databaseService.unSubscribeOplog(nameSpace, operation, keyField, keyValue);
};


