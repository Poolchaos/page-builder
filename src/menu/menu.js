/*
*/
import {MenuStore} from './menu.store.js';
/*
*/
import {inject, LogManager} from 'aurelia-framework';
import {Router} from 'aurelia-router';
/*
*/
const logger = LogManager.getLogger('Menu');

@inject(MenuStore, Router)
export class Menu {
  
  constructor(menuStore, router) {
    
    this.menuStore = menuStore;
    this.router = router;
    this.init();
  }
  
  init() {
    
    logger.debug(' menu initialised ');
  }
  
  navigate(step) {
    
    this.router.navigate(step);
  }
}