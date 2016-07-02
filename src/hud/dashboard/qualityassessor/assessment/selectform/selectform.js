/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
import {Router} from 'aurelia-router';
/*
*/
import {SELECT_FORM_ACTIONS} from './selectform.actions';
import {SelectFormService} from './selectform.service';
import {SelectFormStore} from './selectform.store';
/*
*/
const logger = LogManager.getLogger('SelectForm');
/*
*/
@inject(Router, SelectFormService, SelectFormStore)
export class SelectForm {

  constructor(router, selectFormService, selectFormStore){
    
    this.router = router;
    this.selectFormService = selectFormService;
    this.selectFormStore = selectFormStore;
  }
  
  resolve;
  _pagesize = 10;
  currentPage;
  pages;
  hasSearched;
  searchText;
  allItems;
  showSearch;

  canActivate(params) {
    this.firstName = params.firstName;
    this.surname = params.surname;
    this.memberId = params.memberId;
    this.channel = params.channel;

    this.selectFormService.retrieveForms();

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

  get enableSearch(){
    
    let pages = this.allItems.length / this._pagesize;

    if(pages > 1){
      return true;
    }
    
    return false;
  }

  toggleSearch(){
    
    this.showSearch = !this.showSearch;
    
    setTimeout(() => {

      this.setFocus('searchText');
    }, 500);
  }

  add(){
    
    this.router.navigate('create');
  }

  @handle(SELECT_FORM_ACTIONS.RETRIEVE_FORMS)
  @waitFor(SelectFormStore)
  handleRetrieveForms(action, forms) {

    this.allItems = forms;
    this.initPages();
    this.addPlaceholders();
    this.resolve(true);
  }

  selectForm(form){
    
    let formId = form.formId;
    
    if(!formId){
      return;
    }
    
    this.router.navigate(`questions/${formId}?firstName=${this.firstName}&surname=${this.surname}&memberId=${this.memberId}&channel=${this.channel}`);
    
  }
  
  cancel(){

    this.router.parent.parent.parent.navigate('interactionlog');
  }

}
