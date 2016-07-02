/*
*/
import {inject, LogManager} from 'aurelia-framework';
/*
*/
const logger = LogManager.getLogger('Crud');
/*
*/
const MAGIC_NUMBER = 55;
/*
*/
export class Crud {

  _settings;
  _items;
  _pageSize = 12;

  deleting = false;
  width = null;
  searchText = null;
  searchInput = null;
  hasSearchInput = false;
  displaySearch = false;
  canSelect = true;

  constructor(_settings) {

    this.setSettings(_settings);

    if (_settings) {
      logger.warn('constructor > rather use setSettings');
    }
  }

  get showDelete() {

    return this._settings.delete.enabled && this._items && this._items.length > 0;
  }

  get showAdd() {

    return this._settings.add.enabled;
  }

  // called by child

  reset(_items) {

    this._items = _items;

    this.init();
  }

  setItems(_items) {
    
//    _items.sort((item1, item2) => {
//      
//      if (item1[this.display] > item2[this.display]) {
//        return 1;
//      }
//      
//      if (item1[this.display] < item2[this.display]) {
//        return -1;
//      }
//      
//      return 0;
//    });

    this._items = _items;

    this.init();
  }

  setSettings(_settings) {

    if (_settings) {
      this._settings = _settings;
    }
  }

  // overridden by child

  get display() {

    return 'text';
  }

  get emptyListDisplay() {

    return 'The list is empty!';
  }

  add() {

    logger.warn('add > unimplemented');
  }
  
  nothing() {
    logger.info('not doing anything');
  }

  change() {

    logger.warn('change > unimplemented');
  }

  remove(item) {

    logger.warn('remove > unimplemented');
  }

  compare(item, searchText) {
    
    if (item[this.display] instanceof Array) {
      
      for (let text of item[this.display]) {
        
        let compareText = text + '';

        if (compareText.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
          return true;
        }
      }

      return false;
    }

    return item[this.display].toLowerCase().indexOf(searchText.toLowerCase()) !== -1;
  }

  // module actions
  
  toggleSearch() {

    if (this.displaySearch) {
      
      this.searchText = null;
      this.displaySearch = false;
      this.search();
    } else {
      
      this.displaySearch = true;
      this.tryFocus(MAGIC_NUMBER);
    }
  }

  search() {

    if (!this.allItems || this.allItems.length === 0) {

      return;
    }

    if (!this.searchText || this.searchText.length === 0) {

      this._items = this.allItems;
      return;
    }

    this._items = [];

    for (let item of this.allItems) {

      if (this.compare(item, this.searchText) === true) {

        this._items.push(item);
      }
    }
  }

  delete() {
    this.deleting = true;
    this.tryFocus(MAGIC_NUMBER);
  }

  deleteAccept() {

    this._items = [];
    
    let itemsToRemove = [];
    
    for (let item of this.allItems) {

      if (item.isMarked) {
        itemsToRemove.push(item);
        item.isMarked = false;
        /*this.remove(item);*/
        continue;
      }
        
      this._items.push(item);
    }
    
    this.remove(itemsToRemove);
    let length = this.allItems.length;

    for (var i = 0; i < length; i++) {
      this.allItems.pop();
    }

    for (let item of this._items) {
      this.allItems.push(item);
    }

    this.search();

    this.deleting = false;
    this.tryFocus(MAGIC_NUMBER);
  }

  deleteCancel() {

    this.deleting = false;

    for (let item of this.allItems) {

      item.isMarked = false;
    }

    this.search();

    this.tryFocus(MAGIC_NUMBER);
  }

  select(item) {

    if(!this.canSelect){
      return;  
    }
    
    if (this.deleting) {

      item.isMarked = item.isMarked === true ? false : item.isSelected ? false : true;
      return;
    } 
    
    if (this._settings.edit.enabled) {

      this.change(item);
    }
    
    this.canSelect = false;
    setTimeout(()=>{
      this.canSelect = true;
    },200);
    
  }

  // aurelia calls these

  bind() {

    this.init();
  }

  attached() {

    this.hasSearchInput = true;
    this.tryFocus(MAGIC_NUMBER);
  }

  // initiation of the module

  init() {

    this.tryFocus(MAGIC_NUMBER);

    this.allItems = this._items;
    this.search();
  }

  // focus and adjust the width of the search input

  tryFocus(delay) {

    if (!this.displaySearch || !this._settings) {
      return;
    }

    if (delay) {
      setTimeout(() => {
        this.tryFocus();
      }, delay);
      return;
    }

    setTimeout(() => {
      this.searchInput.focus();
    }, 500);
  }
}
