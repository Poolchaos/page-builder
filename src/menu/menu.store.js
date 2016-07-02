/*
*/
import {LogManager} from 'aurelia-framework';
/*
*/
const logger = LogManager.getLogger('MenuStore');

let STATE = {
  menuOptions: [{
    text: 'menu',
    active: true,
    view: 'menu'
  }, {
    text: 'create',
    view: 'builder'
  }]
};

export class MenuStore {
  
  get menuOptions() {
    
    return STATE.menuOptions;
  }
}