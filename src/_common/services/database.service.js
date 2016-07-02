import {inject, LogManager} from 'aurelia-framework';
import {WebSocket} from './websocket';
import {EventAggregator} from 'aurelia-event-aggregator';

const logger: Logger = LogManager.getLogger('Login');

@inject(WebSocket, EventAggregator)

export class DatabaseService {

  subscribers = {};

  constructor(ws, eventAggregator) {

    this.ws = ws;
    this.eventAggregator = eventAggregator;
    this.registerEvents();
  }

  registerEvents() {

    this.eventAggregator.subscribe('logout', view => this.deregister());

    this.ws.subscribe({
      name: 'OperationLogged',
      callback: message => {

        let id = message.state.id;
        let obj = message.state.o;

        logger.debug('OperationLogged > id = ', id, ', obj = ', obj);

        this.subscribers[id](obj);
      }
    });
  }

  subscribeOplog(nameSpace, operation, keyField, keyValue, callback) {

    let id = this.provisionId(nameSpace, operation, keyField, keyValue);

    this.subscribers[id] = callback;

    this.ws.publish({
      name: 'RegisterOperationLog',
      state: {
        nameSpace: nameSpace,
        operation: operation,
        keyField: keyField,
        keyValue: keyValue
      }
    });

  }

  unSubscribeOplog(nameSpace, operation, keyField, keyValue) {

    //remove the callback from the subscribers array
    let id = this.provisionId(nameSpace, operation, keyField, keyValue);
    delete this.subscribers[id];

    this.ws.publish({
      name: 'DeregisterOperationLog',
      state: {
        nameSpace: nameSpace,
        operation: operation,
        keyField: keyField,
        keyValue: keyValue
      }
    });
  }

  deregister() {
    this.subscribers = {};
    this.ws.publish({
      name: 'DeregisterOperationLog'
    });
  }

  provisionId(nameSpace, operation, keyField, keyValue) {

    let sep = '~';
    return nameSpace + sep + operation + sep + keyField + sep + keyValue;
  }

  onStatusChanged(userId, callback) {

    let nameSpace = 'query-service-passport.displayCurrentStatusView';
    let operation = 'update';
    let keyField = 'userId';
    let keyValue = userId;

    this.subscribeOplog(nameSpace, operation, keyField, keyValue, callback);
  }

  onMailboxMessageIncrement(recipientId, callback) {

    let nameSpace = 'query-service-mailbox.displayUnplayedMessageCountView';
    let operation = 'update';
    let keyField = '_id';
    let keyValue = recipientId;

    this.subscribeOplog(nameSpace, operation, keyField, keyValue, callback);
  }

  onTaskHistoryUpdated(memberId, callback) {

    let nameSpace = 'query-service-log.displayAgentCallLogView';
    let operation = 'update';
    let keyField = 'memberId';
    let keyValue = memberId;

    this.subscribeOplog(nameSpace, operation, keyField, keyValue, callback);
  }

  onTaskHistoryInserted(memberId, callback) {

    let nameSpace = 'query-service-log.displayAgentCallLogView';
    let operation = 'insert';
    let keyField = 'memberId';
    let keyValue = memberId;

    this.subscribeOplog(nameSpace, operation, keyField, keyValue, callback);
  }

  onRealtimeDashboardUpdate(serviceId, callback) {

    let nameSpace = 'query-service-dashboard.dashboard.service.displayServiceDashboardView';
    let operation = 'update';
    let keyField = '_id';
    let keyValue = serviceId;

    this.subscribeOplog(nameSpace, operation, keyField, keyValue, callback);
  }

  onTeamCreated(organisationId, callback) {

    let nameSpace = 'query-service-team.displayTeamsView';
    let operation = 'update';
    let keyField = '_id';
    let keyValue = organisationId;

    this.subscribeOplog(nameSpace, operation, keyField, keyValue, callback);

    nameSpace = 'query-service-team.displayTeamsView';
    operation = 'insert';
    keyField = '_id';
    keyValue = organisationId;

    this.subscribeOplog(nameSpace, operation, keyField, keyValue, callback);
  }

  onTeamMemberAdded(teamId, callback) {

    let nameSpace = 'query-service-team.displayTeamMembersView';
    let operation = 'update';
    let keyField = '_id';
    let keyValue = teamId;

    this.subscribeOplog(nameSpace, operation, keyField, keyValue, callback);
  }

  onUserAccessRoleAdded(personId, callback) {

    let nameSpace = 'query-service-passport.loginView';
    let operation = 'update';
    let keyField = '_id';
    let keyValue = personId;

    this.subscribeOplog(nameSpace, operation, keyField, keyValue, callback);
  }  

  onTeamLeaderAgentUpdated(organisationId, callback) {
    
    let nameSpace = 'query-service-member.displayTeamLeaderAgentsView';
    let operation = 'update';
    let keyField = '_id';
    let keyValue = organisationId;

    this.subscribeOplog(nameSpace, operation, keyField, keyValue, callback);
  }

}

