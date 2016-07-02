import {inject} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
import {DialogService} from 'aurelia-dialog';
import {EventAggregator} from 'aurelia-event-aggregator';
/*
*/
import {TaskHistoryStore} from './task.history.store';
import {TaskHistoryDialog} from './task.history.dialog';
import {AgentTaskHistoryService} from './task.history.service';
import {UserSession} from '../../../_common/stores/user.session';
import {AnimatorStore} from '../../hud.animator.store';
import {TASK_HISTORY_ACTIONS} from './task.history.actions';
import {HUD_ANIMATOR_EVENTS}  from '../../hud.animator.events';

@inject(AgentTaskHistoryService, UserSession, TaskHistoryStore, AnimatorStore, DialogService, EventAggregator)
export class TaskHistory {

 pages;
 allItems;
 _pagesize = 10;

  constructor(agentTaskHistoryService, userSession, taskHistoryStore, animatorStore, dialogService, eventAggregator) {
    this.agentTaskHistoryService = agentTaskHistoryService;
    this.taskHistoryStore = taskHistoryStore;
    this.userSession = userSession;
    this.animatorStore = animatorStore;
    this.dialogService = dialogService;
    this.eventAggregator = eventAggregator;
  }

  activate() {
    let memberId;

    for (var role in this.userSession.loggedInUser.userAccessRoles) {

      if (this.userSession.loggedInUser.userAccessRoles[role].memberId) {
        memberId = this.userSession.loggedInUser.userAccessRoles[role].memberId;
      }
    }

    this.agentTaskHistoryService.retieveTaskHistory(memberId);
    this.agentTaskHistoryService.registerNewTasks(memberId);
  }

  refreshTaskLog() {

    let memberId = this.userSession.memberId;

    this.agentTaskHistoryService.retieveTaskHistory(memberId);
    this.agentTaskHistoryService.registerNewTasks(memberId);
  }

  initPages() {

    this.currentPage = 0;
    this.pages = [];

    if (!this.taskHistoryStore.taskHistory) {
      this.pages.push([]);
      return;
    }

    this.allItems = this.taskHistoryStore.taskHistory;
    let pageItems = null;

    for (let itemIndex = 0; itemIndex < this.taskHistoryStore.taskHistory.length; itemIndex++) {

      if (itemIndex % this._pagesize === 0) {

        if (pageItems !== null) {
          this.pages.push(pageItems);
        }
        pageItems = [];
      }

      pageItems.push(this.taskHistoryStore.taskHistory[itemIndex]);
    }

    if (pageItems !== null && pageItems.length > 0) {
      this.pages.push(pageItems);
    }
  }

  viewTask(task) {

    this.agentTaskHistoryService.selectTask(task);
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

  startsWith(item, searchText) {

    let found = false;

    /*
    title1
    title2
    description1
    description2
    */

    if (item['title1'] && item['title1'].toLowerCase().startsWith(searchText.toLowerCase())) {

      found = true;
    } else if (item['title2'] && item['title2'].toLowerCase().startsWith(searchText.toLowerCase())) {

      found = true;
    } else if (item['description1'] && item['description1'].toLowerCase().startsWith(searchText.toLowerCase())) {

      found = true;
    } else if (item['description2'] && item['description2'].toLowerCase().startsWith(searchText.toLowerCase())) {

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

  tryFocus() {

    setTimeout(() => {
      this.searchInput.focus();
    }, 500);
  }

  @handle(TASK_HISTORY_ACTIONS.TASK_HISTORY_RETRIEVED)
  @waitFor(TaskHistoryStore)
  handleTaskHistoryRetrieved(message, taskHistory) {

    this.initPages();
  }

  @handle(TASK_HISTORY_ACTIONS.TASK_HISTORY_UPDATED)
  handleTaskHistoryUpdated(message, taskUpdated) {

    this.initPages();
  }

@handle(TASK_HISTORY_ACTIONS.SELECT_TASK)
@waitFor(TaskHistoryStore)
 handleViewTask(action, message) {
    this.dialogService.open({
      viewModel: TaskHistoryDialog
    }).then(response => {
      if (!response.wasCancelled) {

      } else {
        this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.CLOSE_POPUP);
      }
    });

    this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.OPEN_POPUP);
  }

}
