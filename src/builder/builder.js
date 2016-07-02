/*
*/
import {inject, LogManager} from 'aurelia-framework';
/*
*/
const logger = LogManager.getLogger('Builder');

export class Builder {
  
  constructor() {
    
    this.init();
  }
  
  init() {
    
    logger.debug(' builder initialised ');
  }
}