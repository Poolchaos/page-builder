/*
*/
import {PROMPT_ACTIONS, PromptService, PromptFactory} from 'zailab.framework';
/*
*/
import {customElement, inject, bindable, LogManager} from 'aurelia-framework';
import {handle} from 'aurelia-flux';
/*
*/
const MAGIC_NUMBER = 55;
/*
*/
const logger = LogManager.getLogger('DashboardCampInterface');
/*
*/
@customElement('dashboard-camp-interface')
@inject(PromptService, PromptFactory)
export class DashboardCampInterface {

  name = null;
  width = null;
  dashboardCampSearchInput = null;
  showCamp = true;
  hasDashboardCampSearchInput = false;
  hasItems = false;

  @bindable properties;
  @bindable settings;
  @bindable prompt;
  @bindable items;

  constructor(promptService, promptFactory) {

    this.promptService = promptService;
    this.promptFactory = promptFactory;
  }

  get isShowCamp() {

    this.hasItems = this.items && isSelectedItems(this.items);
    
    let result = (this.showCamp && this.hasItems) || this.name;

    return result;
  }

  get display() {
    return this.properties.display || 'name';
  }

  bind() {

    this.showCamp = this.items && isSelectedItems(this.items);
    this.init();
  }

  init() {

    if (!this.items || !this.settings) {
      return;
    }

    this.tryFocus();

    this.allItems = this.items;
    this.search();
  }

  attached() {

    this.hasDashboardCampSearchInput = true;
    this.tryFocus();
  }

  tryFocus(delay) {

    if (!this.hasDashboardCampSearchInput || !this.settings) {
      return;
    }

    if (delay) {
      setTimeout(() => {
        this.tryFocus();
      }, delay);
      return;
    }

    this.dashboardCampSearchInput.focus();

    if (this.width === null) {

      let multiplier = 0;
      if (this.settings.add.enabled === false) {
        multiplier++;
      }
      if (this.settings.delete.enabled === false) {
        multiplier++;
      }

      let focusStyleWidth = this.dashboardCampSearchInput.style.width;
      focusStyleWidth = focusStyleWidth.substring(0, focusStyleWidth.indexOf('px'));

      this.width = focusStyleWidth * 1 + (MAGIC_NUMBER * multiplier);
    }

    let focusStyleWidth = this.deleting ? this.width - MAGIC_NUMBER : this.width;

    this.dashboardCampSearchInput.style.width = focusStyleWidth + 'px';  // TODO animate the width transition
  }

  search() {

    if (!this.name || this.name.length === 0) {

      this.items = this.allItems;
      return;
    }

    this.items = [];

    for (let item of this.allItems) {

      if (item[this.display].toLowerCase().indexOf(this.name.toLowerCase()) === -1) {
        continue;
      }

      this.items.push(item);
    }
  }

  add() {

    this.tryFocus();

    if (this.settings.add.enabled === false) {
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

    if (this.settings.select.auto) {
      addItem.isSelected = true;
    }

    this.allItems.push(addItem);
    this.search();
  }

  delete() {

    if (this.deleting) {

      this.deleteAccept();
      this.tryFocus(MAGIC_NUMBER);
    } else {

      this.deleting = true ;
      this.tryFocus();
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

    this.tryFocus(MAGIC_NUMBER);
  }

  select(item) {

    if (this.deleting) {

      item.isMarked = item.isMarked === true ? false : true;
      return;
    }

    this.edit(item);
  }

  edit(item) {

    if (!this.prompt) {
      return;
    }

    let prompt = this.promptFactory.buildFormPrompt(this.prompt.title, item, this.prompt.acceptAction, this.prompt.cancelAction);

    this.promptService.openPrompt(prompt);
  }

  @handle(PROMPT_ACTIONS.OPEN_PROMPT)
  handleOpenPrompt(action, option) {

    this.showCamp = false;
    
    this.deleting = false;
    this.name = '';
    this.search();
    
    setTimeout(() => {
    this.campOpenClass = '';
    }, 500);
  }

  @handle(PROMPT_ACTIONS.CLOSE_PROMPT)
  handleClosePrompt(action, option) {

    this.showCamp = true;
    
    this.tryFocus(MAGIC_NUMBER);
    
    setTimeout(() => {
    this.campOpenClass = 'prompt-open';
    }, 500);
  }
}
/*
*/
function isSelectedItems(items) {

  for (let item of items) {

    if (item.isSelected) {
      return true;
    }
  }

  return false;
}
