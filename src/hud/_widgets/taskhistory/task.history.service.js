import {LogManager,inject} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
import {EventAggregator} from 'aurelia-event-aggregator';
/*
*/
import {ApplicationService} from '../../../_common/services/application.service';
import {TASK_HISTORY_ACTIONS} from './task.history.actions';
import {DatabaseService} from '../../../_common/services/database.service';
import {UserSession} from '../../../_common/stores/user.session';

const logger = LogManager.getLogger('AgentTaskHistoryService');

@inject(ApplicationService, Dispatcher, DatabaseService, UserSession, EventAggregator)
export class AgentTaskHistoryService {

  constructor(applicationService, dispatcher, databaseService, userSession, eventAggregator) {
    this.applicationService = applicationService;
    this.dispatcher = dispatcher;
    this.databaseService = databaseService;
    this.userSession = userSession;
    this.eventAggregator = eventAggregator;

  }

  retieveTaskHistory(memberId) {

    this.applicationService.displayAccountInteractionLogAgentCallLog(memberId).then(
      response => {
        if (response.displayAgentCallLogView && response.displayAgentCallLogView.length > 0) {

          for (var i = 0 ; i < response.displayAgentCallLogView.length; i++) {

            var convertedDate = new Date(response.displayAgentCallLogView[i].date);
            var day = convertedDate.getDate();
            var month = convertedDate.getMonth();
            var year = convertedDate.getFullYear();
            var formattedTime = year + '-' + (month + 1) + '-' + day;
            response.displayAgentCallLogView[i].date = formattedTime;
          }

          this.dispatcher.dispatch(TASK_HISTORY_ACTIONS.TASK_HISTORY_RETRIEVED, response.displayAgentCallLogView);
        } else {
          this.dispatcher.dispatch(TASK_HISTORY_ACTIONS.TASK_HISTORY_FAILED, []);
        }
      }
    );
  }

  registerNewTasks(memberId) {

    this.databaseService.onTaskHistoryUpdated(memberId, data => {

      this.dispatcher.dispatch(TASK_HISTORY_ACTIONS.TASK_HISTORY_UPDATED, data);
    });

    this.databaseService.onTaskHistoryInserted(memberId, data => {

      this.dispatcher.dispatch(TASK_HISTORY_ACTIONS.TASK_HISTORY_UPDATED, data);
    });
  }

  selectTask(task) {

    this.eventAggregator.publish('show.loader', true);

    let organisationId = this.userSession.organisationId;
    
    this.applicationService.playCallLogSearch(task.recordingId, organisationId, task.type).then(
    result => {
      this.eventAggregator.publish('show.loader', false);
      this.dispatcher.dispatch(TASK_HISTORY_ACTIONS.SELECT_TASK, task);
      task.recordingURL = result.url;
      this.dispatcher.dispatch(TASK_HISTORY_ACTIONS.URL_RETRIEVED, task);
    },
    error => {
      this.eventAggregator.publish('show.loader', false);
      this.dispatcher.dispatch(TASK_HISTORY_ACTIONS.URL_FAILED);
      this.dispatcher.dispatch(TASK_HISTORY_ACTIONS.SELECT_TASK, task);
    }
  );
  }

  }
