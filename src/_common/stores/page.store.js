/*
*/
import {inject, LogManager} from 'aurelia-framework';
/*
*/
import {PAGE_LAYOUT} from './page.layout';
/*
*/
const logger = LogManager.getLogger('PageStore');

let STATE = PAGE_LAYOUT;

export class PageStore {
  
  get events() {
    
    return STATE.items;
  }
}