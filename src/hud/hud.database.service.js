/*
 */
import {inject, LogManager} from 'aurelia-framework';
/*
 */
import {DatabaseService} from '../_common/services/database.service';
/*
 */
const logger: Logger = LogManager.getLogger('HudDatabaseService');
/*
 */
@inject(DatabaseService)
export class HudDatabaseService {
    constructor(databaseService) {
      this.databaseService = databaseService;
    }

    onStatusChanged(userid, callback) {
      let nameSpace = 'query-service-passport.displayCurrentStatusView';
      let keyField = 'userId';
      let keyValue = userid;
      this.databaseService.subscribeOplog(nameSpace, 'insert', keyField, keyValue, callback);
      this.databaseService.subscribeOplog(nameSpace, 'update', keyField, keyValue, callback);
    }

    onPageClose(userid) {
      let nameSpace = 'query-service-passport.displayCurrentStatusView';
      let keyField = 'userId';
      let keyValue = userid;
      this.databaseService.unSubscribeOplog(nameSpace, 'insert', keyField, keyValue);
      this.databaseService.unSubscribeOplog(nameSpace, 'update', keyField, keyValue);
    }
}
