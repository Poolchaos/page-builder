import {inject} from 'aurelia-framework';
import {Dispatcher} from 'aurelia-flux';
import {EventAggregator} from 'aurelia-event-aggregator';
/*
*/
import {ApplicationService} from 'zailab.common';
import {UserSession} from 'zailab.common';
/*
*/
import {CALL_HISTORY_ACTIONS} from './interactionlog.actions';
import {searchParams} from './interactionlog.store';

@inject(ApplicationService, Dispatcher, EventAggregator, UserSession)
export class AgentCallHistoryService {

  constructor(applicationService, dispatcher, eventAggregator, userSession) {
    this.applicationService = applicationService;
    this.dispatcher = dispatcher;
    this.eventAggregator = eventAggregator;
    this.userSession = userSession;
  }

  accountInteractionLog(fromDate, toDate, organisationId, callType, channel, memberName, fromNumber, toNumber, size, page) {

    this.applicationService.accountInteractionLog(fromDate, toDate, organisationId, callType, channel, memberName, fromNumber, toNumber, size, page).then(
      response => {

        for (var i = 0 ; i < response.content.length; i++) {

          var convertedDate = new Date(response.content[i].date);
          var day = convertedDate.getDate();
          var month = convertedDate.getMonth();
          var year = convertedDate.getFullYear();
          var formattedTime = year + '-' + (month + 1) + '-' + day;
          response.content[i].date = formattedTime;
        }

        // Temp fix until query caters for paging
        var formattedResponse = {
          displayCallLogView: response.content,
          page: {totalPages: response.totalPages, number: response.number}
        };

        this.dispatcher.dispatch(CALL_HISTORY_ACTIONS.CALL_HISTORY_RETRIEVED, formattedResponse);

      });
  }

  selectCall(call) {

    this.eventAggregator.publish('show.loader', true);

    let organisationId = this.userSession.organisationId;

    this.applicationService.playCallLogSearch(call.recordingId, organisationId, call.type).then(
      result => {
        this.eventAggregator.publish('show.loader', false);
        this.dispatcher.dispatch(CALL_HISTORY_ACTIONS.SELECT_CALL, call);
        call.recordingURL = result.url;
        this.dispatcher.dispatch(CALL_HISTORY_ACTIONS.URL_RETRIEVED, call);
      },
      error => {
        this.eventAggregator.publish('show.loader', false);
        this.dispatcher.dispatch(CALL_HISTORY_ACTIONS.URL_FAILED);
        this.dispatcher.dispatch(CALL_HISTORY_ACTIONS.SELECT_CALL, call);
      }
    );
  }

	selectCallType(callType) {
  this.dispatcher.dispatch(CALL_HISTORY_ACTIONS.SELECT_CALL_TYPE, callType);
	}

  selectChannelType(channelType) {
  this.dispatcher.dispatch(CALL_HISTORY_ACTIONS.SELECT_CHANNEL_TYPE, channelType);
	}

  changeView(view) {
  this.dispatcher.dispatch('view.change', view);
	}

}
