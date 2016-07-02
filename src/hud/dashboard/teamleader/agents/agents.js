/*
*/
import {Router} from 'aurelia-router';
import {inject, LogManager} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {EventAggregator} from 'aurelia-event-aggregator';
import {handle, waitFor} from 'aurelia-flux';
/*
*/
import {AgentsStore} from './agents.store';
import {AgentsService} from './agents.service';
import {AGENTS_ACTIONS} from './agents.actions';
/*
*/
import {NoDataPrompt} from '../../../prompts/nodata/no.data.prompt';
import {MessagePrompt} from '../../_prompts/message/message.prompt';
import {PromptFactory, PromptService} from 'zailab.framework';
/*
*/
const logger = LogManager.getLogger('Agents');

@inject(Router, DialogService, EventAggregator, AgentsStore, AgentsService, PromptFactory, PromptService)
export class Agents {

  searchCriteria = ['firstName', 'surname'];
  allItems = [];
  _pagesize = 12;
  display = 'text';

  constructor(router, dialogService, eventAggregator, agentsStore, agentsService, promptFactory, promptService) {

    this.router = router;
    this.dialogService = dialogService;
    this.eventAggregator = eventAggregator;
    this.agentsStore = agentsStore;
    this.agentsService = agentsService;
    this.promptFactory = promptFactory;
    this.promptService = promptService;
  }

  activate() {

    this.agentsService.retrieveAgents();
  }

  navTo(route) {

    this.router.navigate(route);
  }

  interactionLogs(){
    
    this.router.parent.parent.navigate('interactionlog');
  }

  openComingSoon(iconName, title) {
    let noDataMessagePrompt = this.promptFactory.buildMessagePrompt(title, AGENTS_ACTIONS.DISPLAY_NO_MESSAGE);
    noDataMessagePrompt.promptModel.icon = iconName;
    this.promptService.openPrompt(noDataMessagePrompt);
  }

  toggleSearch() {

    this.displaySearch = !this.displaySearch;

    this.tryFocus();
  }

  startsWith(item, searchText) {

    let found = false;

    if (item['firstName'] && item['firstName'].toLowerCase().startsWith(searchText.toLowerCase())) {

      found = true;
    } else if (item['surname'] && item['surname'].toLowerCase().startsWith(searchText.toLowerCase())) {

      found = true;
    }

    return found;
  }

  search() {

    if (!this.allItems || this.allItems.length === 0) {

      return;
    }

    if (!this.searchText || this.searchText.length === 0) {

      this.initPages();
      return;
    }

    let items = [];
    let startList = [];
    this.pages = [];

    for (let item of this.allItems) {

      if (this.startsWith(item, this.searchText)) {

        startList.push(item);
        item.added = true;
      } else {

        item.added = false;
      }
    }

    this.items = startList;

    let pageItems = null;

    for (let itemIndex = 0; itemIndex < this.items.length; itemIndex++) {

      if (itemIndex % this._pagesize === 0) {

        if (pageItems !== null) {
          this.pages.push(pageItems);
        }
        pageItems = [];
      }

      pageItems.push(this.items[itemIndex]);
    }

    if (pageItems !== null && pageItems.length > 0) {
      this.pages.push(pageItems);
    }

  }

  spy(callId) {

    this.agentsService.spyCall(callId);
  }

  whisper(callId) {

    this.agentsService.whisperCall(callId);
  }

  @handle(AGENTS_ACTIONS.RETRIEVE_AGENTS_SUCCESS)
  @waitFor(AgentsStore)
  handleRetrieveAgentsSuccess(action, response) {

    for(let agent of response.agents) {
      
      if(agent.status === 'ON_CALL') {
        agent.status = 'busy';
      }
    }
    
    this._items = response.agents;
    this.allItems = response.agents;
    this.initPages();
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

  tryFocus() {

    setTimeout(() => {
      this.searchInput.focus();
    }, 500);
  }
}
