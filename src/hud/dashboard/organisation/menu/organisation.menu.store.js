/*
*/
import {ORGANISATION_MENU_ACTIONS} from './organisation.menu.actions';
/*
*/
import {handle} from 'aurelia-flux';
/*
*/
let STATE = {
  
  menu: null
}
/*
*/
export class OrganisationMenuStore {
  
  get menu() {
    return STATE.menu;
  }
  
  get isReady() {
    return this.menu !== null && this.menu.length > 0;
  }
  
  @handle(ORGANISATION_MENU_ACTIONS.RETRIEVE_ORGANISATION_MENU)
  handleRetrieveOrganisationMenu(action, menu) {
    
    STATE.menu = menu;
  }
}