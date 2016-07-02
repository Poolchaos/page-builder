import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
import {Router} from 'aurelia-router';
/*
*/
import {LINK_INTERACTION_ACTIONS}  from './linkinteraction.actions';
import {LinkInteractionService}  from './linkinteraction.service';
import {LinkInteractionStore}  from './linkinteraction.store';
import {ConversationStore} from '../conversation.store';
import {HUD_ACTIONS}  from '../../hud.actions';
/*
*/
const logger = LogManager.getLogger('LinkInteraction');

@inject(Router, LinkInteractionService, LinkInteractionStore, ConversationStore, ConversationStore)
export class LinkInteraction {

  autoLink;
  resolve;
  _allItems = [];
  _pagesize = 8;
  searchText;
  selectedInteractions = [];

  constructor(router, linkInteractionService, linkInteractionStore, conversationStore) {

    this.router = router;
    this.linkInteractionService = linkInteractionService;
    this.linkInteractionStore = linkInteractionStore;
    this.conversationStore = conversationStore;
    this.linkInteractionService.retrieveInteractions();
  }

  canActivate(params){
    
    let disableViewOnly = (params.routedFrom && params.routedFrom === 'viewConversation') ? true : false;
    this.conversationId = params.conversationId;
    this.linkInteractionService.activateView(disableViewOnly);
  }

  deactivate(){
    
    this.linkInteractionService.deactivateView();
  }

  attached() {

    setTimeout(() => {

      this.setFocus('searchText');
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

  get pagedItems() {

    if (!this.pages) {
      return;
    }

    return this.pages[this.currentPage];
  }

  get showNext() {

    if (this.pages)
      return this.currentPage < this.pages.length - 1;
  }

  get showPrev() {

    return this.currentPage > 0;
  }

  next() {

    this.currentPage++;
  }

  prev() {

    this.currentPage--;
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

  startsWith(item, searchText) {

    let found = false;
    
    for(var i in item) {
      
      if(found) return found;
      if(!item[i]) continue;
      
      let value = typeof value === 'text' ? item[i].value.toLowerCase() : item[i].toString().toLowerCase();
      
      if(value.startsWith(searchText.toLowerCase())) {
        
        found = true;
      }
    }

//    if (item['channel'] && item['channel'].toLowerCase().startsWith(searchText.toLowerCase())) {
//
//      found = true;
//    } else if (item['from'] && item['from'].toLowerCase().startsWith(searchText.toLowerCase())) {
//
//      found = true;
//    } else if (item['to'] && item['to'].toLowerCase().startsWith(searchText.toLowerCase())) {
//
//      found = true;
//    } else if (item['status'] && item['status'].toLowerCase().startsWith(searchText.toLowerCase())) {
//
//      found = true;
//    } else if (item['type'] && item['type'].toLowerCase().startsWith(searchText.toLowerCase())) {
//
//      found = true;
//    }

    return found;
  }

  cancel() {

    // TODO implement cancel
  }

  searchConversation() {

    this.router.navigate('search');
  }

  viewConversation() {

    let conversationId = this.conversationId;
    
    this.router.navigate(`view/${conversationId}/call`);
  }

  selectInteraction(interaction) {

    interaction.selected = !interaction.selected;

    let selectedInteractions = [];
    let interactionId = interaction.interactionId;

    for (let interaction of this._allItems) {
      if (interaction.selected) {
        selectedInteractions.push(interaction);
      }
    }

    if (interaction.selected) {
      this.linkInteractionService.linkInteraction(this.conversationId, interactionId, selectedInteractions);
    } else {
      this.linkInteractionService.unlinkInteraction(this.conversationId, interactionId, selectedInteractions);
    }

  }

  back() {

    let selectedInteractions = this.linkInteractionStore.selectedInteractions;
    
    if(selectedInteractions){
    
      for (let interaction of selectedInteractions) {

        let interactionId = interaction.interactionId;
        this.linkInteractionService.unlinkInteraction(this.conversationId, interactionId, []);
      }
    }
      
    this.router.navigateBack();
  }

  @handle(LINK_INTERACTION_ACTIONS.RETRIEVE_INTERACTIONS)
  @waitFor(LinkInteractionStore)
  handleRetrieveInteractions(event) {
    
    let interactions = this.linkInteractionStore.interactions;
    
    this._allItems = interactions;
    this.initPages();
  }

  @handle(LINK_INTERACTION_ACTIONS.UPDATE_INTERACTION)
  @waitFor(LinkInteractionStore)
  handleUpdateInteractions(event) {
    
    let interactions = this.linkInteractionStore.interactions;
    
    this._allItems = interactions;
    this.initPages();
  }

  @handle(LINK_INTERACTION_ACTIONS.INSERT_INTERACTION)
  @waitFor(LinkInteractionStore)
  handleInsertInteractions(event) {
    
    let interactions = this.linkInteractionStore.interactions;

    this._allItems = interactions;
    this.initPages();
  }

  @handle(LINK_INTERACTION_ACTIONS.LINK_INTERACTION)
  handleLinkInteraction(event) {

    if (this.autoLink) {
      
      setTimeout(() => {

        this.router.navigate(`view/${this.conversationId}/call`);
      });
    }
  }

}

