import {inject, LogManager} from 'aurelia-framework';
import {Dispatcher, handle} from 'aurelia-flux';
import {UserSession, ApplicationService} from 'zailab.common';
import {MailboxService} from './mailbox.service';
import {MailboxStore} from './mailbox.store';
import {HUD_ANIMATOR_EVENTS}  from '../../hud.animator.events';
import {MailboxMessagesPlayback} from './mailbox.messages.playback';
import {DialogService} from 'aurelia-dialog';
import {EventAggregator} from 'aurelia-event-aggregator';
import {MAILBOX_ACTIONS} from './mailbox.actions';
import {NoDataPrompt} from '../../prompts/nodata/no.data.prompt';
const logger = LogManager.getLogger('MailboxMessages');

@inject(DialogService, Dispatcher, UserSession, ApplicationService, MailboxService, MailboxStore, EventAggregator)
export class MailboxMessages {

  searchCriteria = ['from'];
  _allItems = [];
  _allMessages =[];
  _pagesize = 12;
  display = 'from';

  constructor(dialogService, dispatcher, userSession, applicationService, mailboxService, mailboxStore, eventAggregator) {
    this.dialogService = dialogService;
    this.userSession = userSession;
    this.dispatcher = dispatcher;
    this.applicationService = applicationService;
    this.mailboxService = mailboxService;
    this.mailboxStore = mailboxStore;
    this.eventAggregator = eventAggregator;
  }

  openNoData() {
    this.dialogService.open({
      viewModel: NoDataPrompt,
      model: this
    }).then(response => this.eventAggregator.publish('hud.animator.blur.event.focus'));

    this.eventAggregator.publish('hud.animator.blur.event');
  }
  initPages() {
    this.currentPage = 0;
    this.pages = [];

    if (!this._allItems) {
      this.pages.push([]);
      return;
    }
    let pageItems = null;
    for (let itemIndex = 0; itemIndex < this._allItems.length; itemIndex++) {
      if (itemIndex % this._pagesize === 0) {

        if (pageItems !== null) {
          this.pages.push(pageItems);
        }
        pageItems = [];
      }

      pageItems.push(this._allItems[itemIndex]);
    }

    if (pageItems !== null && pageItems.length > 0) {
      this.pages.push(pageItems);
    }
  }

  activate() {
    let recipientId = this.userSession.loggedInUser.recipientId;
    this.mailboxService.retrieveMailboxMessages(recipientId);
  }

  startsWith(item, searchText) {

    let found = false;

    if (item['from'] && item['from'].toLowerCase().startsWith(searchText.toLowerCase())) {

      found = true;
    } else if (item['toNumber'] && item['toNumber'].toLowerCase().startsWith(searchText.toLowerCase())) {

      found = true;
    } else if (item['taskName'] && item['taskName'].toLowerCase().startsWith(searchText.toLowerCase())) {

      found = true;
    }

    return found;
  }

  selectMessage(message) {
    let recipientId = this.userSession.loggedInUser.recipientId;
    this.dialogService.open({
      viewModel: MailboxMessagesPlayback,
      model: message
    }).then(response => {
      if (!response.wasCancelled) {
        this.mailboxService.retrieveMailboxMessages(recipientId);
      } else {
        this.mailboxService.retrieveMailboxMessages(recipientId);
      }

      this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.CLOSE_POPUP);
    })
  ;

    this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.OPEN_POPUP);

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

    this.displaySearch = !this.displaySearch;

    setTimeout(() => {
      this.searchInput.focus();
    });
  }

  compare(item, searchText) {
    return item[this.display].toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
  }

  search() {
    if (!this._allItems || this._allItems.length === 0) {

      return;
    }

    if (!this.searchText || this.searchText.length === 0) {

      this.initPages();
      return;
    }

    let items = [];
    let startList = [];
    this.pages = [];

    for (let item of this._allItems) {

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

  @handle(MAILBOX_ACTIONS.MAILBOX_MESSAGES_RETRIEVED)
  handleMailboxMessagesRetrieved(message, messages) {
    this._allItems = messages;
    this._allMessages = messages.length;
    this.initPages();
  }

}

export class MailboxFilterValueConverter {
    toView(messages: {}[], searchText: string) {
      if (searchText)
      searchText = searchText.toLowerCase();
      if (messages && messages.filter) {
        return messages.filter(item => item.from.toLowerCase().indexOf(searchText) !== -1);
      }
    }
}
