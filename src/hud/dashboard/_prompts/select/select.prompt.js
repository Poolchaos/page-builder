/*
*/
import {SortTools} from 'zailab.common';
/*
*/
import {PROMPT_ACTIONS} from '../prompt.actions';
import {PromptStore} from '../prompt.store';
import {PromptService} from '../prompt.service';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {handle, waitFor} from 'aurelia-flux';
/*
 */
import uuid from 'node-uuid';
/*
*/
const MAGIC_NUMBER = 55;
/*
*/
const logger = LogManager.getLogger('SelectPrompt');
/*
*/
@inject(PromptStore, PromptService)
export class SelectPrompt {

  allItems = null;
  name = null;
  width = null;
  controller = null;

  items = [];
  rendered = false;

  showSearchInput = false;

  constructor(promptStore, promptService) {

    this.promptStore = promptStore;
    this.promptService = promptService;

    this.promptService.onAttached((controller) => {

      this.controller = controller;
      this.init();
    });
  }

  get searchField() {
    return this.promptStore.display || 'name';
  }

  get pageSize() {
    return 6;
  }

  get showSearch() {
    return this.items.length > this.pageSize || (this.name && this.name.length > 0);
  }

  init() {

    if (!this.promptStore.items || !this.promptStore.settings) {
      return;
    }

    this.width = null;

    this.allItems = this.promptStore.items;

    this.allItems.sort((item1, item2) => {

      let value1 = item1[this.searchField];
      if (value1 instanceof Array) {
        value1 = value1[0];
      }

      let value2 = item2[this.searchField];
      if (value2 instanceof Array) {
        value2 = value2[0];
      }

      if (value1.toLowerCase() > value2.toLowerCase()) {
        return 1;
      }

      if (value1.toLowerCase() < value2.toLowerCase()) {
        return -1;
      }

      return 0;
    });

    this.search();

    this.rendered = true;
  }

  attached() {

    this.hasfocus = true;
  }

  get showSearch() {

    return this.showSearchInput;
  }

  toggleSearch() {

    this.showSearchInput = !this.showSearchInput;

    if (this.showSearch) {

      this.focusSearchInput(100);
    } else {

      this.name = null;
      this.search();
    }
  }

  focusSearchInput(delay) {

    if (!this.hasfocus) {
      return;
    }

    if (delay) {
      setTimeout(() => {
        this.focusSearchInput();
      }, delay);
      return;
    }

    this.searchInput.focus();
  }

  search() {

    let length = this.items.length;
    for (let i = 0; i < length; i++) {
      this.items.pop();
    }

    if (!this.name || this.name.length === 0) {

      for (let item of this.allItems) {
        this.items.push(item);
      }
      return;
    }

    for (let item of this.allItems) {
      
      let value = item[this.searchField];
      if (value instanceof Array) {
        value = value[0];
      }
      
      if (value.toLowerCase().startsWith(this.name.toLowerCase()) === false) {
        continue;
      }

      this.items.push(item);
    }
  }

  add() {

    if (this.promptStore.settings.add.enabled === false) {
      return;
    }

    if (!this.name) {
      return;
    }

    for (let item of this.allItems) {

      if (item.name === this.name) {
        return;
      }
    }

    let addItem = {
      id: uuid.v4(),
      name: this.name
    };

    if (this.promptStore.settings.select.auto) {
      addItem.isSelected = true;
    }

    this.allItems.push(addItem);
    this.search();
  }

  delete() {

    if (this.deleting) {
      this.deleteAccept();
    } else {
      this.deleting = true;
    }
  }

  deleteAccept() {

    this.items = [];

    for (let item of this.allItems) {

      if (item.isMarked) {

        item.isMarked = false;
        continue;
      }

      this.items.push(item);
    }

    let length = this.allItems.length;

    for (var i = 0; i < length; i++) {
      this.allItems.pop();
    }

    for (let item of this.items) {
      this.allItems.push(item);
    }

    this.search();

    this.deleting = false;
  }

  deleteCancel() {

    this.deleting = false;

    for (let item of this.allItems) {

      item.isMarked = false;
    }

    this.search();
  }

  select(item) {

    if (item.clickable === false) {
      return;
    }

    if (this.deleting) {

      item.isMarked = item.isMarked === true ? false : true;
      return;
    }

    if (this.promptStore.settings.select.multi.enabled === false) {

      for (let item of this.allItems) {

        if (item.isSelected) {

          item.isSelected = false;
        }
      }
    }

    item.isSelected = item.isSelected === true ? false : true;

    if (this.promptStore.settings.select.multi.enabled === false) {

      this.controller.ok();
    } else {

      this.promptService.actionItem(this.promptStore.acceptAction, item);
    }
  }
}
