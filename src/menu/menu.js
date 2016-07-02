/*
*/
import {inject, LogManager} from 'aurelia-framework';
/*
*/
const logger = LogManager.getLogger('Menu');

export class Menu {
  
  constructor() {
    
    this.init();
  }
  
  init() {
    
    logger.debug(' menu initialised ');
  }
}