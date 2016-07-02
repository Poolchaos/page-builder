/*
zailab
*/
import {UserSession} from 'zailab.framework';
import {CallHistoryDialog} from './interactionlog.dialog';
import {CallHistorySearchDialog} from './interactionlog.search.dialog';
import {CallHistoryStore} from './interactionlog.store';
import {AgentCallHistoryService} from './interactionlog.service';
import {HUD_ANIMATOR_EVENTS}  from '../hud.animator.events';
import {searchParams} from './interactionlog.store';
import {CALL_HISTORY_ACTIONS} from './interactionlog.actions';
/*
aurelia
*/
import {DialogService} from 'aurelia-dialog';
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
import {EventAggregator} from 'aurelia-event-aggregator';
/*
*/
const logger = LogManager.getLogger('CallHistory');
/*
Call History
*/
@inject(AgentCallHistoryService, DialogService, UserSession, CallHistoryStore, EventAggregator)
export class CallHistory {

  allItems = [];
  _pagesize = 12;

  guide = 'This is your organisation\'s interactions.';

  constructor(agentCallHistoryService, dialogService, userSession, callHistoryStore, eventAggregator) {

    this.agentCallHistoryService = agentCallHistoryService;
    this.dialogService = dialogService;
    this.callHistoryStore = callHistoryStore;
    this.userSession = userSession;
    this.eventAggregator = eventAggregator;

  }

  activate() {

    let page = 0;
    this.navToPage(page);
  }

  viewCall(call) {
    this.agentCallHistoryService.selectCall(call);
  }

  search_open() {
    this.dialogService.open({
      viewModel: CallHistorySearchDialog,
      model: this
    }).then(response => {
      if (!response.wasCancelled) {

      } else {
        this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.CLOSE_POPUP);
      }
    });

    this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.OPEN_POPUP);
  }

  refreshCallLog() {
    let page = this.callHistoryStore.currentPage;
    this.navToPage(page);
  }

  navToPage(page) {

    let organisationId = this.userSession.organisationId;

    var fromDate = this.callHistoryStore.searchParams.fromDate;
    var toDate = this.callHistoryStore.searchParams.toDate;
    var callType = this.callHistoryStore.searchParams.callType;
    var channel = this.callHistoryStore.searchParams.channelType;
    var memberName = this.callHistoryStore.searchParams.memberName;
    var fromNumber = this.callHistoryStore.searchParams.fromNumber;
    var toNumber = this.callHistoryStore.searchParams.toNumber;
    //var page = this.callHistoryStore.searchParams.page;
    var size = this.callHistoryStore.searchParams.size;
    this.agentCallHistoryService.accountInteractionLog(fromDate, toDate, organisationId, callType, channel, memberName, fromNumber, toNumber, size, page);
  }

  navTo(view) {
    this.agentCallHistoryService.changeView(view);
    this.refreshCallLog();
    let page = 0;
    this.navToPage(page);
  }

  next() {
    this.currentPage++;
  }

  prev() {

    this.currentPage--;
  }

  get showNext() {

    if (this.pages)
      return this.currentPage < this.pages.length - 1;
  }

  get showPrev() {

    return this.currentPage > 0;
  }

  initPages() {

    this.currentPage = 0;
    this.pages = [];

    if (!this.allItems) {
      this.pages.push([]);
      return;
    }

    let pageItems = null;

    for (let itemIndex = 0; itemIndex < this.allItems.length; itemIndex++) {
      if (itemIndex % this._pagesize === 0) {

        if (pageItems !== null) {
          this.pages.push(pageItems);
        }
        pageItems = [];
      }

      pageItems.push(this.allItems[itemIndex]);
    }

    if (pageItems !== null && pageItems.length > 0) {
      this.pages.push(pageItems);
    }
  }

  get pagedItems() {

    if (!this.pages) {
      return;
    }

    return this.pages[this.currentPage];
  }

  @handle(CALL_HISTORY_ACTIONS.CALL_HISTORY_RETRIEVED)
  @waitFor(CallHistoryStore)
  handleCallHistoryRetrieved(message, callHistory) {
    //this._items = callHistory.displayCallLogView;
    this.allItems = this.callHistoryStore.callHistory;//callHistory.displayCallLogView;
    this.initPages();
  }

 @handle(CALL_HISTORY_ACTIONS.SELECT_CALL)
 @waitFor(CallHistoryStore)
 handleViewCall(action, message) {
    this.dialogService.open({
      viewModel: CallHistoryDialog
    }).then(response => {
      if (!response.wasCancelled) {

      } else {
        this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.CLOSE_POPUP);
      }
    });

    this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.OPEN_POPUP);
  }

}
