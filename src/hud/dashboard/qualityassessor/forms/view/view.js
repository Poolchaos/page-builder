/*
 */
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {handle, waitFor} from 'aurelia-flux';
import {DialogService} from 'aurelia-dialog';
import {ViewSearchDialog} from './viewsearchdialog';

import {HUD_ANIMATOR_EVENTS}  from '../../../../hud.animator.events';
/*
 */
import {VIEW_ACTIONS} from './view.actions.js';
import {ViewService} from './view.service.js';
import {ViewStore} from './view.store.js';

import {EventAggregator} from 'aurelia-event-aggregator';
/*
 */
const logger = LogManager.getLogger('View');
/*
 */
@inject(DialogService, EventAggregator,  Router, ViewService, ViewStore)
export class View {

  resolve;
  _pagesize = 15;
  currentPage;
  pages;
  hasSearched;
  searchText;
  allItems;
  showSearch;
  memberName;

  constructor(dialogService, eventAggregator,router, viewService, viewStore){

    this.router = router;
    this.viewService = viewService;
    this.viewStore = viewStore;
    this.dialogService = dialogService;
    this.eventAggregator = eventAggregator;
  }

  activate(params){

    let memberId = params.memberId;
    this.viewService.retrieveForms(memberId);
    
    this.memberName = params.memberName ? params.memberName : '';
    //this.addPlaceholders();
  }


/*  canActivate(params) {

    let memberId = params.memberId;
    this.viewService.retrieveForms(memberId);

    return new Promise((resolve) => {
      this.resolve = resolve;
    });
  }*/

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

  next() {

    this.currentPage++;
  }

  prev() {

    this.currentPage--;
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

  search() {

    if (!this.allItems || this.allItems.length === 0) {

      return;
    }

    if (!this.searchText || this.searchText.length === 0) {

      this.initPages();
      this.addPlaceholders();
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

    this.addPlaceholders();

  }

  addPlaceholders(){

    if(this.pages.length === 0){
      
      this.pages = [[]];
      
      for(let i of this._pagesize){
        this.pages[0].push({isPlaceholder: true});
      }
      
      this.pageItems = this.pages[0];
      return;
    }
    
    for(let page in this.pages){

      let remainingSpaces = this._pagesize - this.pages[page].length;

      for(let i of remainingSpaces){
        this.pages[page].push({isPlaceholder: true});
      }
    }
  }

  startsWith(item, searchText) {

    let found = false;

    if (item['name'] && item['name'].toLowerCase().startsWith(searchText.toLowerCase())) {

      found = true;
    }

    return found;
  }

  toggleSearch(){

    this.showSearch = !this.showSearch;

    setTimeout(() => {

      this.setFocus('searchText');
    }, 500);
  }

  back(){
    this.router.navigateBack();
  }

  selectForm(form){

    let assessmentId = form.assessmentId;
    
    if(!assessmentId){
      return;
    }
    
    this.router.navigate(`performedassessment/${assessmentId}`);
  }

  openSearch(){
    this.dialogService.open({
      viewModel: ViewSearchDialog,
      model: this
    }).then(response => {
      if (!response.wasCancelled) {

      } else {
        this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.CLOSE_POPUP);
      }
    });

    this.eventAggregator.publish(HUD_ANIMATOR_EVENTS.OPEN_POPUP);
  }

  @handle(VIEW_ACTIONS.RETRIEVE_FORMS)
  @waitFor(ViewStore)
  handleRetrieveForms() {
    this.allItems = this.viewStore.forms;
    this.initPages();
    this.addPlaceholders();
  }

}
