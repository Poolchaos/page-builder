import {LogManager,inject} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
import {EventAggregator} from 'aurelia-event-aggregator';
import {DialogService} from 'aurelia-dialog';
import {Router} from 'aurelia-router';
/*
 */
import {ConversationHistoryStore} from './conversationhistory.store';
import {ConversationHistoryService} from './conversationhistory.service';
import {CONVERSATION_HISTORY_ACTIONS} from './conversationhistory.actions'
import {WebSocket, ApplicationService, UserSession} from 'zailab.common';
import {HUD_ANIMATOR_EVENTS}  from '../../../hud.animator.events';
import {ConversationHistorySearchDialog} from './conversationhistorysearchdialog';
/*
*/
const logger = LogManager.getLogger('ConversationHistory');
/*
*/
@inject(EventAggregator, ConversationHistoryStore, ConversationHistoryService, DialogService, Router)
export class ConversationHistory {

  pages;
  allItems = [];
  _pagesize = 10;
  viewActivated;

  constructor(eventAggregator, conversationHistoryStore, conversationHistoryService, dialogService, router) {
    
    this.eventAggregator = eventAggregator;
    this.conversationHistoryStore = conversationHistoryStore;
    this.conversationHistoryService = conversationHistoryService;
    this.dialogService = dialogService;
    this.router = router;
  }

  activate() {
    
    this.viewActivated = true;
    this.conversationHistoryService.retrieveConversations({
      fromDate: '',
      toDate: '',
      channel: '',
      conversationName: '',
      contactName: ''
    });
  }


  initPages() {

    this.currentPage = 0;
    this.pages = [];

    if (!this.conversationHistoryStore.conversationHistory) {
      this.pages.push([]);
      return;
    }

    this.allItems = this.conversationHistoryStore.conversationHistory;
    let pageItems = null;

    for (let itemIndex = 0; itemIndex < this.conversationHistoryStore.conversationHistory.length; itemIndex++) {

      if (itemIndex % this._pagesize === 0) {

        if (pageItems !== null) {
          this.pages.push(pageItems);
        }
        pageItems = [];
      }

      pageItems.push(this.conversationHistoryStore.conversationHistory[itemIndex]);
    }

    if (pageItems !== null && pageItems.length > 0) {
      this.pages.push(pageItems);
    }
  }

  get showSearch(){
    
    let searchCriteria = this.conversationHistoryStore.searchCriteria;

    if(!searchCriteria.channel && !searchCriteria.contactName && !searchCriteria.conversationName && !searchCriteria.fromDate && !searchCriteria.toDate){
      return this.allItems.length > 10 ? true : false;
    } else{
      return true;
    }
    
  }

  get pagedItems() {

    if (!this.pages) {
      return;
    }

    return this.pages[this.currentPage];
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

  toggleSearch() {

    if (this.displaySearch) {

      this.searchText = null;
      this.displaySearch = false;
      this.search();
    } else {

      this.displaySearch = true;
      this.tryFocus();
    }
  }

  search() {
    logger.debug('search');
    this.dialogService.open({
      viewModel: ConversationHistorySearchDialog,
      model: this
    }).then(response => {
      if (!response.wasCancelled) {

      } else {
        this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.CLOSE_POPUP);
      }
    });

    this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.OPEN_POPUP);
  }

  selectConversation(conversationId){

    this.viewActivated = false;
    this.router.parent.parent.navigate(`conversation/view/${conversationId}/call`);  
  }

  @handle(CONVERSATION_HISTORY_ACTIONS.RETRIEVE_CONVERSATION_HISTORY)
  @waitFor(ConversationHistoryStore)
  handleConversationHistoryRetrieved() {
    
    this.initPages();
  }

}
