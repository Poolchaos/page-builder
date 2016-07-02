/*
*/
import {inject, LogManager} from 'aurelia-framework';
/*
*/
const logger = LogManager.getLogger('PageStore');

export class PageStore {
  
  constructor() {
    
    logger.debug(' page store initialised ');
  }
}