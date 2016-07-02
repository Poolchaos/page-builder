import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
import {Router} from 'aurelia-router';
/*
*/
import {UNLINK_INTERACTION_ACTIONS}  from './unlinkinteraction.actions';
import {UnlinkInteractionService}  from './unlinkinteraction.service';
import {UnlinkInteractionStore}  from './unlinkinteraction.store';
import {ConversationStore} from '../conversation.store';
import {HUD_ACTIONS}  from '../../hud.actions';
/*
*/
const logger = LogManager.getLogger('UnlinkInteraction');

@inject(Router, UnlinkInteractionService, UnlinkInteractionStore, ConversationStore)
export class UnlinkInteraction {

  resolve;
  _allItems = [];
  _pagesize = 8;
  searchText;
  selectedInteractions = [];

  constructor(router, unlinkInteractionService, unlinkInteractionStore, conversationStore) {

    this.router = router;
    this.unlinkInteractionService = unlinkInteractionService;
    this.unlinkInteractionStore = unlinkInteractionStore;
    this.conversationStore = conversationStore;
  }

  activate(params){
    
    this.conversationId = params.conversationId;
    
    this.unlinkInteractionService.retrieveInteractions(this.conversationId);
    this.unlinkInteractionService.activateView();
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

//    let found = false;
//
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

  viewConversation() {
    let conversationId = this.conversationId;

    this.router.navigate(`view/${conversationId}/call`);
  }

  selectInteraction(interaction) {

    interaction.selected = !interaction.selected;

    let selectedInteractions = [];
    let conversationId = this.conversationId;
    let interactionId = interaction.interactionId;

    for (let interaction of this._allItems) {
      if (interaction.selected) {
        selectedInteractions.push(interaction);
      }
    }

    if (interaction.selected) {
      this.unlinkInteractionService.unlinkInteraction(conversationId, interactionId, selectedInteractions);
    } else {
      this.unlinkInteractionService.linkInteraction(conversationId, interactionId, selectedInteractions);
    }

  }

  back() {

    let conversationId = this.conversationId;
    let selectedInteractions = this.unlinkInteractionStore.selectedInteractions;
    
    if(selectedInteractions){
    
      for (let interaction of selectedInteractions) {

        let interactionId = interaction.interactionId;
        this.unlinkInteractionService.linkInteraction(conversationId, interactionId, []);
      }
    }
    
    this.router.navigateBack();
  }

  @handle(UNLINK_INTERACTION_ACTIONS.RETRIEVE_INTERACTIONS)
  @waitFor(UnlinkInteractionStore)
  handleRetrieveInteractions(event) {

    let interactions = this.unlinkInteractionStore.interactions;
    this._allItems = interactions;
    this.initPages();
  }

}

