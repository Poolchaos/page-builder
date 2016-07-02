/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {handle, waitFor} from 'aurelia-flux';
/*
*/
import {LIST_ACTIONS} from './list.actions';
import {ListService} from './list.service';
import {ListStore} from './list.store';
/*
*/
const logger = LogManager.getLogger('FormsList');
/*
*/
@inject(Router, ListService, ListStore)
export class List {
  
  resolve;
  _pagesize = 12;
  currentPage;
  pages;
  hasSearched;
  searchText;
  allItems;
  showSearch;
  
  constructor(router, listService, listStore){
    
    this.router = router;
    this.listService = listService;
    this.listStore = listStore;
  }

  canActivate(params) {

    this.listService.retrieveForms();

    return new Promise((resolve) => {
      this.resolve = resolve;
    });
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

  get enableSearch(){
    
    let pages = this.allItems.length / this._pagesize;

    if(pages > 1){
      return true;
    }
    
    return false;
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

  add(){
    
    this.router.navigate('create');
    this.listService.clearState();
  }

  selectForm(form){
    
    logger.warn('selectForm > unimplimented > form > ', form);
  }

  @handle(LIST_ACTIONS.RETRIEVE_FORMS)
  @waitFor(ListStore)
  handleRetrieveForms(action, forms) {
 
    this.allItems = forms;
    this.initPages();
    this.addPlaceholders();
    this.resolve(true);
  }

}
