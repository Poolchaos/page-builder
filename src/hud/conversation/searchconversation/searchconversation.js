/*
 */
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {handle, waitFor} from 'aurelia-flux';
/*
 */
import {CONVERSATION_ACTIONS} from '../conversation.actions';
import {ConversationStore} from '../conversation.store';
import {ConversationService} from '../conversation.service';
/*
 */
import {PeerService} from 'zailab.common';
/*
 */
const logger = LogManager.getLogger('SearchConversation');
/*
 */
@inject(Router, ConversationStore, ConversationService, PeerService)
export class SearchConversation {

  resolve;
  allItems = [];
  _pagesize = 6;
  currentPage;
  pages;
  searchText;

  constructor(router, conversationStore, conversationService, peerService) {

    this.router = router;
    this.conversationStore = conversationStore;
    this.conversationService = conversationService;
//    this.peerService = peerService;
    
    if(peerService.remoteStream) {
      
      this.conversationService.setConversationType('video');
    }
    
    this.conversationService.searchConversations(this.conversationStore.selectedContact.contactId);
  }

  attached() {

    if (!this.conversationStore.selectedContact || !this.conversationStore.selectedContact.telephoneNumbers || !this.conversationStore.selectedContact.telephoneNumbers.length === 0) {
      this.router.navigate('contact/search');
      return;
    }

    setTimeout(() => {

      this.setFocus('conversationName');
    }, 500);

  }

  setFocus(field) {

    let firstElement = document.getElementById(field);
    if (firstElement !== null) {
      firstElement.focus();
    } else {

      setTimeout(() => {

        this.setFocus(field);
      }, 100);
    }
  }

  createConversation() {

    this.router.navigate('create');

  }

  selectConversation(conversation) {
    this.conversationService.selectConversation(conversation);

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

  startsWith(item, searchText) {

    let found = false;

    if (item['conversationName'] && item['conversationName'].toLowerCase().startsWith(searchText.toLowerCase())) {

      found = true;
    }

    return found;
  }

  searchContact() {

    this.router.navigate('contact/search');
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

  get totalItems() {
    if(this.allItems) {
      return this.allItems.length;
    }
    else{
      return [];
    }
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

  @handle(CONVERSATION_ACTIONS.SELECT_CONVERSATION)
  @waitFor(ConversationStore)
  handleSelectConversation(event, conversation) {

    setTimeout(() => {
      this.router.navigate(`interaction/link/${conversation.conversationId}`);
    });

  }

  @handle(CONVERSATION_ACTIONS.SEARCH_CONVERSATION)
  @waitFor(ConversationStore)
  handleSearchConversation(event, conversation) {
    
    this.allItems = this.conversationStore.conversations;
    this.initPages();
  }

}
