/*
*/
import {inject, LogManager} from 'aurelia-framework';
/*
*/
import {DatabaseService} from 'zailab.common';
/*
*/
const logger: Logger = LogManager.getLogger('LiveDashboardDatabaseService');
/*
*/
@inject(DatabaseService)
export class LiveDashboardDatabaseService {

  constructor(databaseService) {
    this.databaseService = databaseService;
  }

  onRealtimeDashboardUpdated(serviceId, callback) {

    subscribe(this.databaseService, 'insert', serviceId, callback);
    subscribe(this.databaseService, 'update', serviceId, callback);
  }

  onPageClose(serviceId) {
    
    unSubscribe(this.databaseService, 'insert', serviceId);
    unSubscribe(this.databaseService, 'update', serviceId);
  }
}
/*
*/
function subscribe(databaseService, operation, serviceId, callback) {

  let nameSpace = 'query-service-dashboard.dashboard.service.displayServiceDashboardView';
  let keyField = '_id';
  let keyValue = serviceId;

  databaseService.subscribeOplog(nameSpace, operation, keyField, keyValue, callback);
};

function unSubscribe(databaseService, operation, serviceId) {

  let nameSpace = 'query-service-dashboard.dashboard.service.displayServiceDashboardView';
  let keyField = '_id';
  let keyValue = serviceId;

  databaseService.unSubscribeOplog(nameSpace, operation, keyField, keyValue);
};


