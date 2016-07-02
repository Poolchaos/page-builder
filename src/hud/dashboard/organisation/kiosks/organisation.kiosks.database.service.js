/*
*/
import {inject, LogManager} from 'aurelia-framework';
/*
*/
import {DatabaseService} from 'zailab.common';
/*
*/
const logger: Logger = LogManager.getLogger('OrganisationKiosksDatabaseService');
/*
*/
@inject(DatabaseService)
export class OrganisationKiosksDatabaseService {

  constructor(databaseService) {
    this.databaseService = databaseService;
  }

  onKiosksUpdated(organisationId, callback) {

    subscribe(this.databaseService, 'insert', organisationId, callback);
    subscribe(this.databaseService, 'update', organisationId, callback);
    subscribe(this.databaseService, 'delete', organisationId, callback);
  }

  onPageClose(organisationId) {
    
    unSubscribe(this.databaseService, 'insert', organisationId);
    unSubscribe(this.databaseService, 'update', organisationId);
    unSubscribe(this.databaseService, 'delete', organisationId);
  }
}
/*
*/
function subscribe(databaseService, operation, organisationId, callback) {

  let nameSpace = 'query-service-kiosk.displayKiosksView';
  let keyField = '_id';
  let keyValue = organisationId;

  databaseService.subscribeOplog(nameSpace, operation, keyField, keyValue, callback);
};

function unSubscribe(databaseService, operation, organisationId) {

  let nameSpace = 'query-service-kiosk.displayKiosksView';
  let keyField = '_id';
  let keyValue = organisationId;

  databaseService.unSubscribeOplog(nameSpace, operation, keyField, keyValue);
};


