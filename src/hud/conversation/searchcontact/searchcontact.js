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
const logger = LogManager.getLogger('SearchContact');
/*
*/
@inject(Router, ConversationStore, ConversationService)
export class SearchContact {

  allItems = [];
  _pagesize = 8;
  currentPage;
  pages;
  hasSearched;

  constructor(router, conversationStore, conversationService) {

    this.router = router;
    this.conversationStore = conversationStore;
    this.conversationService = conversationService;

  }

  activate() {

    this.hasSearched = this.conversationStore.hasSearched;
    
    this.conversationService.showConversation();
    
    if (this.conversationStore.contacts) {
      this.allItems = this.conversationStore.contacts;
      this.initPages();
    }
  }

  attached() {

    setTimeout(() => {

      this.setFocus('firstName');
    
      if(this.conversationStore.searchContact.contactNumber) {

        this.search();
      }
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

  search() {

    this.hasSearched = true;

    let firstName = this.conversationStore.searchContact.firstName ? this.conversationStore.searchContact.firstName : '';
    let surname = this.conversationStore.searchContact.surname ? this.conversationStore.searchContact.surname  : '';
    let email = this.conversationStore.searchContact.email ? this.conversationStore.searchContact.email : '';
    let number = this.conversationStore.searchContact.contactNumber ? this.conversationStore.searchContact.contactNumber  : '';

    this.conversationService.searchContact(firstName, surname, email, number);
  }

  createContact() {

    this.router.navigate('contact/create');
  }

  selectContact(contact) {
    
    this.conversationService.selectContact(contact);
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

  get showSearch() {

    let firstName = this.conversationStore.searchContact.firstName;
    let surname = this.conversationStore.searchContact.surname;
    let contactNumber = this.conversationStore.searchContact.contactNumber;
    let email = this.conversationStore.searchContact.email;

    if (!firstName && !surname && !contactNumber && !email) {
      return false;
    }else {
      return true;
    }

  }

  get totalItems() {

    return this.allItems.length;
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

  @handle(CONVERSATION_ACTIONS.SEARCH_CONTACT)
  @waitFor(ConversationStore)
  handleSearchContact(event, contacts) {

    this.allItems = this.conversationStore.contacts;
    this.initPages();
  }

  @handle(CONVERSATION_ACTIONS.SELECT_CONTACT)
  @waitFor(ConversationStore)
  handleSelectContact(event, contact) {
    
    setTimeout(() => {
      this.router.navigate('search');
    });
  }

}
