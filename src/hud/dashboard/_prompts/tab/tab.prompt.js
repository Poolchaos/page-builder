/*
*/
import {SortTools} from 'zailab.common';
/*
*/
import {PromptStore} from '../prompt.store';
import {PromptService} from '../prompt.service';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
/*
*/
const logger = LogManager.getLogger('TabPrompt');
/*
*/
@inject(PromptStore, PromptService)
export class TabPrompt {

  selectedTabIndex = 0;

  constructor(promptStore, promptService) {

    this.promptStore = promptStore;
    this.promptService = promptService;

    this.init();
  }

  init() {

    if (!this.promptStore.items || !this.promptStore.settings) {
      return;
    }

    logger.debug('init > this.display = ', this.display);

    this.promptStore.items.sort(SortTools.compareBy(this.display));
    let length = this.promptStore.items.length;
    for (let i = 0; i < length; i++) {
      
      let tab = this.promptStore.items[i];      
      tab.index = i;
      
      if (tab.items) {
        tab.items.sort(SortTools.compareBy(this.display));
      }
    }
  }

  get selectedTab() {

    if (!this.promptStore.items) {
      return {};
    }

    let tab = this.promptStore.items[this.selectedTabIndex] || {};
    tab.isSelected = true;
    return tab;
  }

  get display() {

    return 'name';
  }

  get settings() {

    return {};
  }

  get pageSize() {

    return 6;
  }

  select(item) {

    if (item.isTab) {

      this.selectedTabIndex = item.index;

      for (let tabItem of this.promptStore.items) {

        tabItem.isSelected = false;
      }

      item.isSelected = true;
    } else {

      item.isSelected = !item.isSelected;

      this.promptService.actionItem(this.promptStore.acceptAction, item);
    }
  }
}
